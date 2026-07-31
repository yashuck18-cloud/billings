import 'dart:convert';
import 'package:flutter/foundation.dart' show debugPrint;
import 'package:http/http.dart' as http;
import 'storage.dart';

class ApiClient {
  static const String defaultNgrokUrl = 'https://utter-settle-sedation.ngrok-free.dev/api';

  static String get baseUrl {
    final customUrl = StorageService.getString('pos_backend_url');
    if (customUrl != null && customUrl.trim().isNotEmpty) {
      return customUrl.trim();
    }

    return defaultNgrokUrl;
  }

  static List<String> get candidateUrls {
    final current = baseUrl;
    final candidates = <String>[current];

    final defaults = [
      defaultNgrokUrl,
      'http://10.0.2.2:5000/api',
      'http://127.0.0.1:5000/api',
      'http://localhost:5000/api',
    ];

    for (final d in defaults) {
      if (!candidates.contains(d)) {
        candidates.add(d);
      }
    }
    return candidates;
  }

  static Future<void> setBaseUrl(String url) async {
    String formattedUrl = url.trim();
    while (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.substring(0, formattedUrl.length - 1);
    }
    // Auto-append /api if missing (e.g. user enters https://xxxx.ngrok-free.app)
    if (!formattedUrl.endsWith('/api')) {
      formattedUrl = '$formattedUrl/api';
    }
    await StorageService.setString('pos_backend_url', formattedUrl);
  }

  static Future<void> resetBaseUrl() async {
    await StorageService.remove('pos_backend_url');
  }

  /// Resolves server image URLs (relative, localhost, or android IP) to current active backend host
  static String resolveImageUrl(String imageUrl) {
    if (imageUrl.trim().isEmpty) return '';
    final trimmed = imageUrl.trim();
    if (trimmed.startsWith('data:image')) return trimmed;

    final apiBase = baseUrl;
    String serverOrigin = apiBase;
    if (serverOrigin.endsWith('/api')) {
      serverOrigin = serverOrigin.substring(0, serverOrigin.length - 4);
    } else {
      serverOrigin = serverOrigin.replaceAll('/api', '');
    }

    if (trimmed.startsWith('/')) {
      return '$serverOrigin$trimmed';
    }

    if (trimmed.contains('/api/advertisements/uploads/')) {
      final filename = trimmed.split('/api/advertisements/uploads/').last;
      return '$serverOrigin/api/advertisements/uploads/$filename';
    }

    if (trimmed.contains('/static/uploads/')) {
      final path = trimmed.split('/static/uploads/').last;
      return '$serverOrigin/static/uploads/$path';
    }

    if (trimmed.contains('localhost') || trimmed.contains('127.0.0.1')) {
      final uri = Uri.tryParse(trimmed);
      if (uri != null) {
        return '$serverOrigin${uri.path}';
      }
    }

    return trimmed;
  }

  static void Function(String)? onSuspended;

  static String? get token {
    final userMap = StorageService.getUser();
    return userMap?['token'] as String?;
  }

  static Map<String, String> get headers {
    final Map<String, String> map = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    final t = token;
    if (t != null) {
      map['Authorization'] = 'Bearer $t';
    }
    return map;
  }

  static void _checkSuspension(http.Response response) {
    if (response.statusCode == 403) {
      String errMsg = 'Account suspended. Please contact support.';
      try {
        final data = jsonDecode(response.body);
        if (data != null && data['error'] != null) {
          errMsg = data['error'] as String;
        }
      } catch (_) {}
      onSuspended?.call(errMsg);
    }
  }

  static Future<http.Response> _requestWithFallback(
    String method,
    String path, {
    dynamic body,
  }) async {
    Object? lastException;
    final urlsToTry = candidateUrls;

    for (final base in urlsToTry) {
      try {
        final fullUrl = Uri.parse('$base$path');
        late http.Response response;

        const timeoutDuration = Duration(seconds: 5);
        if (method == 'POST') {
          response = await http
              .post(fullUrl, headers: headers, body: jsonEncode(body))
              .timeout(timeoutDuration);
        } else if (method == 'GET') {
          response = await http
              .get(fullUrl, headers: headers)
              .timeout(timeoutDuration);
        } else if (method == 'PUT') {
          response = await http
              .put(fullUrl, headers: headers, body: jsonEncode(body))
              .timeout(timeoutDuration);
        } else {
          throw UnsupportedError('Unsupported HTTP method: $method');
        }

        if (base != StorageService.getString('pos_backend_url')) {
          await setBaseUrl(base);
        }

        _checkSuspension(response);
        return response;
      } catch (e) {
        lastException = e;
        debugPrint('ApiClient failure for $base$path: $e. Trying next URL...');
      }
    }

    throw lastException ?? Exception('Failed to connect to backend server');
  }

  static Future<http.Response> post(String path, dynamic body) async {
    return _requestWithFallback('POST', path, body: body);
  }

  static Future<http.Response> get(String path) async {
    return _requestWithFallback('GET', path);
  }

  static Future<http.Response> put(String path, dynamic body) async {
    return _requestWithFallback('PUT', path, body: body);
  }

  static Future<List<Map<String, dynamic>>?> getAdvertisements() async {
    try {
      final response = await get('/advertisements?active_only=true');
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as List<dynamic>;
        return decoded.map((e) => e as Map<String, dynamic>).toList();
      }
    } catch (e) {
      debugPrint('Failed to fetch advertisements: $e');
    }
    return null;
  }
}
