import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static SharedPreferences? _prefsInstance;
  static SharedPreferences get _prefs => _prefsInstance!;
  static String? _currentUserId;

  static Future<void> init() async {
    _prefsInstance = await SharedPreferences.getInstance();
  }

  /// Set the current user ID so all data keys are scoped per-customer.
  /// Call this on login. Pass null on logout.
  static void setCurrentUserId(String? userId) {
    _currentUserId = userId;
  }

  static String? get currentUserId => _currentUserId;

  /// Build a per-user storage key. Falls back to global key if no user is logged in.
  static String _userKey(String base) {
    if (_currentUserId != null && _currentUserId!.isNotEmpty) {
      return '${base}_user_$_currentUserId';
    }
    return base;
  }

  // Generic helpers
  static Future<bool> setString(String key, String value) async {
    return await _prefs.setString(key, value);
  }

  static String? getString(String key) {
    return _prefs.getString(key);
  }

  static Future<bool> remove(String key) async {
    return await _prefs.remove(key);
  }

  static Future<void> saveCreditDues(List<Map<String, dynamic>> list) async {
    await _prefs.setString(_userKey('pos_credit_dues'), jsonEncode(list));
  }

  static List<Map<String, dynamic>> getCreditDues() {
    final raw = _prefs.getString(_userKey('pos_credit_dues'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw);
      if (decoded is List) return decoded.cast<Map<String, dynamic>>();
    } catch (_) {}
    return [];
  }

  // Concrete Model Helpers
  static Future<void> saveUser(Map<String, dynamic>? userMap) async {
    if (userMap == null) {
      await _prefs.remove('pos_user');
    } else {
      await _prefs.setString('pos_user', jsonEncode(userMap));
    }
  }

  static Map<String, dynamic>? getUser() {
    final raw = _prefs.getString('pos_user');
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  // ---- Per-user scoped data methods ----

  static Future<void> saveCategories(List<Map<String, dynamic>> categories) async {
    await _prefs.setString(_userKey('pos_categories'), jsonEncode(categories));
  }

  static List<Map<String, dynamic>> getCategories() {
    final raw = _prefs.getString(_userKey('pos_categories'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveProducts(List<Map<String, dynamic>> products) async {
    await _prefs.setString(_userKey('pos_products'), jsonEncode(products));
  }

  static List<Map<String, dynamic>> getProducts() {
    final raw = _prefs.getString(_userKey('pos_products'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveStockHistory(List<Map<String, dynamic>> history) async {
    await _prefs.setString(_userKey('pos_stock_history'), jsonEncode(history));
  }

  static List<Map<String, dynamic>> getStockHistory() {
    final raw = _prefs.getString(_userKey('pos_stock_history'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveInvoices(List<Map<String, dynamic>> invoices) async {
    await _prefs.setString(_userKey('pos_invoices'), jsonEncode(invoices));
  }

  static List<Map<String, dynamic>> getInvoices() {
    final raw = _prefs.getString(_userKey('pos_invoices'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveScreenLayouts(String rawLayouts) async {
    await _prefs.setString(_userKey('pos_screen_layouts'), rawLayouts);
  }

  static String? getScreenLayouts() {
    return _prefs.getString(_userKey('pos_screen_layouts'));
  }

  static Future<void> saveCustomerConfig(String rawConfig) async {
    await _prefs.setString(_userKey('pos_customer_config'), rawConfig);
  }

  static String? getCustomerConfig() {
    return _prefs.getString(_userKey('pos_customer_config'));
  }

  static Future<void> saveAdvertisements(List<Map<String, dynamic>> ads) async {
    await _prefs.setString('pos_advertisements', jsonEncode(ads));
  }

  static List<Map<String, dynamic>> getAdvertisements() {
    final raw = _prefs.getString('pos_advertisements');
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveDarkTheme(bool isDark) async {
    await _prefs.setBool('pos_dark_theme', isDark);
  }

  static bool isDarkTheme() {
    return _prefs.getBool('pos_dark_theme') ?? false;
  }

  static Future<void> savePrinterType(String printerType) async {
    await _prefs.setString('pos_printer_type', printerType);
  }

  static String getPrinterType() {
    return _prefs.getString('pos_printer_type') ?? 'A4'; // A4, Thermal, Bluetooth, USB
  }

  static Future<void> saveReceiptPaperSize(String paperSize) async {
    await _prefs.setString(_userKey('pos_receipt_paper_size'), paperSize);
  }

  static String getReceiptPaperSize() {
    return _prefs.getString(_userKey('pos_receipt_paper_size')) ?? '80mm'; // 58mm, 80mm, A4, A5
  }

  static Future<void> saveReceiptConfig(Map<String, dynamic> configMap) async {
    await _prefs.setString(_userKey('pos_receipt_config'), jsonEncode(configMap));
  }

  static Map<String, dynamic> getReceiptConfig() {
    final raw = _prefs.getString(_userKey('pos_receipt_config'));
    if (raw != null) {
      try {
        return jsonDecode(raw) as Map<String, dynamic>;
      } catch (_) {}
    }
    return {
      'storeName': '',
      'language': 'en',
      'tagline': 'Retail & Supermarket Billing',
      'address': 'Main Road, Retail Plaza',
      'phone': '+91 98765 43210',
      'email': 'store@retail.com',
      'website': 'www.retailstore.com',
      'gstin': '29ABCDE1234F1Z5',
      'receiptTitle': 'TAX INVOICE',
      'invoicePrefix': 'INV-',
      'footerNote': 'Thank you for shopping with us! Visit again.',
      'refundPolicy': 'Items can be returned within 7 days with original receipt.',
      'termsConditions': 'Goods once sold will not be taken back without bill.',
      'showGstBreakup': true,
      'showBarcode': true,
      'showQrCode': true,
      'showLogo': true,
      'paperSize': '80mm',
      'fontFamily': 'Helvetica',
      'fontSize': 'Medium',
      'alignment': 'Center',
      'logoSize': 'Medium',
      'logoPosition': 'Center',
    };
  }

  static Future<void> saveReceiptTemplates(String templatesJson) async {
    await _prefs.setString(_userKey('pos_receipt_templates'), templatesJson);
  }

  static String getReceiptTemplates() {
    return _prefs.getString(_userKey('pos_receipt_templates')) ?? '';
  }

  static Future<void> saveCancelledInvoices(List<Map<String, dynamic>> list) async {
    await _prefs.setString(_userKey('pos_cancelled_invoices'), jsonEncode(list));
  }

  static List<Map<String, dynamic>> getCancelledInvoices() {
    final raw = _prefs.getString(_userKey('pos_cancelled_invoices'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> savePurchaseEntries(List<Map<String, dynamic>> list) async {
    await _prefs.setString(_userKey('pos_purchase_entries'), jsonEncode(list));
  }

  static List<Map<String, dynamic>> getPurchaseEntries() {
    final raw = _prefs.getString(_userKey('pos_purchase_entries'));
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveUserModules(String modulesJson) async {
    await _prefs.setString(_userKey('pos_user_modules'), modulesJson);
  }

  static String? getUserModules() {
    return _prefs.getString(_userKey('pos_user_modules'));
  }

  static Future<void> saveActiveFestivalTheme(String festivalTheme) async {
    await _prefs.setString(_userKey('pos_festival_theme'), festivalTheme);
  }

  static String getActiveFestivalTheme() {
    return _prefs.getString(_userKey('pos_festival_theme')) ?? 'standard';
  }

  static Future<void> saveFestivalBannerImages(String jsonStr) async {
    await _prefs.setString(_userKey('pos_festival_banner_images'), jsonStr);
  }

  static String getFestivalBannerImages() {
    return _prefs.getString(_userKey('pos_festival_banner_images')) ?? '';
  }

  static Future<void> saveFestivalBannerUrl(String url) async {
    await _prefs.setString(_userKey('pos_festival_banner_url'), url);
  }

  static String getFestivalBannerUrl() {
    return _prefs.getString(_userKey('pos_festival_banner_url')) ?? '';
  }
}
