import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/storage.dart';
import '../core/api_client.dart';
import '../core/theme.dart';
import '../services/notification_service.dart';
import '../models/category.dart';
import '../models/product.dart';
import '../models/stock_history.dart';
import '../models/invoice.dart';
import '../models/cancelled_invoice.dart';
import '../models/purchase_entry.dart';
import '../models/user.dart';
import '../models/credit_due.dart';
import 'auth_provider.dart';

class DbProvider extends ChangeNotifier {
  AuthProvider? _authProvider;
  List<Category> _categories = [];
  List<Product> _products = [];
  List<StockHistory> _stockHistory = [];
  List<Invoice> _invoices = [];
  List<CancelledInvoice> _cancelledInvoices = [];
  List<PurchaseEntry> _purchaseEntries = [];
  List<CreditDue> _creditDues = [];
  List<Map<String, dynamic>> _advertisements = [];
  String _receiptPaperSize = '80mm';
  Map<String, dynamic> _receiptConfig = {};
  bool _isDarkTheme = false;
  bool _isSyncing = false;
  bool _isOnline = true;
  DateTime? _lastSynced;
  Timer? _autoSyncTimer;
  Timer? _layoutTimer;
  final List<String> _deletedProductIds = [];
  final List<String> _deletedCategoryIds = [];

  List<Category> get categories => _categories;
  List<Product> get products => _products;
  List<StockHistory> get stockHistory => _stockHistory;
  List<Invoice> get invoices => _invoices;
  List<CancelledInvoice> get cancelledInvoices => _cancelledInvoices;
  List<PurchaseEntry> get purchaseEntries => _purchaseEntries;
  List<CreditDue> get creditDues => _creditDues;
  bool _hasFetchedRemoteAds = false;
  List<Map<String, dynamic>> get advertisements =>
      _hasFetchedRemoteAds || _advertisements.isNotEmpty
      ? _advertisements
      : defaultAds;
  String get receiptPaperSize => _receiptPaperSize;
  Map<String, dynamic> get receiptConfig =>
      _receiptConfig.isNotEmpty ? _receiptConfig : StorageService.getReceiptConfig();
  bool get isDarkTheme => _isDarkTheme;
  bool get isSyncing => _isSyncing;
  bool get isOnline => _isOnline;
  DateTime? get lastSynced => _lastSynced;

  Future<void> updateReceiptConfig(Map<String, dynamic> newConfig) async {
    final current = StorageService.getReceiptConfig();
    current.addAll(newConfig);
    _receiptConfig = Map<String, dynamic>.from(current);
    await StorageService.saveReceiptConfig(_receiptConfig);
    if (newConfig.containsKey('paperSize') && newConfig['paperSize'] != null) {
      _receiptPaperSize = newConfig['paperSize'].toString();
      StorageService.saveReceiptPaperSize(_receiptPaperSize);
    }
    notifyListeners();
  }

  void attachAuthProvider(AuthProvider auth) {
    _authProvider = auth;
  }

  Map<String, bool> _enabledModules = {
    'billing': true,
    'products': true,
    'sales_history': true,
    'reports': true,
    'backup': true,
    'purchase_entry': true,
  };
  String _activeFestivalTheme = 'standard';
  String _festivalBannerUrl = '';
  List<String> _festivalBannerImages = [];

  bool _isSuspended = false;
  String _suspendedMessage = '';
  List<Map<String, dynamic>> _userNotifications = [];
  final Set<String> _seenCloudNotificationIds = {};

  bool isModuleEnabled(String key) {
    final k = key.toLowerCase().trim().replaceAll(' ', '_');
    if (_enabledModules.containsKey(k)) {
      return _enabledModules[k] == true;
    }
    if (k == 'sales_history' || k == 'sales_and_credit_ledger' || k == 'sales') {
      if (_enabledModules.containsKey('sales_and_credit_ledger')) return _enabledModules['sales_and_credit_ledger'] == true;
      if (_enabledModules.containsKey('sales_history')) return _enabledModules['sales_history'] == true;
      if (_enabledModules.containsKey('sales')) return _enabledModules['sales'] == true;
    }
    if (k == 'backup' || k == 'database_and_config') {
      if (_enabledModules.containsKey('database_and_config')) return _enabledModules['database_and_config'] == true;
      if (_enabledModules.containsKey('backup')) return _enabledModules['backup'] == true;
    }
    if (k == 'system_settings' || k == 'settings') {
      if (_enabledModules.containsKey('system_settings')) return _enabledModules['system_settings'] == true;
      if (_enabledModules.containsKey('settings')) return _enabledModules['settings'] == true;
    }
    return true;
  }

  String get activeFestivalTheme => _activeFestivalTheme;
  FestivalThemeData get festivalTheme =>
      FestivalThemes.getTheme(_activeFestivalTheme);
  String get festivalBannerUrl => _festivalBannerUrl;
  List<String> get festivalBannerImages => _festivalBannerImages;

  bool get isSuspended => _isSuspended;
  String get suspendedMessage => _suspendedMessage;
  List<Map<String, dynamic>> get userNotifications => _userNotifications;
  int get unreadNotificationsCount => _userNotifications
      .where((n) => n['read'] == false || n['read'].toString() == 'false')
      .length;

  void addLocalNotification({required String title, required String message, String type = 'info'}) {
    final newNote = {
      'id': DateTime.now().millisecondsSinceEpoch,
      'title': title,
      'message': message,
      'desc': message,
      'type': type,
      'read': false,
      'created_at': DateTime.now().toIso8601String(),
    };
    _userNotifications.insert(0, newNote);
    notifyListeners();
  }

