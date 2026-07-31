import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../core/api_client.dart';
import '../core/storage.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();
  static Map<String, String>? _pendingNotification;

  final FlutterLocalNotificationsPlugin _localNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static const String _channelId = 'pos_notifications_channel';
  static const String _channelName = 'POS Notifications';
  static const String _channelDescription =
      'Notifications for POS inventory, user alerts and admin messages';

  bool _isInitialized = false;
  Timer? _syncTimer;
  String? _registeredMobile;
  String? _currentUserId;
  String? _currentUserName;
  String? _currentUserEmail;
  final Set<String> _seenAdminNoteIds = {};

  static void checkPendingNotification() {
    if (_pendingNotification != null && navigatorKey.currentContext != null) {
      final pending = _pendingNotification!;
      _pendingNotification = null;
      handleNotificationTap(
        title: pending['title'] ?? 'POS Notification',
        body: pending['body'] ?? '',
        payload: pending['payload'],
      );
    }
  }

  static void handleNotificationTap({
    required String title,
    required String body,
    String? payload,
  }) {
    final context = navigatorKey.currentContext;
    if (context != null) {
      showNotificationDetailDialog(
        context,
        title: title,
        body: body,
        payload: payload,
      );
    } else {
      _pendingNotification = {
        'title': title,
        'body': body,
        'payload': payload ?? '',
      };
    }
  }

  static void showNotificationDetailDialog(
    BuildContext context, {
    required String title,
    required String body,
    String? payload,
  }) {
    String? actionType;
    String? rawTime;
    String? formattedTime;
    if (payload != null && payload.isNotEmpty) {
      try {
        final Map<String, dynamic> data = jsonDecode(payload);
        actionType =
            data['type']?.toString() ?? data['action_type']?.toString();
        rawTime =
            data['timestamp']?.toString() ??
            data['created_at']?.toString() ??
            data['time']?.toString();
      } catch (_) {}
    }

    if (rawTime != null && rawTime.isNotEmpty) {
      try {
        final dt = DateTime.parse(rawTime).toLocal();
        final hour = dt.hour > 12
            ? dt.hour - 12
            : (dt.hour == 0 ? 12 : dt.hour);
        final ampm = dt.hour >= 12 ? 'PM' : 'AM';
        final minute = dt.minute.toString().padLeft(2, '0');
        formattedTime = "$hour:$minute $ampm, ${dt.day}/${dt.month}/${dt.year}";
      } catch (_) {
        formattedTime = rawTime;
      }
    }

    final now = DateTime.now();
    final hourNow = now.hour > 12
        ? now.hour - 12
        : (now.hour == 0 ? 12 : now.hour);
    final ampmNow = now.hour >= 12 ? 'PM' : 'AM';
    final minuteNow = now.minute.toString().padLeft(2, '0');
    formattedTime ??=
        "$hourNow:$minuteNow $ampmNow, ${now.day}/${now.month}/${now.year}";

    showDialog(
      context: context,
      builder: (ctx) {
        final theme = Theme.of(ctx);
        final isDark = theme.brightness == Brightness.dark;

        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          titlePadding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
          contentPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _getNotificationIcon(title, actionType),
                  color: theme.colorScheme.primary,
                  size: 26,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  title
                      .replaceAll(
                        RegExp(
                          r'[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]',
                          unicode: true,
                        ),
                        '',
                      )
                      .trim(),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Divider(height: 24),
                Text(
                  body,
                  style: TextStyle(
                    fontSize: 15,
                    height: 1.45,
                    color: isDark ? Colors.grey.shade200 : Colors.grey.shade800,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.access_time_rounded,
                        size: 14,
                        color: isDark
                            ? Colors.grey.shade400
                            : Colors.grey.shade600,
                      ),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          'Received: $formattedTime',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: isDark
                                ? Colors.grey.shade400
                                : Colors.grey.shade600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          actions: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 10,
                ),
              ),
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text(
                'Close',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        );
      },
    );
  }

  static IconData _getNotificationIcon(String title, String? actionType) {
    final lowerTitle = title.toLowerCase();
    final lowerAction = (actionType ?? '').toLowerCase();

    if (lowerTitle.contains('sale') || lowerAction.contains('sale')) {
      return Icons.receipt_long_rounded;
    } else if (lowerTitle.contains('product') ||
        lowerAction.contains('product')) {
      return Icons.inventory_2_rounded;
    } else if (lowerTitle.contains('cancel') ||
        lowerAction.contains('cancel')) {
      return Icons.cancel_outlined;
    } else if (lowerTitle.contains('reminder') ||
        lowerTitle.contains('warning')) {
      return Icons.warning_amber_rounded;
    }
    return Icons.notifications_active_rounded;
  }

  static void _parseAndHandlePayload(String? payloadStr) {
    if (payloadStr == null || payloadStr.isEmpty) {
      handleNotificationTap(
        title: 'POS Notification',
        body: 'Tap to view details.',
      );
      return;
    }
    try {
      final Map<String, dynamic> data = jsonDecode(payloadStr);
      final title = data['title']?.toString() ?? 'POS Notification';
      final body =
          data['body']?.toString() ??
          data['desc']?.toString() ??
          data['message']?.toString() ??
          '';
      handleNotificationTap(title: title, body: body, payload: payloadStr);
    } catch (_) {
      handleNotificationTap(
        title: 'POS Notification',
        body: payloadStr,
        payload: payloadStr,
      );
    }
  }

  Future<void> init() async {
    if (_isInitialized) return;

    // Android initialization settings using launcher icon
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);

    await _localNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        debugPrint(
          'Local notification clicked with payload: ${response.payload}',
        );
        _parseAndHandlePayload(response.payload);
      },
    );

    // Create Notification Channel for Android
    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      _channelId,
      _channelName,
      description: _channelDescription,
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    final androidPlugin = _localNotificationsPlugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();

    if (androidPlugin != null) {
      await androidPlugin.createNotificationChannel(channel);
      // Request notification permission for Android 13+
      await androidPlugin.requestNotificationsPermission();
    }

    // Configure FCM foreground handler
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint(
        'FCM Foreground message received: ${message.notification?.title}',
      );
      final notification = message.notification;
      final title =
          notification?.title ?? message.data['title'] ?? 'POS Notification';
      final body =
          notification?.body ??
          message.data['body'] ??
          message.data['message'] ??
          '';

      final payloadJson = jsonEncode({
        'title': title,
        'body': body,
        'type': message.data['type'] ?? message.data['action_type'],
        'timestamp': DateTime.now().toIso8601String(),
      });

      showNotification(title: title, body: body, payload: payloadJson);
    });

    // Handle FCM notification tap when app is in background
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint(
        'FCM notification tapped from background: ${message.notification?.title}',
      );
      final title =
          message.notification?.title ??
          message.data['title'] ??
          'POS Notification';
      final body =
          message.notification?.body ??
          message.data['body'] ??
          message.data['message'] ??
          '';
      final payloadJson = jsonEncode({
        'title': title,
        'body': body,
        'type': message.data['type'] ?? message.data['action_type'],
        'timestamp': DateTime.now().toIso8601String(),
      });
      handleNotificationTap(title: title, body: body, payload: payloadJson);
    });

    // Handle FCM notification tap when app was killed / terminated
    FirebaseMessaging.instance.getInitialMessage().then((
      RemoteMessage? message,
    ) {
      if (message != null) {
        debugPrint(
          'FCM notification launched app from killed state: ${message.notification?.title}',
        );
        final title =
            message.notification?.title ??
            message.data['title'] ??
            'POS Notification';
        final body =
            message.notification?.body ??
            message.data['body'] ??
            message.data['message'] ??
            '';
        final payloadJson = jsonEncode({
          'title': title,
          'body': body,
          'type': message.data['type'] ?? message.data['action_type'],
          'timestamp': DateTime.now().toIso8601String(),
        });
        handleNotificationTap(title: title, body: body, payload: payloadJson);
      }
    });

    // Check if app was launched by tapping a local notification
    final launchDetails = await _localNotificationsPlugin
        .getNotificationAppLaunchDetails();
    if (launchDetails?.didNotificationLaunchApp ?? false) {
      final payload = launchDetails?.notificationResponse?.payload;
      if (payload != null && payload.isNotEmpty) {
        _parseAndHandlePayload(payload);
      }
    }

    // Listen for FCM token refreshes
    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
      debugPrint('FCM Token refreshed: $newToken');
      if (_registeredMobile != null && _registeredMobile!.isNotEmpty) {
        bindUserMobile(_registeredMobile!, overrideToken: newToken);
      }
      if (_currentUserId != null && _currentUserId!.isNotEmpty) {
        saveUserTokenToFirestore(
          userId: _currentUserId!,
          name: _currentUserName ?? 'Store Owner',
          email: _currentUserEmail ?? 'owner@example.com',
          role: 'owner',
          token: newToken,
        );
      }
    });

    try {
      final token = await FirebaseMessaging.instance.getToken();
      if (token != null && token.isNotEmpty) {
        final userMap = StorageService.getUser();
        final userId = StorageService.currentUserId ?? userMap?['id']?.toString() ?? '36';
        final mobile = userMap?['phone']?.toString() ?? userMap?['mobile']?.toString() ?? '8660242733';
        bindUserMobile(mobile, overrideToken: token);
        ApiClient.post('/notifications/fcm/bind-mobile', {
          'user_id': userId,
          'customer_id': userId,
          'mobile_number': mobile,
          'fcm_token': token,
        });
      }
    } catch (e) {
      debugPrint('Error auto-registering FCM token on init: $e');
    }

    _isInitialized = true;
    debugPrint('NotificationService initialized successfully');
  }

  /// Save user profile & FCM Token to Cloud Firestore under `users/{userId}`
  Future<void> saveUserTokenToFirestore({
    required String userId,
    required String name,
    required String email,
    String role = 'owner',
    String? token,
  }) async {
    final cleanId = userId.trim();
    if (cleanId.isEmpty) return;

    _currentUserId = cleanId;
    _currentUserName = name;
    _currentUserEmail = email;

    try {
      final String? fcmToken =
          token ?? await FirebaseMessaging.instance.getToken();
      if (fcmToken == null || fcmToken.isEmpty) {
        debugPrint('FCM token is empty, skipping Firestore write.');
        return;
      }

      final userDocRef = FirebaseFirestore.instance
          .collection('users')
          .doc(cleanId);

      final Map<String, dynamic> userData = {
        'name': name.isNotEmpty ? name : 'Store Owner',
        'email': email.isNotEmpty ? email : 'owner@example.com',
        'role': role,
        'fcmToken': fcmToken,
        'updatedAt': FieldValue.serverTimestamp(),
      };

      await userDocRef.set(userData, SetOptions(merge: true));

      debugPrint(
        '✅ FCM Token & User profile saved to Firestore under users/$cleanId:',
      );
      debugPrint('   - name: ${userData['name']}');
      debugPrint('   - email: ${userData['email']}');
      debugPrint('   - role: ${userData['role']}');
      debugPrint('   - fcmToken: $fcmToken');
    } catch (e) {
      debugPrint('Error saving user FCM token to Firestore: $e');
    }
  }

  /// Bind the user's mobile number with their FCM device token in the backend/database
  Future<bool> bindUserMobile(
    String mobileNumber, {
    String? overrideToken,
  }) async {
    final cleanMobile = mobileNumber.trim();
    if (cleanMobile.isEmpty) return false;

    _registeredMobile = cleanMobile;
    String? fcmToken = overrideToken;

    try {
      fcmToken ??= await FirebaseMessaging.instance.getToken();
    } catch (e) {
      debugPrint('Could not fetch FCM token: $e');
    }

    if (fcmToken == null || fcmToken.isEmpty) {
      debugPrint('FCM Token is empty, skipping bind.');
      return false;
    }

    try {
      final response = await ApiClient.post('/notifications/fcm/bind-mobile', {
        'mobile_number': cleanMobile,
        'fcm_token': fcmToken,
      });

      if (response.statusCode == 200) {
        debugPrint('FCM Token bound successfully to mobile $cleanMobile');
        startAdminSync(cleanMobile);
        return true;
      }
    } catch (e) {
      debugPrint('Error binding FCM token to mobile $cleanMobile: $e');
    }

    startAdminSync(cleanMobile);
    return false;
  }

  /// Periodically check for admin notifications targeted specifically at this user's mobile number
  void startAdminSync(String mobileNumber) {
    final cleanMobile = mobileNumber.trim();
    if (cleanMobile.isEmpty) return;

    _syncTimer?.cancel();

    // Load previously seen notification IDs from cache
    final cachedSeen = StorageService.getString(
      'seen_admin_notes_$cleanMobile',
    );
    if (cachedSeen != null && cachedSeen.isNotEmpty) {
      try {
        final List<dynamic> list = jsonDecode(cachedSeen);
        _seenAdminNoteIds.addAll(list.map((e) => e.toString()));
      } catch (_) {}
    }

    // Check immediately
    _fetchAdminNotifications(cleanMobile);

    // Poll every 15 seconds for real-time admin push alerts
    _syncTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      _fetchAdminNotifications(cleanMobile);
    });
  }

  Future<void> _fetchAdminNotifications(String mobileNumber) async {
    try {
      final response = await ApiClient.get(
        '/notifications?mobile=$mobileNumber',
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        for (var item in data) {
          final noteMap = item as Map<String, dynamic>;
          final String id = noteMap['id'].toString();
          final String title =
              noteMap['title'] as String? ?? 'Admin Notification';
          final String body =
              noteMap['desc'] as String? ?? noteMap['message'] as String? ?? '';

          if (!_seenAdminNoteIds.contains(id)) {
            _seenAdminNoteIds.add(id);

            // Show local notification banner on phone screen!
            showNotification(
              title: '📢 $title',
              body: body,
              payload: jsonEncode({
                'title': '📢 $title',
                'body': body,
                'type': 'ADMIN_NOTIFICATION',
                'timestamp': DateTime.now().toIso8601String(),
              }),
            );
          }
        }
        // Save seen IDs to storage
        await StorageService.setString(
          'seen_admin_notes_$mobileNumber',
          jsonEncode(_seenAdminNoteIds.toList()),
        );
      }
    } catch (e) {
      debugPrint('Error fetching admin notifications: $e');
    }
  }

  Future<void> showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    final String effectivePayload =
        payload ??
        jsonEncode({
          'title': title,
          'body': body,
          'timestamp': DateTime.now().toIso8601String(),
        });

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
          _channelId,
          _channelName,
          channelDescription: _channelDescription,
          importance: Importance.max,
          priority: Priority.high,
          ticker: 'ticker',
          playSound: true,
          enableVibration: true,
          icon: '@mipmap/ic_launcher',
        );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
    );

    final int id = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    await _localNotificationsPlugin.show(
      id,
      title,
      body,
      notificationDetails,
      payload: effectivePayload,
    );
  }

  Future<void> showProductAddedNotification(
    String productName, {
    double? quantity,
    double? price,
  }) async {
    final String bodyText = quantity != null && quantity > 0
        ? 'Added "$productName" (Qty: $quantity) to inventory.'
        : 'Added "$productName" to inventory successfully.';

    await notifyStoreOwnerAction(
      title: '📦 New Product Added',
      body: bodyText,
      actionType: 'PRODUCT_ADDED',
    );
  }

  /// Trigger action notification for store owner actions (Sales, Product Addition, Bill Cancel)
  Future<void> notifyStoreOwnerAction({
    required String title,
    required String body,
    String actionType = 'POS_ACTION',
  }) async {
    final payloadJson = jsonEncode({
      'title': title,
      'body': body,
      'type': actionType,
      'timestamp': DateTime.now().toIso8601String(),
    });

    // 1. Show local push notification banner on device immediately
    await showNotification(title: title, body: body, payload: payloadJson);

    // 2. Post action event to backend for the store owner's mobile number
    if (_registeredMobile != null && _registeredMobile!.isNotEmpty) {
      try {
        await ApiClient.post('/notifications/fcm/trigger-action', {
          'mobile_number': _registeredMobile,
          'title': title,
          'message': body,
          'action_type': actionType,
        });
      } catch (e) {
        debugPrint('Error reporting store owner action: $e');
      }
    }
  }

  void dispose() {
    _syncTimer?.cancel();
  }
}
