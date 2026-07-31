import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/storage.dart';
import '../core/api_client.dart';
import '../models/user.dart';
import '../providers/db_provider.dart';
import '../services/notification_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  bool _rememberMe = false;
  String? _errorMessage;
  DbProvider? _dbProvider;

  User? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _isLoading;
  bool get rememberMe => _rememberMe;
  String? get errorMessage => _errorMessage;

  /// Attach a reference to DbProvider so we can reload data on login/logout.
  void attachDbProvider(DbProvider db) {
    _dbProvider = db;
  }

  AuthProvider() {
    _loadUser();
    ApiClient.onSuspended = (msg) {
      if (_currentUser != null) {
        logout();
      }
      _errorMessage = msg;
      notifyListeners();
    };
  }

  void _loadUser() {
    final cached = StorageService.getUser();
    if (cached != null) {
      _currentUser = User.fromJson(cached);
      // Restore user-scoped storage keys
      StorageService.setCurrentUserId(_currentUser!.id);

      // Save FCM Token & user profile to Firestore
      NotificationService().saveUserTokenToFirestore(
        userId: _currentUser!.id,
        name: _currentUser!.businessName,
        email: _currentUser!.email,
        role: 'owner',
      );

      notifyListeners();
    }
  }

  void updateBusinessName(String newName) {
    final clean = newName.trim();
    if (clean.isEmpty) return;
    if (_currentUser != null && _currentUser!.businessName != clean) {
      _currentUser = User(
        id: _currentUser!.id,
        email: _currentUser!.email,
        businessName: clean,
        token: _currentUser!.token,
      );
      StorageService.saveUser(_currentUser!.toJson());
      notifyListeners();
    }
  }

  void setRememberMe(bool value) {
    _rememberMe = value;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post('/auth/login', {
        'email': email.trim().toLowerCase(),
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['access_token'] as String;
        final userProfile = data['user'] as Map<String, dynamic>;

        _currentUser = User(
          id: userProfile['id'].toString(),
          email: userProfile['email'] as String,
          businessName: userProfile['name'] as String,
          token: token,
        );

        // Set user-scoped storage keys BEFORE saving/loading any data
        StorageService.setCurrentUserId(_currentUser!.id);
        await StorageService.saveUser(_currentUser!.toJson());

        // Bind FCM token with user mobile/phone
        final userMobile = (userProfile['mobile'] ?? userProfile['phone'] ?? _currentUser!.email).toString();
        if (userMobile.isNotEmpty) {
          NotificationService().bindUserMobile(userMobile);
        }

        // Save FCM Token & user profile to Cloud Firestore under users/{user_uid}
        NotificationService().saveUserTokenToFirestore(
          userId: _currentUser!.id,
          name: _currentUser!.businessName,
          email: _currentUser!.email,
          role: 'owner',
        );

        // Reload DbProvider data for this specific user
        _dbProvider?.reloadForUser();

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        try {
          final data = jsonDecode(response.body);
          _errorMessage = data['error'] as String?;
        } catch (_) {
          _errorMessage = 'Login failed (${response.statusCode})';
        }
      }
    } catch (e) {
      debugPrint("Login error: $e");
      _errorMessage = 'Network error: Could not connect to backend server. Please ensure backend is running.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> updateProfile({
    required String name,
    required String email,
    String? password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final payload = <String, dynamic>{
        'id': _currentUser?.id,
        'name': name.trim(),
        'email': email.trim().toLowerCase(),
      };
      if (password != null && password.trim().isNotEmpty) {
        payload['password'] = password.trim();
      }

      final response = await ApiClient.put('/auth/profile', payload);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['user'] != null) {
          final updatedUserMap = data['user'] as Map<String, dynamic>;
          _currentUser = User(
            id: updatedUserMap['id'].toString(),
            email: updatedUserMap['email'] as String,
            businessName: updatedUserMap['name'] as String,
            token: _currentUser?.token ?? '',
          );
          await StorageService.saveUser(_currentUser!.toJson());
          _isLoading = false;
          notifyListeners();
          return true;
        }
      }
      // Fallback for offline mode or demo
      _currentUser = User(
        id: _currentUser?.id ?? '1',
        email: email.trim().toLowerCase(),
        businessName: name.trim(),
        token: _currentUser?.token ?? '',
      );
      await StorageService.saveUser(_currentUser!.toJson());
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("Update profile error: $e");
      // Offline fallback
      if (_currentUser != null) {
        _currentUser = User(
          id: _currentUser!.id,
          email: email.trim().toLowerCase(),
          businessName: name.trim(),
          token: _currentUser!.token,
        );
        await StorageService.saveUser(_currentUser!.toJson());
      }
      _isLoading = false;
      notifyListeners();
      return true;
    }
  }

  Future<bool> forgotPassword(String email) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post('/auth/forgot-password', {
        'email': email.trim().toLowerCase(),
      });

      _isLoading = false;
      if (response.statusCode == 200 || response.statusCode == 201) {
        notifyListeners();
        return true;
      } else {
        try {
          final data = jsonDecode(response.body);
          _errorMessage = data['error'] as String? ?? 'Account check failed.';
        } catch (_) {
          _errorMessage = 'Account check failed (${response.statusCode})';
        }
        notifyListeners();
        return false;
      }
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Network error: Could not connect to backend server.';
      notifyListeners();
      return false;
    }
  }

  Future<bool> resetPassword(String email, String newPassword) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post('/auth/reset-password', {
        'email': email.trim().toLowerCase(),
        'new_password': newPassword.trim(),
      });

      _isLoading = false;
      if (response.statusCode == 200 || response.statusCode == 201) {
        notifyListeners();
        return true;
      } else {
        try {
          final data = jsonDecode(response.body);
          _errorMessage = data['error'] as String? ?? 'Password reset failed.';
        } catch (_) {
          _errorMessage = 'Password reset failed (${response.statusCode})';
        }
        notifyListeners();
        return false;
      }
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Network error: Could not connect to backend server.';
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    // Simulate network API call latency
    await Future.delayed(const Duration(milliseconds: 500));

    _currentUser = null;
    StorageService.setCurrentUserId(null);
    await StorageService.saveUser(null);

    // Clear DbProvider data so next login starts fresh
    _dbProvider?.reloadForUser();

    _isLoading = false;
    notifyListeners();
  }
}