  Future<void> fetchNotificationsFromCloud() async {
    try {
      String? customerId = StorageService.currentUserId;
      if (customerId == null || customerId.isEmpty) {
        final userMap = StorageService.getUser();
        if (userMap != null) {
          customerId = userMap['id']?.toString();
        }
      }
      if (customerId != null && customerId.isNotEmpty) {
        final response = await ApiClient.get(
          '/notifications?customer_id=$customerId',
        );
        if (response.statusCode == 200) {
          _isOnline = true;
          final decoded = jsonDecode(response.body);
          if (decoded is List) {
            final newNotes = decoded
                .map((e) => e as Map<String, dynamic>)
                .toList();

            // Trigger local push notification banner on phone for any new admin notifications
            for (var note in newNotes) {
              final String noteId = note['id'].toString();
              final bool isRead = note['read'] == true || note['read'].toString() == 'true';
              final String title = note['title']?.toString() ?? 'Admin Notification';
              final String message = note['desc']?.toString() ?? note['message']?.toString() ?? '';

              if (!isRead && !_seenCloudNotificationIds.contains(noteId)) {
                _seenCloudNotificationIds.add(noteId);
                NotificationService().showNotification(
                  title: '📢 $title',
                  body: message,
                  payload: jsonEncode(note),
                );
              }
            }

            // Preserve local pending payment notifications (credit_id != null)
            final creditNotes = _userNotifications
                .where((n) => n['credit_id'] != null)
                .toList();

            final Map<dynamic, Map<String, dynamic>> mergedMap = {};
            for (var cn in creditNotes) {
              mergedMap[cn['id']] = cn;
            }
            for (var nn in newNotes) {
              mergedMap[nn['id']] = nn;
            }

            final List<Map<String, dynamic>> combinedList = mergedMap.values.toList();
            combinedList.sort((a, b) {
              final aTime = a['created_at'] != null ? DateTime.tryParse(a['created_at'].toString()) : null;
              final bTime = b['created_at'] != null ? DateTime.tryParse(b['created_at'].toString()) : null;
              if (aTime != null && bTime != null) {
                return bTime.compareTo(aTime);
              }
              return 0;
            });

            if (jsonEncode(_userNotifications) != jsonEncode(combinedList)) {
              _userNotifications = combinedList;
              notifyListeners();
            }
          }
        }
      }
    } catch (_) {}
  }

  Future<void> checkServerConnectivity() async {
    try {
      final response = await ApiClient.get('/health');
      if (response.statusCode == 200) {
        _isOnline = true;
        if (_lastSynced == null) {
          _lastSynced = DateTime.now();
        }
        notifyListeners();
      } else {
        _isOnline = false;
        notifyListeners();
      }
    } catch (_) {
      _isOnline = false;
      notifyListeners();
    }
  }

  Future<void> markNotificationRead(int noteId) async {
    try {
      final idx = _userNotifications.indexWhere((n) => n['id'] == noteId);
      if (idx >= 0) {
        _userNotifications[idx]['read'] = true;
        notifyListeners();
      }
      await ApiClient.post('/notifications/$noteId/read', {});
    } catch (_) {}
  }

  DbProvider({bool autoStartTimer = true}) {
    _isDarkTheme = StorageService.isDarkTheme();
    _activeFestivalTheme = StorageService.getActiveFestivalTheme();
    _festivalBannerUrl = StorageService.getFestivalBannerUrl();
    final cachedPhotosRaw = StorageService.getFestivalBannerImages();
    if (cachedPhotosRaw.isNotEmpty) {
      try {
        final parsed = jsonDecode(cachedPhotosRaw);
        if (parsed is List) {
          _festivalBannerImages = parsed.map((e) => e.toString()).toList();
        }
      } catch (_) {}
    }
    final cachedMods = StorageService.getUserModules();
    if (cachedMods != null) {
      try {
        final Map decoded = jsonDecode(cachedMods);
        decoded.forEach((k, v) {
          _enabledModules[k.toString().toLowerCase().trim()] =
              v == true || v.toString() == 'true';
        });
      } catch (_) {}
    }
    _loadData();
    if (autoStartTimer &&
        !WidgetsBinding.instance.runtimeType.toString().contains('Test')) {
      _startAutoSyncTimer();
      _startNotificationPolling();
      _triggerAutoSync();
    }
  }

  Timer? _notificationTimer;

  void _startNotificationPolling() {
    _notificationTimer?.cancel();
    _notificationTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      fetchNotificationsFromCloud();
      checkPendingDueAlerts();
    });
  }

  void _startAutoSyncTimer() {
    _autoSyncTimer?.cancel();
    _layoutTimer?.cancel();
    if (WidgetsBinding.instance.runtimeType.toString().contains('Test')) return;

    // Lightweight polling for layout, config & ad updates every 30 seconds
    _layoutTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      checkServerConnectivity();
      fetchLayoutsFromCloud();
      fetchConfigFromCloud();
      fetchAdvertisements();
    });

    // Background data sync every 60 seconds
    _autoSyncTimer = Timer.periodic(const Duration(seconds: 60), (_) {
      _triggerAutoSync();
    });
  }

  @override
  void dispose() {
    _autoSyncTimer?.cancel();
    _layoutTimer?.cancel();
    _notificationTimer?.cancel();
    super.dispose();
  }

  /// Called after login/logout to reload the correct user's data from storage.
  void reloadForUser() {
    _categories = [];
    _products = [];
    _stockHistory = [];
    _invoices = [];
    _lastSynced = null;
    _loadData();
    // Immediately fetch latest per-customer layout and config from server
    syncCloud();
  }

  void toggleTheme() {
    _isDarkTheme = !_isDarkTheme;
    StorageService.saveDarkTheme(_isDarkTheme);
    notifyListeners();
  }

  static const List<Map<String, dynamic>> defaultAds = [];

  Future<void> fetchAdvertisements() async {
    final localAds = StorageService.getAdvertisements();
    if (localAds.isNotEmpty && _advertisements.isEmpty) {
      _advertisements = localAds;
      notifyListeners();
    }
    try {
      final remoteAds = await ApiClient.getAdvertisements();
      if (remoteAds != null) {
        if (jsonEncode(_advertisements) != jsonEncode(remoteAds)) {
          _advertisements = remoteAds;
          _hasFetchedRemoteAds = true;
          await StorageService.saveAdvertisements(remoteAds);
          notifyListeners();
        }
      }
    } catch (_) {}
  }

  void _loadData() {
    _categories = StorageService.getCategories()
        .map((e) => Category.fromJson(e))
        .toList();
    _products = StorageService.getProducts()
        .map((e) => Product.fromJson(e))
        .toList();
    _stockHistory = StorageService.getStockHistory()
        .map((e) => StockHistory.fromJson(e))
        .toList();
    _invoices = StorageService.getInvoices()
        .map((e) => Invoice.fromJson(e))
        .toList();
    _cancelledInvoices = StorageService.getCancelledInvoices()
        .map((e) => CancelledInvoice.fromJson(e))
        .toList();
    _purchaseEntries = StorageService.getPurchaseEntries()
        .map((e) => PurchaseEntry.fromJson(e))
        .toList();
    final duesRaw = StorageService.getCreditDues();
    if (duesRaw.isNotEmpty) {
      _creditDues = duesRaw.map((e) => CreditDue.fromJson(e)).toList();
    } else {
      _creditDues = [];
      _saveCreditDues();
    }
    checkPendingDueAlerts();

    _receiptConfig = StorageService.getReceiptConfig();
    _receiptPaperSize =
        _receiptConfig['paperSize']?.toString() ??
        StorageService.getReceiptPaperSize();
    fetchAdvertisements();

    // Ensure there is always at least one category to prevent adding block
    if (_categories.isEmpty) {
      _categories.add(
        Category(
          id: 'cat_general',
          name: 'General',
          description: 'Default category',
        ),
      );
      _saveAll();
    }
    notifyListeners();
  }

  void _seedInitialData() {
    _categories = [
      Category(
        id: 'cat_general',
        name: 'General',
        description: 'General merchandise',
      ),
    ];
    _products = [];
    _stockHistory = [];
    _invoices = [];
    _cancelledInvoices = [];
    _purchaseEntries = [];
    _creditDues = [];
    _saveAll();
  }

  void _saveAll() {
    StorageService.saveCategories(_categories.map((e) => e.toJson()).toList());
    StorageService.saveProducts(_products.map((e) => e.toJson()).toList());
    StorageService.saveStockHistory(
      _stockHistory.map((e) => e.toJson()).toList(),
    );
    StorageService.saveInvoices(_invoices.map((e) => e.toJson()).toList());
    StorageService.saveCancelledInvoices(
      _cancelledInvoices.map((e) => e.toJson()).toList(),
    );
    StorageService.savePurchaseEntries(
      _purchaseEntries.map((e) => e.toJson()).toList(),
    );
    StorageService.saveReceiptPaperSize(_receiptPaperSize);
    StorageService.saveReceiptConfig(_receiptConfig);
    _saveCreditDues();
  }

  void _saveCreditDues() {
    StorageService.saveCreditDues(_creditDues.map((e) => e.toJson()).toList());
  }

  void checkPendingDueAlerts() {
    bool hasNewAlert = false;
    for (final due in _creditDues) {
      if (due.status != 'PAID' && due.dueAmount > 0) {
        final isOverdue = due.dueDate.isBefore(DateTime.now());
        final noteId = due.id.hashCode;
        final exists = _userNotifications.any((n) => n['id'] == noteId || n['credit_id'] == due.id);
        if (!exists) {
          final title = isOverdue ? '⚠️ Overdue Customer Credit' : '⏳ Pending Due Alert: ${due.customerName}';
          final desc = isOverdue
              ? 'Customer ${due.customerName} (${due.customerPhone}) has an overdue credit payment of ₹${due.dueAmount.toStringAsFixed(2)} (Due: ${due.dueDate.day}/${due.dueDate.month}/${due.dueDate.year}).'
              : 'Customer ${due.customerName} (${due.customerPhone}) has a pending credit payment of ₹${due.dueAmount.toStringAsFixed(2)} (Due: ${due.dueDate.day}/${due.dueDate.month}/${due.dueDate.year}).';

          _userNotifications.insert(0, {
            'id': noteId,
            'credit_id': due.id,
            'title': title,
            'message': desc,
            'type': isOverdue ? 'CRITICAL' : 'WARNING',
            'read': false,
            'created_at': DateTime.now().toIso8601String(),
          });
          hasNewAlert = true;
        }
      }
    }
    if (hasNewAlert) {
      notifyListeners();
    }
  }

  void sendReminderNotificationForDue(CreditDue due) {
    final noteId = DateTime.now().millisecondsSinceEpoch;
    final isOverdue = due.isOverdue;
    final title = isOverdue ? '⚠️ Overdue Customer Credit Reminder' : '🔔 Pending Due Reminder: ${due.customerName}';
    final desc = 'Reminder: Customer ${due.customerName} (${due.customerPhone}) has pending credit payment of ₹${due.dueAmount.toStringAsFixed(2)} (Due: ${due.dueDate.day}/${due.dueDate.month}/${due.dueDate.year}).';

    _userNotifications.insert(0, {
      'id': noteId,
      'credit_id': due.id,
      'title': title,
      'message': desc,
      'type': isOverdue ? 'CRITICAL' : 'WARNING',
      'read': false,
      'created_at': DateTime.now().toIso8601String(),
    });
    notifyListeners();

    try {
      String? customerId = StorageService.currentUserId;
      if (customerId != null && customerId.isNotEmpty) {
        ApiClient.post('/notifications', {
          'title': title,
          'message': desc,
          'type': isOverdue ? 'warning' : 'info',
          'customer_id': customerId,
        });
      }
    } catch (_) {}
  }

  Future<void> notifyStoreOwnerAction(String title, String message, {String actionType = 'POS_ACTION'}) async {
    final noteId = DateTime.now().millisecondsSinceEpoch;
    _userNotifications.insert(0, {
      'id': noteId,
      'title': title,
      'message': message,
      'type': actionType,
      'read': false,
      'created_at': DateTime.now().toIso8601String(),
    });
    notifyListeners();

    try {
      final userMap = StorageService.getUser();
      final String phone = (userMap != null ? userMap['phone'] : null)?.toString() ?? '9845589206';
      await ApiClient.post('/notifications/fcm/trigger-action', {
        'mobile_number': phone,
        'title': title,
        'message': message,
        'action_type': actionType,
      });
    } catch (_) {}
  }

  Future<void> bindOwnerMobileToFCM(String mobileNumber, String fcmToken) async {
    try {
      await ApiClient.post('/notifications/fcm/bind-mobile', {
        'mobile_number': mobileNumber,
        'fcm_token': fcmToken,
      });
    } catch (_) {}
  }

  Future<void> addCreditDue(CreditDue due) async {
    _creditDues.add(due);
    _saveCreditDues();
    checkPendingDueAlerts();
    notifyStoreOwnerAction(
      '💳 Customer Credit Recorded',
      'Unpaid credit of ₹${due.dueAmount.toStringAsFixed(2)} recorded for customer "${due.customerName}". Due: ${due.dueDate.day}/${due.dueDate.month}/${due.dueDate.year}.',
      actionType: 'CREDIT_DUE',
    );
    notifyListeners();
  }

  Future<void> updateCreditDue(CreditDue due) async {
    final idx = _creditDues.indexWhere((c) => c.id == due.id);
    if (idx != -1) {
      _creditDues[idx] = due;
      _saveCreditDues();
      checkPendingDueAlerts();
      if (due.status == 'PAID') {
        notifyStoreOwnerAction(
          '✅ Credit Fully Paid',
          'Customer "${due.customerName}" cleared full balance of ₹${due.totalAmount.toStringAsFixed(2)}.',
          actionType: 'PAYMENT_RECEIVED',
        );
      } else {
        notifyStoreOwnerAction(
          '💵 Payment Collected',
          'Payment collected for "${due.customerName}". Remaining balance: ₹${due.dueAmount.toStringAsFixed(2)}.',
          actionType: 'PAYMENT_RECEIVED',
        );
      }
      notifyListeners();
    }
  }

  Future<void> deleteCreditDue(String id) async {
    _creditDues.removeWhere((c) => c.id == id);
    _userNotifications.removeWhere((n) => n['credit_id'] == id);
    _saveCreditDues();
    notifyListeners();
  }

  // --- Category CRUD ---
  Future<Category> addCategory(String name, String description) async {
    final cat = Category(
      id: 'cat_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      description: description,
    );
    _categories.add(cat);
    _saveAll();
    notifyListeners();
    _triggerAutoSync();
    return cat;
  }

  Future<void> editCategory(Category category) async {
    final index = _categories.indexWhere(
      (element) => element.id == category.id,
    );
    if (index != -1) {
      _categories[index] = category;
      _saveAll();
      notifyListeners();
      _triggerAutoSync();
    }
  }

  Future<void> deleteCategory(String id) async {
    _categories.removeWhere((element) => element.id == id);
    if (!_deletedCategoryIds.contains(id)) {
      _deletedCategoryIds.add(id);
    }
    _saveAll();
    notifyListeners();
    _triggerAutoSync();
  }

  static String cleanControlChars(String input) {
    return input.replaceAll(RegExp(r'[\x00-\x1F\x7F-\x9F]'), '').trim();
  }

  static Set<String> getBarcodeVariants(String raw) {
    final variants = <String>{};
    final sanitized = cleanControlChars(raw);
    if (sanitized.isEmpty) return variants;

    final lower = sanitized.toLowerCase();
    variants.add(lower);

    final cleanAlphanumeric = sanitized.replaceAll(RegExp(r'[^a-zA-Z0-9]'), '').toLowerCase();
    if (cleanAlphanumeric.isNotEmpty) variants.add(cleanAlphanumeric);

    // 1. Check AIM Symbology Identifiers starting with ']' (e.g. ]C1, ]e0, ]d1, ]Q3, etc.)
    if (sanitized.startsWith(']')) {
      if (sanitized.length > 3) {
        final strippedAim = sanitized.substring(3).replaceAll(RegExp(r'[^a-zA-Z0-9]'), '').toLowerCase();
        if (strippedAim.isNotEmpty) variants.add(strippedAim);
      }
      if (sanitized.length > 1) {
        final strippedBracket = sanitized.substring(1).replaceAll(RegExp(r'[^a-zA-Z0-9]'), '').toLowerCase();
        if (strippedBracket.isNotEmpty) variants.add(strippedBracket);
      }
    }

    // 2. Check 2-char AIM prefixes in cleanAlphanumeric (c1, e0, d1, q3, a0, a1, b0, c0, etc.)
    if (cleanAlphanumeric.length > 4) {
      final prefix2 = cleanAlphanumeric.substring(0, 2);
      if (['c1', 'e0', 'd1', 'q3', 'a0', 'a1', 'b0', 'c0'].contains(prefix2)) {
        final strippedPrefix = cleanAlphanumeric.substring(2);
        if (strippedPrefix.isNotEmpty) variants.add(strippedPrefix);
      }
    }

    // 3. Add leading-zero stripped variations
    final currentList = List<String>.from(variants);
    for (final v in currentList) {
      final noZero = v.replaceFirst(RegExp(r'^0+'), '');
      if (noZero.isNotEmpty) variants.add(noZero);
    }

    return variants;
  }

  static String normalizeBarcodeKey(String raw) {
    final variants = getBarcodeVariants(raw);
    if (variants.isEmpty) return '';
    return variants.last;
  }

  // --- Product CRUD ---
  Product? getProductByBarcode(String barcode) {
    final sanitizedScan = cleanControlChars(barcode);
    if (sanitizedScan.isEmpty) return null;

    final scannedVariants = getBarcodeVariants(sanitizedScan);
    if (scannedVariants.isEmpty) return null;

    final lowerScan = sanitizedScan.toLowerCase();

    for (final p in _products) {
      // 1. Direct ID match
      if (p.id.toLowerCase() == lowerScan) return p;

      // 2. Barcode match
      if (p.barcode != null && p.barcode!.trim().isNotEmpty) {
        final pSanitized = cleanControlChars(p.barcode!);
        final pLower = pSanitized.toLowerCase();
        if (pLower == lowerScan) return p;

        final prodVariants = getBarcodeVariants(pSanitized);

        // Exact variant intersection match
        if (scannedVariants.intersection(prodVariants).isNotEmpty) {
          return p;
        }

        // Substring / GTIN prefix/suffix match (min 4 chars)
        for (final sv in scannedVariants) {
          if (sv.length < 4) continue;
          for (final pv in prodVariants) {
            if (pv.length < 4) continue;
            if (pv.endsWith(sv) || sv.endsWith(pv) || pv == sv || pv.contains(sv) || sv.contains(pv)) {
              return p;
            }
          }
        }
      }

      // 3. Fallback: match product ID if barcode matched product ID
      final idVariants = getBarcodeVariants(p.id);
      if (scannedVariants.intersection(idVariants).isNotEmpty) {
        return p;
      }
    }
    return null;
  }

  List<Product> searchProducts(String query, {String? categoryId}) {
    final cleanQuery = query.trim().toLowerCase();
    final queryVariants = getBarcodeVariants(query);

    return _products.where((p) {
      final matchesName = p.name.toLowerCase().contains(cleanQuery);
      final pBarcode = p.barcode ?? '';
      final pVariants = getBarcodeVariants(pBarcode);
      
      bool matchesBarcode = pBarcode.toLowerCase().contains(cleanQuery);
      if (!matchesBarcode && queryVariants.isNotEmpty && pVariants.isNotEmpty) {
        matchesBarcode = queryVariants.intersection(pVariants).isNotEmpty ||
            queryVariants.any((qv) => pVariants.any((pv) => pv.contains(qv) || qv.contains(pv)));
      }
      final matchesCat =
          categoryId == null ||
          categoryId.isEmpty ||
          p.categoryId == categoryId;
      return (query.isEmpty || matchesName || matchesBarcode) && matchesCat;
    }).toList();
  }

  List<Category> searchCategories(String query) {
    if (query.isEmpty) return _categories;
    return _categories
        .where((c) => c.name.toLowerCase().contains(query.toLowerCase()))
        .toList();
  }

  Future<Product> addProductModel(Product product) async {
    final normNewVariants = product.barcode != null ? getBarcodeVariants(product.barcode!) : <String>{};
    final existingIdx = _products.indexWhere((p) {
      if (p.id == product.id) return true;
      if (normNewVariants.isNotEmpty && p.barcode != null && p.barcode!.trim().isNotEmpty) {
        final pVariants = getBarcodeVariants(p.barcode!);
        if (normNewVariants.intersection(pVariants).isNotEmpty) {
          return true;
        }
      }
      return false;
    });

    if (existingIdx != -1) {
      _products[existingIdx] = product;
    } else {
      _products.add(product);
    }

    if (product.quantity > 0) {
      _stockHistory.add(
        StockHistory(
          id: 'sh_${DateTime.now().millisecondsSinceEpoch}',
          productId: product.id,
          productName: product.name,
          quantityChanged: product.quantity,
          type: 'ADD',
          timestamp: DateTime.now(),
          note: 'Initial stock added on product creation',
        ),
      );
    }

    _saveAll();
    notifyListeners();
    _triggerAutoSync();

    return product;
  }

  Future<void> addProduct(
    String name,
    String categoryId,
    String unit,
    double defaultSellingPrice,
    double purchasePrice,
    double lowStockAlert, [
    double initialQuantity = 0.0,
    String? barcode,
    String? brand,
    double? maxStockLimit,
  ]) async {
    final prod = Product(
      id: 'p_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      categoryId: categoryId,
      brand: brand?.trim().isEmpty == true ? null : brand?.trim(),
      unit: unit,
      quantity: initialQuantity,
      defaultSellingPrice: defaultSellingPrice,
      purchasePrice: purchasePrice,
      lowStockAlert: lowStockAlert,
      maxStockLimit: maxStockLimit,
      barcode: barcode?.trim().isEmpty == true ? null : barcode?.trim(),
    );
    await addProductModel(prod);
  }

  Future<void> editProduct(Product product) async {
    final index = _products.indexWhere((element) => element.id == product.id);
    if (index != -1) {
      final oldProduct = _products[index];
      _products[index] = product;

      if (oldProduct.quantity != product.quantity) {
        final diff = product.quantity - oldProduct.quantity;
        _stockHistory.add(
          StockHistory(
            id: 'sh_${DateTime.now().millisecondsSinceEpoch}',
            productId: product.id,
            productName: product.name,
            quantityChanged: diff.abs(),
            type: diff > 0 ? 'ADD' : 'REDUCE',
            timestamp: DateTime.now(),
            note: 'Direct manual stock level adjustment',
          ),
        );
      }

      _saveAll();
      notifyListeners();
      _triggerAutoSync();
    }
  }

  Future<void> updateProduct(Product product) async {
    await editProduct(product);
  }

  Future<void> deleteProduct(String id) async {
    _products.removeWhere((element) => element.id == id);
    if (!_deletedProductIds.contains(id)) {
      _deletedProductIds.add(id);
    }
    _saveAll();
    notifyListeners();
    _triggerAutoSync();
  }

  Future<void> addStock(String productId, double quantity, String note) async {
    await adjustStock(productId, quantity, 'ADD', note);
  }

  Future<void> adjustStock(
    String productId,
    double quantityChange,
    String type,
    String note,
  ) async {
    final index = _products.indexWhere((p) => p.id == productId);
    if (index != -1) {
      final p = _products[index];
      final newQty = type == 'ADD'
          ? p.quantity + quantityChange
          : p.quantity - quantityChange;
      _products[index] = p.copyWith(quantity: newQty < 0 ? 0.0 : newQty);

      _stockHistory.add(
        StockHistory(
          id: 'sh_${DateTime.now().millisecondsSinceEpoch}',
          productId: p.id,
          productName: p.name,
          quantityChanged: quantityChange,
          type: type,
          timestamp: DateTime.now(),
          note: note,
        ),
      );

      _saveAll();
      notifyListeners();
      _triggerAutoSync();
    }
  }

  // --- Invoice & Sales Transactions ---

  /// Completes a billing transaction.
  /// GUARANTEE: The invoice is saved LOCALLY FIRST before attempting any network sync.
  Future<void> completeBill(Invoice invoice) async {
    // 1. Save locally FIRST (Never lose sales data)
    _invoices.insert(0, invoice);

    // 2. Reduce Product Stock & Record Stock History locally
    for (var item in invoice.items) {
      final pIndex = _products.indexWhere((p) => p.id == item.productId);
      if (pIndex != -1) {
        final p = _products[pIndex];
        final newStock = (p.quantity - item.quantity) < 0
            ? 0.0
            : (p.quantity - item.quantity);
        _products[pIndex] = p.copyWith(quantity: newStock);

        _stockHistory.add(
          StockHistory(
            id: 'sh_${DateTime.now().millisecondsSinceEpoch}_${item.productId}',
            productId: item.productId,
            productName: p.name,
            quantityChanged: item.quantity,
            type: 'SALE',
            timestamp: DateTime.now(),
            note: 'Sold in Invoice ${invoice.invoiceNumber}',
          ),
        );
      }
    }

    _saveAll();
    notifyListeners();

    // 3. Trigger automatic background sync to cloud
    _triggerAutoSync();
  }

  Future<void> deleteInvoice(
    String id, {
    String reason = 'Customer Cancellation',
  }) async {
    final index = _invoices.indexWhere((element) => element.id == id);
    if (index != -1) {
      final inv = _invoices[index];

      // Save to cancelled invoices log
      _cancelledInvoices.insert(
        0,
        CancelledInvoice(
          id: 'can_${DateTime.now().millisecondsSinceEpoch}',
          invoiceNumber: inv.invoiceNumber,
          originalDateTime: inv.dateTime,
          cancelledAt: DateTime.now(),
          cancellationReason: reason,
          grandTotal: inv.grandTotal,
          itemsCount: inv.items.length,
          invoiceJson: inv.toJson(),
        ),
      );

      for (var item in inv.items) {
        final idx = _products.indexWhere((p) => p.id == item.productId);
        if (idx != -1) {
          final p = _products[idx];
          _products[idx] = p.copyWith(quantity: p.quantity + item.quantity);

          _stockHistory.add(
            StockHistory(
              id: 'sh_${DateTime.now().millisecondsSinceEpoch}_del_${item.productId}',
              productId: item.productId,
              productName: p.name,
              quantityChanged: item.quantity,
              type: 'ADD',
              timestamp: DateTime.now(),
              note: 'Restored from deleted Invoice ${inv.invoiceNumber}',
            ),
          );
        }
      }

      _invoices.removeAt(index);
      _saveAll();
      notifyListeners();
      _triggerAutoSync();
    }
  }

  Future<void> restoreCancelledInvoice(String cancelledId) async {
    final index = _cancelledInvoices.indexWhere((c) => c.id == cancelledId);
    if (index != -1) {
      final cancelled = _cancelledInvoices[index];
      final invoice = Invoice.fromJson(cancelled.invoiceJson);

      // Re-add to active invoices
      _invoices.insert(0, invoice);

      // Deduct stock levels again for restored bill
      for (var item in invoice.items) {
        final pIndex = _products.indexWhere((p) => p.id == item.productId);
        if (pIndex != -1) {
          final p = _products[pIndex];
          final newStock = (p.quantity - item.quantity) < 0
              ? 0.0
              : (p.quantity - item.quantity);
          _products[pIndex] = p.copyWith(quantity: newStock);

          _stockHistory.add(
            StockHistory(
              id: 'sh_${DateTime.now().millisecondsSinceEpoch}_rst_${item.productId}',
              productId: item.productId,
              productName: p.name,
              quantityChanged: item.quantity,
              type: 'SALE',
              timestamp: DateTime.now(),
              note: 'Sold in Restored Invoice ${invoice.invoiceNumber}',
            ),
          );
        }
      }

      _cancelledInvoices.removeAt(index);
      _saveAll();
      notifyListeners();
      _triggerAutoSync();
    }
  }

  Future<void> deleteCancelledInvoicePermanently(String cancelledId) async {
    _cancelledInvoices.removeWhere((c) => c.id == cancelledId);
    _saveAll();
    notifyListeners();
  }

  Future<void> addPurchaseEntry(PurchaseEntry entry) async {
    _purchaseEntries.insert(0, entry);

    // Automatically adjust inventory stock level
    final pIndex = _products.indexWhere((p) => p.id == entry.productId);
    if (pIndex != -1) {
      final p = _products[pIndex];
      _products[pIndex] = p.copyWith(
        quantity: p.quantity + entry.quantity,
        purchasePrice: entry.purchasePrice > 0
            ? entry.purchasePrice
            : p.purchasePrice,
      );

      _stockHistory.add(
        StockHistory(
          id: 'sh_${DateTime.now().millisecondsSinceEpoch}_pur_${entry.productId}',
          productId: entry.productId,
          productName: entry.productName,
          quantityChanged: entry.quantity,
          type: 'ADD',
          timestamp: entry.timestamp,
          note: 'Purchase record from ${entry.supplierName} (${entry.note})',
        ),
      );
    }

    _saveAll();
    notifyListeners();
    _triggerAutoSync();
  }

  Future<void> setReceiptPaperSize(String paperSize) async {
    _receiptPaperSize = paperSize;
    StorageService.saveReceiptPaperSize(paperSize);
    final cfg = StorageService.getReceiptConfig();
    cfg['paperSize'] = paperSize;
    _receiptConfig = Map<String, dynamic>.from(cfg);
    await StorageService.saveReceiptConfig(cfg);
    notifyListeners();
  }

  // --- Cloud Sync / Backup (Reliable, Resumable, Idempotent) ---
  Future<bool> syncCloud({bool silent = true}) async {
    if (_isSyncing) return false;
    _isSyncing = true;
    notifyListeners();

    bool success = false;
    try {
      String? customerId;
      final userMap = StorageService.getUser();
      if (userMap != null) {
        final user = User.fromJson(userMap);
        customerId = user.id;
      } else {
        customerId = StorageService.currentUserId;
      }

      if (customerId == null || customerId.isEmpty) {
        customerId = '1';
      }

      if (customerId.isNotEmpty) {
        StorageService.setCurrentUserId(customerId);

        final categoriesPayload = _categories.map((e) => e.toJson()).toList();
        final productsPayload = _products.map((e) => e.toJson()).toList();
        final stockPayload = _stockHistory.map((e) => e.toJson()).toList();
        final invoicesPayload = _invoices.map((e) => e.toJson()).toList();
        final creditDuesPayload = _creditDues.map((e) => e.toJson()).toList();

        final payload = {
          'categories': categoriesPayload,
          'products': productsPayload,
          'stockHistory': stockPayload,
          'invoices': invoicesPayload,
          'creditDues': creditDuesPayload,
          'deletedProductIds': List<String>.from(_deletedProductIds),
          'deletedCategoryIds': List<String>.from(_deletedCategoryIds),
        };

        final response = await ApiClient.post(
          '/customers/$customerId/sync',
          payload,
        );

        if (response.statusCode == 200) {
          final resData = jsonDecode(response.body) as Map<String, dynamic>;
          if (resData['success'] == true) {
            _deletedProductIds.clear();
            _deletedCategoryIds.clear();
            final config = resData['config'];
            if (config != null) {
              final configStr = config is String ? config : jsonEncode(config);
              if (configStr.isNotEmpty && configStr != '{}') {
                await StorageService.saveCustomerConfig(configStr);
              }
              final Map<String, dynamic> configMap =
                  config is Map<String, dynamic>
                  ? config
                  : (config is String
                        ? (jsonDecode(configStr) as Map<String, dynamic>)
                        : {});
              if (configMap.isNotEmpty) {
                _parseAndApplyConfig(configMap);
              }
            }
            final layouts = resData['layouts'];
            if (layouts != null) {
              final layoutStr = layouts is String
                  ? layouts
                  : jsonEncode(layouts);
              if (layoutStr.isNotEmpty && layoutStr != '{}') {
                await StorageService.saveScreenLayouts(layoutStr);
              }
            }

            if (resData['customer'] != null) {
              final cust = resData['customer'] as Map<String, dynamic>;
              final updatedName = cust['businessName']?.toString();
              if (updatedName != null && updatedName.isNotEmpty) {
                _authProvider?.updateBusinessName(updatedName);
              }
            }

            _updateLocalData(resData);
            await fetchLayoutsFromCloud();
            await fetchNotificationsFromCloud();
            _lastSynced = DateTime.now();
            _isOnline = true;
            success = true;
          }
        } else {
          _isOnline = false;
        }
      }
    } catch (e) {
      _isOnline = false;
      debugPrint("Cloud sync background/offline state: $e");
    } finally {
      _isSyncing = false;
      notifyListeners();
    }
    return success;
  }

  void _triggerAutoSync() {
    Future.microtask(() => syncCloud(silent: true));
  }

  void _updateLocalData(Map<String, dynamic> resData) {
    if (resData['categories'] != null) {
      final List cats = resData['categories'];
      _categories = cats
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    if (resData['products'] != null) {
      final List prods = resData['products'];
      final serverProds = prods
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList();

      _products = serverProds.map((sProd) {
        final localIdx = _products.indexWhere((p) => p.id == sProd.id);
        if (localIdx != -1) {
          final localProd = _products[localIdx];
          if ((sProd.barcode == null || sProd.barcode!.trim().isEmpty) &&
              (localProd.barcode != null && localProd.barcode!.trim().isNotEmpty)) {
            return sProd.copyWith(barcode: localProd.barcode);
          }
        }
        return sProd;
      }).toList();
    }
    if (resData['stockHistory'] != null) {
      final List stock = resData['stockHistory'];
      final serverStock = stock
          .map((e) => StockHistory.fromJson(e as Map<String, dynamic>))
          .toList();
      for (final sStock in serverStock) {
        final idx = _stockHistory.indexWhere((s) => s.id == sStock.id);
        if (idx == -1) {
          _stockHistory.add(sStock);
        } else {
          _stockHistory[idx] = sStock;
        }
      }
    }
    if (resData['invoices'] != null) {
      final List invs = resData['invoices'];
      final serverInvs = invs
          .map((e) => Invoice.fromJson(e as Map<String, dynamic>))
          .toList();
      for (final sInv in serverInvs) {
        final idx = _invoices.indexWhere((i) => i.id == sInv.id);
        if (idx == -1) {
          _invoices.add(sInv);
        } else {
          _invoices[idx] = sInv;
        }
      }
      _invoices.sort((a, b) => b.dateTime.compareTo(a.dateTime));
    }
    if (resData['creditDues'] != null) {
      final List dues = resData['creditDues'];
      _creditDues = dues
          .map((e) => CreditDue.fromJson(e as Map<String, dynamic>))
          .toList();
      _saveCreditDues();
    }
    if (_categories.isEmpty) {
      _categories.add(
        Category(
          id: 'cat_general',
          name: 'General',
          description: 'Default category',
        ),
      );
    }
    _saveAll();
  }

  // --- Dashboard & Analytics calculations ---
  double getTodaySalesAmount() {
    final today = DateTime.now();
    return _invoices
        .where(
          (inv) =>
              inv.dateTime.year == today.year &&
              inv.dateTime.month == today.month &&
              inv.dateTime.day == today.day,
        )
        .fold(0.0, (sum, inv) => sum + inv.grandTotal);
  }

  double getMonthlySalesAmount() {
    final today = DateTime.now();
    return _invoices
        .where(
          (inv) =>
              inv.dateTime.year == today.year &&
              inv.dateTime.month == today.month,
        )
        .fold(0.0, (sum, inv) => sum + inv.grandTotal);
  }

  int getTodayBillsCount() {
    final today = DateTime.now();
    return _invoices
        .where(
          (inv) =>
              inv.dateTime.year == today.year &&
              inv.dateTime.month == today.month &&
              inv.dateTime.day == today.day,
        )
        .length;
  }

  int getLowStockCount() {
    return _products
        .where((p) => p.quantity > 0 && p.quantity <= p.lowStockAlert)
        .length;
  }

  int getOutOfStockCount() {
    return _products.where((p) => p.quantity <= 0).length;
  }

  Future<void> fetchLayoutsFromCloud() async {
    try {
      String? customerId = StorageService.currentUserId;
      if (customerId == null || customerId.isEmpty) {
        final userMap = StorageService.getUser();
        if (userMap != null) {
          customerId = userMap['id']?.toString();
        }
      }

      if (customerId != null && customerId.isNotEmpty) {
        final response = await ApiClient.get('/customers/$customerId/layouts');
        if (response.statusCode == 200) {
          final resData = jsonDecode(response.body);
          if (resData != null) {
            final layoutStr = resData is String ? resData : jsonEncode(resData);
            if (layoutStr.isNotEmpty && layoutStr != '{}') {
              final previousLayout = StorageService.getScreenLayouts();
              if (previousLayout != layoutStr) {
                await StorageService.saveScreenLayouts(layoutStr);
                notifyListeners();
              }
            }
          }
        }
      }
    } catch (e) {
      debugPrint("Fetch layouts error: $e");
    }
  }

  Future<void> fetchConfigFromCloud() async {
    try {
      String? customerId = StorageService.currentUserId;
      if (customerId == null || customerId.isEmpty) {
        final userMap = StorageService.getUser();
        if (userMap != null) {
          customerId = userMap['id']?.toString();
        }
      }

      if (customerId != null && customerId.isNotEmpty) {
        final response = await ApiClient.get('/customers/$customerId/config');
        if (response.statusCode == 200) {
          final resData = jsonDecode(response.body);
          if (resData != null) {
            final configMap = resData is Map<String, dynamic>
                ? resData
                : (resData is String
                    ? (jsonDecode(resData) as Map<String, dynamic>)
                    : <String, dynamic>{});
            if (configMap.isNotEmpty) {
              await StorageService.saveCustomerConfig(jsonEncode(configMap));
              _parseAndApplyConfig(configMap);
            }
          }
        }
      }
    } catch (e) {
      debugPrint("Fetch config error: $e");
    }
  }

  void _parseAndApplyConfig(Map<String, dynamic> resData) {
    bool notify = false;

    // Parse enabled modules
    final dynamic modulesPayload =
        resData['modules'] ?? resData['enabledModules'];
    if (modulesPayload is List) {
      for (var item in modulesPayload) {
        if (item is Map) {
          final k = (item['key'] ?? item['id'] ?? item['name'] ?? '').toString().toLowerCase().trim().replaceAll(' ', '_');
          final b = item['enabled'] == true || item['enabled'].toString() == 'true' || item['status'] == 'unlocked' || item['status'] == 'enabled';
          if (k.isNotEmpty && _enabledModules[k] != b) {
            _enabledModules[k] = b;
            notify = true;
          }
        } else if (item is String) {
          final k = item.toLowerCase().trim().replaceAll(' ', '_');
          if (k.isNotEmpty && _enabledModules[k] != true) {
            _enabledModules[k] = true;
            notify = true;
          }
        }
      }
    } else if (modulesPayload is Map) {
      modulesPayload.forEach((key, val) {
        final k = key.toString().toLowerCase().trim().replaceAll(' ', '_');
        final b = val == true || val.toString() == 'true';
        if (_enabledModules[k] != b) {
          _enabledModules[k] = b;
          notify = true;
        }
      });
    }

    if (notify) {
      StorageService.saveUserModules(jsonEncode(_enabledModules));
    }

    // Parse festival / app theme
    final themeKey =
        (resData['festivalTheme'] ?? resData['appTheme'] ?? resData['theme'])
            ?.toString();
    if (themeKey != null &&
        themeKey.isNotEmpty &&
        _activeFestivalTheme != themeKey) {
      _activeFestivalTheme = themeKey;
      StorageService.saveActiveFestivalTheme(themeKey);
      notify = true;
    }

    // Parse festival banner images & URL
    final bannerUrl =
        (resData['festivalBannerUrl'] ?? resData['bannerUrl'])?.toString() ??
        '';
    if (bannerUrl != _festivalBannerUrl) {
      _festivalBannerUrl = bannerUrl;
      StorageService.saveFestivalBannerUrl(bannerUrl);
      notify = true;
    }

    final bannerImagesRaw =
        (resData['festivalBannerImages'] ?? resData['bannerImages'])
            ?.toString() ??
        '';
    List<String> newImagesList = [];
    if (bannerImagesRaw.isNotEmpty) {
      try {
        final parsed = jsonDecode(bannerImagesRaw);
        if (parsed is List) {
          newImagesList = parsed.map((e) => e.toString()).toList();
        }
      } catch (_) {}
    }

    if (_festivalBannerImages.join(',') != newImagesList.join(',')) {
      _festivalBannerImages = newImagesList;
      StorageService.saveFestivalBannerImages(jsonEncode(newImagesList));
      notify = true;
    }

    // Parse customer account status for suspension
    final statusVal = resData['status']?.toString().toLowerCase();
    if (statusVal == 'suspended') {
      if (!_isSuspended) {
        _isSuspended = true;
        _suspendedMessage =
            'Account Suspended: Subscription temporarily disabled by admin. Access restricted until reactivated.';
        notify = true;
      }
    } else if (statusVal == 'active' || statusVal == 'trial') {
      if (_isSuspended) {
        _isSuspended = false;
        _suspendedMessage = '';
        notify = true;
      }
    }

    if (notify) {
      notifyListeners();
    }
  }

  List<Map<String, dynamic>> getDashboardWidgets() {
    final raw = StorageService.getScreenLayouts();
    if (raw == null || raw.trim().isEmpty) return _getDefaultDashboardWidgets();
    try {
      final layoutsMap = jsonDecode(raw) as Map<String, dynamic>;
      final dashboardLayout = layoutsMap['dashboard'] ?? layoutsMap;
      if (dashboardLayout != null && dashboardLayout['widgets'] != null) {
        final List widgets = dashboardLayout['widgets'];
        final parsed = widgets
            .map((e) => e as Map<String, dynamic>)
            .where((w) => w['visible'] == true)
            .toList();
        if (parsed.isNotEmpty) return parsed;
      }
    } catch (e) {
      debugPrint("Error parsing dashboard widgets: $e");
    }
    return _getDefaultDashboardWidgets();
  }

  List<Map<String, dynamic>> _getDefaultDashboardWidgets() {
    return [
      {'type': 'sales_card', 'label': "Today's Sales", 'w': 6, 'h': 2},
      {'type': 'profit_card', 'label': 'Monthly Sales', 'w': 6, 'h': 2},
      {'type': 'inventory_card', 'label': 'Revenue', 'w': 6, 'h': 2},
      {'type': 'low_stock_card', 'label': 'Bills Today', 'w': 6, 'h': 2},
      {'type': 'customer_count', 'label': 'Total Products', 'w': 6, 'h': 2},
      {'type': 'employee_count', 'label': 'Low Stock Alert', 'w': 6, 'h': 2},
      {
        'type': 'sales_chart',
        'label': 'Daily Sales (Last 7 Days)',
        'w': 12,
        'h': 4,
      },
      {'type': 'recent_bills', 'label': 'Recent Bills', 'w': 12, 'h': 4},
      {'type': 'quick_actions', 'label': 'Quick Actions', 'w': 12, 'h': 3},
      {'type': 'pending_payments', 'label': 'Pending Payments', 'w': 12, 'h': 3},
    ];
  }

  String exportBackupData() {
    final Map<String, dynamic> backup = {
      'categories': _categories.map((c) => c.toJson()).toList(),
      'products': _products.map((p) => p.toJson()).toList(),
      'stockHistory': _stockHistory.map((s) => s.toJson()).toList(),
      'invoices': _invoices.map((i) => i.toJson()).toList(),
      'cancelledInvoices': _cancelledInvoices.map((c) => c.toJson()).toList(),
      'purchaseEntries': _purchaseEntries.map((p) => p.toJson()).toList(),
      'receiptPaperSize': _receiptPaperSize,
      'exportedAt': DateTime.now().toIso8601String(),
    };
    return jsonEncode(backup);
  }

  bool importBackupData(String jsonString) {
    try {
      final Map<String, dynamic> data = jsonDecode(jsonString);
      if (data.containsKey('categories') && data.containsKey('products')) {
        _categories = (data['categories'] as List)
            .map((c) => Category.fromJson(c))
            .toList();
        _products = (data['products'] as List)
            .map((p) => Product.fromJson(p))
            .toList();

        if (data.containsKey('stockHistory')) {
          _stockHistory = (data['stockHistory'] as List)
              .map((s) => StockHistory.fromJson(s))
              .toList();
        } else {
          _stockHistory = [];
        }

        if (data.containsKey('invoices')) {
          _invoices = (data['invoices'] as List)
              .map((i) => Invoice.fromJson(i))
              .toList();
        } else {
          _invoices = [];
        }

        if (data.containsKey('cancelledInvoices')) {
          _cancelledInvoices = (data['cancelledInvoices'] as List)
              .map((c) => CancelledInvoice.fromJson(c))
              .toList();
        }

        if (data.containsKey('purchaseEntries')) {
          _purchaseEntries = (data['purchaseEntries'] as List)
              .map((p) => PurchaseEntry.fromJson(p))
              .toList();
        }

        if (data.containsKey('receiptPaperSize')) {
          _receiptPaperSize = data['receiptPaperSize'].toString();
        }

        _saveAll();
        notifyListeners();
        return true;
      }
    } catch (e) {
      debugPrint("Import error: $e");
    }
    return false;
  }
}
