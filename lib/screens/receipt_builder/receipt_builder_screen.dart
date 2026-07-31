import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:printing/printing.dart';
import '../../providers/db_provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/invoice_generator.dart';
import '../../models/invoice.dart';

class ReceiptBuilderScreen extends StatefulWidget {
  const ReceiptBuilderScreen({super.key});

  @override
  State<ReceiptBuilderScreen> createState() => _ReceiptBuilderScreenState();
}

class _ReceiptBuilderScreenState extends State<ReceiptBuilderScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Controllers for Header & Contact Info
  late TextEditingController _storeNameCtrl;
  late TextEditingController _taglineCtrl;
  late TextEditingController _addressCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _emailCtrl;
  late TextEditingController _websiteCtrl;
  late TextEditingController _gstinCtrl;
  late TextEditingController _receiptTitleCtrl;
  late TextEditingController _invoicePrefixCtrl;
  late TextEditingController _footerCtrl;
  late TextEditingController _refundCtrl;
  late TextEditingController _termsCtrl;
  late TextEditingController _qrDataCtrl;

  // Custom Labels Controllers
  late TextEditingController _lblItemCtrl;
  late TextEditingController _lblQtyCtrl;
  late TextEditingController _lblRateCtrl;
  late TextEditingController _lblAmountCtrl;
  late TextEditingController _lblSubtotalCtrl;
  late TextEditingController _lblTaxCtrl;
  late TextEditingController _lblDiscountCtrl;
  late TextEditingController _lblGrandTotalCtrl;
  late TextEditingController _lblPaymentModeCtrl;

  // Design Settings
  String _selectedLang = 'en';
  String _paperSize = '80mm';
  String _fontFamily = 'Helvetica';
  String _fontSize = 'Medium';
  String _alignment = 'Center';
  String _logoSize = 'Medium';
  String _logoPosition = 'Center';
  String _logoUrl = '';
  bool _isRtl = false;

  // Field Toggles
  bool _showLogo = true;
  bool _showTagline = true;
  bool _showAddress = true;
  bool _showPhone = true;
  bool _showEmail = true;
  bool _showWebsite = true;
  bool _showGstin = true;
  bool _showCustomer = true;
  bool _showCashier = true;
  bool _showGstBreakup = true;
  bool _showBarcode = true;
  bool _showQrCode = true;
  bool _showFooter = true;
  bool _showRefundPolicy = true;
  bool _showTerms = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadCurrentConfig();
  }

  void _loadCurrentConfig() {
    final db = Provider.of<DbProvider>(context, listen: false);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final cfg = db.receiptConfig;

    _storeNameCtrl = TextEditingController(
      text: (cfg['storeName']?.toString().isNotEmpty == true)
          ? cfg['storeName'].toString()
          : (auth.currentUser?.businessName ?? 'ApexPOS Retail Store'),
    );
    _taglineCtrl = TextEditingController(text: cfg['tagline']?.toString() ?? 'Quality Groceries & Retail Billing');
    _addressCtrl = TextEditingController(text: cfg['address']?.toString() ?? '123 Main Commercial Street, City Branch');
    _phoneCtrl = TextEditingController(text: cfg['phone']?.toString() ?? '+91 98765 43210');
    _emailCtrl = TextEditingController(text: cfg['email']?.toString() ?? 'support@apexpos.com');
    _websiteCtrl = TextEditingController(text: cfg['website']?.toString() ?? 'www.apexpos-store.com');
    _gstinCtrl = TextEditingController(text: cfg['gstin']?.toString() ?? '29ABCDE1234F1Z5');
    _receiptTitleCtrl = TextEditingController(text: cfg['receiptTitle']?.toString() ?? 'TAX INVOICE');
    _invoicePrefixCtrl = TextEditingController(text: cfg['invoicePrefix']?.toString() ?? 'INV-');
    _footerCtrl = TextEditingController(text: cfg['footerNote']?.toString() ?? 'Thank you for shopping with us! Visit again.');
    _refundCtrl = TextEditingController(text: cfg['refundPolicy']?.toString() ?? 'Items can be returned within 7 days with original bill.');
    _termsCtrl = TextEditingController(text: cfg['termsConditions']?.toString() ?? 'Goods once sold will not be taken back without bill receipt.');
    _qrDataCtrl = TextEditingController(text: cfg['qrData']?.toString() ?? 'upi://pay?pa=apexpos@upi&pn=ApexPOS');

    // Labels
    _lblItemCtrl = TextEditingController(text: cfg['lblItem']?.toString() ?? 'Item');
    _lblQtyCtrl = TextEditingController(text: cfg['lblQty']?.toString() ?? 'Qty');
    _lblRateCtrl = TextEditingController(text: cfg['lblRate']?.toString() ?? 'Rate');
    _lblAmountCtrl = TextEditingController(text: cfg['lblAmount']?.toString() ?? 'Amount');
    _lblSubtotalCtrl = TextEditingController(text: cfg['lblSubtotal']?.toString() ?? 'Subtotal');
    _lblTaxCtrl = TextEditingController(text: cfg['lblTax']?.toString() ?? 'Tax / GST');
    _lblDiscountCtrl = TextEditingController(text: cfg['lblDiscount']?.toString() ?? 'Discount');
    _lblGrandTotalCtrl = TextEditingController(text: cfg['lblGrandTotal']?.toString() ?? 'Grand Total');
    _lblPaymentModeCtrl = TextEditingController(text: cfg['lblPaymentMode']?.toString() ?? 'Payment Mode');

    _selectedLang = cfg['language']?.toString() ?? 'en';
    _paperSize = cfg['paperSize']?.toString() ?? '80mm';
    _fontFamily = cfg['fontFamily']?.toString() ?? 'Helvetica';
    _fontSize = cfg['fontSize']?.toString() ?? 'Medium';
    _alignment = cfg['alignment']?.toString() ?? 'Center';
    _logoSize = cfg['logoSize']?.toString() ?? 'Medium';
    _logoPosition = cfg['logoPosition']?.toString() ?? 'Center';
    _logoUrl = cfg['logoUrl']?.toString() ?? '';
    _isRtl = cfg['isRtl'] == true || _selectedLang == 'ar' || _selectedLang == 'ur' || _selectedLang == 'he';

    _showLogo = cfg['showLogo'] != false;
    _showTagline = cfg['showTagline'] != false;
    _showAddress = cfg['showAddress'] != false;
    _showPhone = cfg['showPhone'] != false;
    _showEmail = cfg['showEmail'] == true;
    _showWebsite = cfg['showWebsite'] == true;
    _showGstin = cfg['showGstin'] != false;
    _showCustomer = cfg['showCustomer'] != false;
    _showCashier = cfg['showCashier'] != false;
    _showGstBreakup = cfg['showGstBreakup'] != false;
    _showBarcode = cfg['showBarcode'] != false;
    _showQrCode = cfg['showQrCode'] != false;
    _showFooter = cfg['showFooter'] != false;
    _showRefundPolicy = cfg['showRefundPolicy'] == true;
    _showTerms = cfg['showTerms'] == true;
  }

  @override
  void dispose() {
    _tabController.dispose();
    _storeNameCtrl.dispose();
    _taglineCtrl.dispose();
    _addressCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _websiteCtrl.dispose();
    _gstinCtrl.dispose();
    _receiptTitleCtrl.dispose();
    _invoicePrefixCtrl.dispose();
    _footerCtrl.dispose();
    _refundCtrl.dispose();
    _termsCtrl.dispose();
    _qrDataCtrl.dispose();

    _lblItemCtrl.dispose();
    _lblQtyCtrl.dispose();
    _lblRateCtrl.dispose();
    _lblAmountCtrl.dispose();
    _lblSubtotalCtrl.dispose();
    _lblTaxCtrl.dispose();
    _lblDiscountCtrl.dispose();
    _lblGrandTotalCtrl.dispose();
    _lblPaymentModeCtrl.dispose();
    super.dispose();
  }

  void applyLanguagePreset(String langCode) {
    setState(() {
      _selectedLang = langCode;
      _isRtl = langCode == 'ar' || langCode == 'ur' || langCode == 'he';

      switch (langCode) {
        case 'kn':
          _storeNameCtrl.text = 'ApexPOS ಗಿರಣಿ ಸೂಪರ್ ಮಾರ್ಕೆಟ್';
          _taglineCtrl.text = 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ದಿನಸಿ & ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರ';
          _receiptTitleCtrl.text = 'ತೆರಿಗೆ ರಸೀದಿ (TAX INVOICE)';
          _footerCtrl.text = 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಭೇಟಿಗೆ ಧನ್ಯವಾದಗಳು, ಮತ್ತೆ ಬನ್ನಿ!';
          _refundCtrl.text = 'ಖರೀದಿಸಿದ ೭ ದಿನಗಳ ಒಳಗೆ ರಸೀದಿಯೊಂದಿಗೆ ಸರಕನ್ನು ಹಿಂತಿರುಗಿಸಬಹುದು.';
          _termsCtrl.text = 'ರಸೀದಿ ಇಲ್ಲದೆ ಸರಕನ್ನು ಹಿಂತಿರುಗಿಸಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ.';
          _lblItemCtrl.text = 'ವಸ್ತು';
          _lblQtyCtrl.text = 'ಪ್ರಮಾಣ';
          _lblRateCtrl.text = 'ಬೆಲೆ';
          _lblAmountCtrl.text = 'ಒಟ್ಟು ಮೊತ್ತ';
          _lblSubtotalCtrl.text = 'ಉಪ ಒಟ್ಟು';
          _lblTaxCtrl.text = 'ಜಿಎಸ್‌ಟಿ ತೆರಿಗೆ';
          _lblDiscountCtrl.text = 'ರಿಯಾಯಿತಿ';
          _lblGrandTotalCtrl.text = 'ಅಂತಿಮ ಒಟ್ಟು';
          _lblPaymentModeCtrl.text = 'ಪಾವತಿ ವಿಧಾನ';
          break;
        case 'hi':
          _storeNameCtrl.text = 'ApexPOS सुपरमार्केट';
          _taglineCtrl.text = 'गुणवत्तापूर्ण किराना एवं खुदरा बिक्री';
          _receiptTitleCtrl.text = 'कर चालान (TAX INVOICE)';
          _footerCtrl.text = 'खरीदारी के लिए धन्यवाद! पुनः पधारें!';
          _lblItemCtrl.text = 'वस्तु';
          _lblQtyCtrl.text = 'मात्रा';
          _lblRateCtrl.text = 'दर';
          _lblAmountCtrl.text = 'कुल राशि';
          _lblSubtotalCtrl.text = 'उप-कुल';
          _lblTaxCtrl.text = 'जीएसटी कर';
          _lblDiscountCtrl.text = 'छूट';
          _lblGrandTotalCtrl.text = 'कुल देय राशि';
          _lblPaymentModeCtrl.text = 'भुगतान का तरीका';
          break;
        case 'te':
          _storeNameCtrl.text = 'ApexPOS సూపర్‌మార్కెట్';
          _receiptTitleCtrl.text = 'పన్ను ఇన్వాయిస్ (TAX INVOICE)';
          _footerCtrl.text = 'షాపింగ్ చేసినందుకు ధన్యవాదాలు! మళ్లీ రండి!';
          _lblItemCtrl.text = 'వస్తువు';
          _lblQtyCtrl.text = 'పరిమాణం';
          _lblRateCtrl.text = 'ధర';
          _lblAmountCtrl.text = 'మొత్తం';
          break;
        case 'ta':
          _storeNameCtrl.text = 'ApexPOS சூப்பர்மார்க்கெட்';
          _receiptTitleCtrl.text = 'வரி ரசீது (TAX INVOICE)';
          _footerCtrl.text = 'நன்றி! மீண்டும் வருக!';
          _lblItemCtrl.text = 'பொருள்';
          _lblQtyCtrl.text = 'அளவு';
          _lblRateCtrl.text = 'விலை';
          _lblAmountCtrl.text = 'மொத்தம்';
          break;
        case 'ar':
          _storeNameCtrl.text = 'سوبرماركت أبيكس';
          _taglineCtrl.text = 'المواد الغذائية والتجزئة عالية الجودة';
          _receiptTitleCtrl.text = 'فاتورة ضريبية';
          _footerCtrl.text = 'شكرا لتسوقكم معنا! نرحب بزيارتكم مرة أخرى.';
          _lblItemCtrl.text = 'الصنف';
          _lblQtyCtrl.text = 'الكمية';
          _lblRateCtrl.text = 'السعر';
          _lblAmountCtrl.text = 'المبلغ';
          _lblSubtotalCtrl.text = 'المجموع الفرعي';
          _lblTaxCtrl.text = 'ضريبة القيمة المضافة';
          _lblDiscountCtrl.text = 'الخصم';
          _lblGrandTotalCtrl.text = 'المجموع الإجمالي';
          _lblPaymentModeCtrl.text = 'طريقة الدفع';
          break;
        default:
          _storeNameCtrl.text = 'ApexPOS Supermarket';
          _taglineCtrl.text = 'Quality Groceries & Retail Billing';
          _receiptTitleCtrl.text = 'TAX INVOICE';
          _footerCtrl.text = 'Thank you for shopping with us! Visit again.';
          _lblItemCtrl.text = 'Item';
          _lblQtyCtrl.text = 'Qty';
          _lblRateCtrl.text = 'Rate';
          _lblAmountCtrl.text = 'Amount';
          _lblSubtotalCtrl.text = 'Subtotal';
          _lblTaxCtrl.text = 'GST Tax';
          _lblDiscountCtrl.text = 'Discount';
          _lblGrandTotalCtrl.text = 'Grand Total';
          _lblPaymentModeCtrl.text = 'Payment Mode';
          break;
      }
    });
  }

  Map<String, dynamic> _buildConfigMap() {
    return {
      'storeName': _storeNameCtrl.text.trim(),
      'tagline': _taglineCtrl.text.trim(),
      'address': _addressCtrl.text.trim(),
      'phone': _phoneCtrl.text.trim(),
      'email': _emailCtrl.text.trim(),
      'website': _websiteCtrl.text.trim(),
      'gstin': _gstinCtrl.text.trim(),
      'receiptTitle': _receiptTitleCtrl.text.trim(),
      'invoicePrefix': _invoicePrefixCtrl.text.trim(),
      'footerNote': _footerCtrl.text.trim(),
      'refundPolicy': _refundCtrl.text.trim(),
      'termsConditions': _termsCtrl.text.trim(),
      'qrData': _qrDataCtrl.text.trim(),

      'lblItem': _lblItemCtrl.text.trim(),
      'lblQty': _lblQtyCtrl.text.trim(),
      'lblRate': _lblRateCtrl.text.trim(),
      'lblAmount': _lblAmountCtrl.text.trim(),
      'lblSubtotal': _lblSubtotalCtrl.text.trim(),
      'lblTax': _lblTaxCtrl.text.trim(),
      'lblDiscount': _lblDiscountCtrl.text.trim(),
      'lblGrandTotal': _lblGrandTotalCtrl.text.trim(),
      'lblPaymentMode': _lblPaymentModeCtrl.text.trim(),

      'language': _selectedLang,
      'paperSize': _paperSize,
      'fontFamily': _fontFamily,
      'fontSize': _fontSize,
      'alignment': _alignment,
      'logoSize': _logoSize,
      'logoPosition': _logoPosition,
      'logoUrl': _logoUrl,
      'isRtl': _isRtl,

      'showLogo': _showLogo,
      'showTagline': _showTagline,
      'showAddress': _showAddress,
      'showPhone': _showPhone,
      'showEmail': _showEmail,
      'showWebsite': _showWebsite,
      'showGstin': _showGstin,
      'showCustomer': _showCustomer,
      'showCashier': _showCashier,
      'showGstBreakup': _showGstBreakup,
      'showBarcode': _showBarcode,
      'showQrCode': _showQrCode,
      'showFooter': _showFooter,
      'showRefundPolicy': _showRefundPolicy,
      'showTerms': _showTerms,
    };
  }

  Future<void> _saveConfig() async {
    final db = Provider.of<DbProvider>(context, listen: false);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final map = _buildConfigMap();
    await db.updateReceiptConfig(map);
    if (map['storeName'] != null && map['storeName'].toString().trim().isNotEmpty) {
      auth.updateBusinessName(map['storeName'].toString().trim());
    }
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Receipt Template saved! Store name & receipt layout updated across app.'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 3),
        ),
      );
    }
  }

  Future<void> _printTestReceipt() async {
    try {
      final sampleInvoice = Invoice(
        id: 'DEMO-101',
        invoiceNumber: '${_invoicePrefixCtrl.text.trim()}1001',
        notes: 'Customer: Ramesh Kumar (+91 98765 00000)',
        items: [
          InvoiceItem(
            productId: 'P1',
            productName: 'Basmati Rice 5kg',
            unit: 'pack',
            defaultPrice: 450.0,
            billingPrice: 450.0,
            purchasePrice: 380.0,
            quantity: 1,
            billingMethod: 'QUANTITY',
            total: 450.0,
          ),
          InvoiceItem(
            productId: 'P2',
            productName: 'Sunflower Cooking Oil 1L',
            unit: 'litre',
            defaultPrice: 160.0,
            billingPrice: 160.0,
            purchasePrice: 130.0,
            quantity: 2,
            billingMethod: 'QUANTITY',
            total: 320.0,
          ),
          InvoiceItem(
            productId: 'P3',
            productName: 'Tata Salt 1kg',
            unit: 'pack',
            defaultPrice: 28.0,
            billingPrice: 28.0,
            purchasePrice: 20.0,
            quantity: 1,
            billingMethod: 'QUANTITY',
            total: 28.0,
          ),
        ],
        subTotal: 798.0,
        discount: 20.0,
        grandTotal: 778.0,
        dateTime: DateTime.now(),
      );

      final pdfBytes = await InvoiceGenerator.generatePdf(
        sampleInvoice,
        _storeNameCtrl.text.trim(),
        address: _addressCtrl.text.trim(),
        phone: _phoneCtrl.text.trim(),
        gstin: _gstinCtrl.text.trim(),
        paperSize: _paperSize,
      );

      await Printing.layoutPdf(
        onLayout: (format) => pdfBytes,
        name: 'Test-Receipt-Preview',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Print Test Error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isMobile = MediaQuery.of(context).size.width < 850;

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.receipt_long_rounded, color: Colors.amber),
            SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Receipt & Bill Designer', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Full Multi-language Receipt Template Builder', style: TextStyle(fontSize: 11, color: Colors.white70)),
              ],
            ),
          ],
        ),
        actions: [
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.white,
              side: const BorderSide(color: Colors.white54),
            ),
            onPressed: _printTestReceipt,
            icon: const Icon(Icons.print, size: 16),
            label: const Text('Print Preview', style: TextStyle(fontSize: 12)),
          ),
          const SizedBox(width: 8),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade700,
              foregroundColor: Colors.white,
            ),
            onPressed: _saveConfig,
            icon: const Icon(Icons.save, size: 16),
            label: const Text('Save Template', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 12),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.storefront, size: 18), text: 'Store Info & Layout'),
            Tab(icon: Icon(Icons.check_box, size: 18), text: 'Fields & QR / Barcode'),
            Tab(icon: Icon(Icons.preview, size: 18), text: 'Live Paper Preview'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showQuickEditReceiptModal(context),
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.edit),
        label: const Text('Edit Receipt Bill', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: isMobile
          ? TabBarView(
              controller: _tabController,
              children: [
                _buildStoreInfoTab(theme),
                _buildFieldsTab(theme),
                _buildLivePreviewTab(theme),
              ],
            )
          : Row(
              children: [
                // Left Editor Panel (Tabs)
                Expanded(
                  flex: 3,
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildStoreInfoTab(theme),
                      _buildFieldsTab(theme),
                      _buildLivePreviewTab(theme),
                    ],
                  ),
                ),
                const VerticalDivider(width: 1),
                // Right Live Preview Panel
                Expanded(
                  flex: 2,
                  child: Container(
                    color: Colors.grey.shade200,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              '⚡ Live Interactive Preview',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            Chip(
                              label: Text(_paperSize, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              backgroundColor: Colors.amber.shade100,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Expanded(child: SingleChildScrollView(child: _buildReceiptCardPreview(theme))),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  // ========================== TAB 1: STORE INFO & LAYOUT ==========================

  Widget _buildStoreInfoTab(ThemeData theme) {
    final isWide = MediaQuery.of(context).size.width > 600;
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Business Details & Paper Layout', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 4),
        Text('Customize business header, address, tax registration, and paper size.', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        const SizedBox(height: 16),

        DropdownButtonFormField<String>(
          value: _paperSize,
          isExpanded: true,
          decoration: const InputDecoration(labelText: 'Paper Format / Size', prefixIcon: Icon(Icons.print)),
          items: const [
            DropdownMenuItem(value: '80mm', child: Text('80mm Thermal Receipt (Standard POS)')),
            DropdownMenuItem(value: '58mm', child: Text('58mm Small Thermal Receipt (Mini POS)')),
            DropdownMenuItem(value: 'A4', child: Text('A4 Standard Invoice Sheet')),
            DropdownMenuItem(value: 'A5', child: Text('A5 Half Sheet Invoice')),
          ],
          onChanged: (v) => setState(() => _paperSize = v!),
        ),
        const SizedBox(height: 12),

        TextField(
          controller: _storeNameCtrl,
          decoration: const InputDecoration(labelText: 'Store / Business Name', prefixIcon: Icon(Icons.storefront)),
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 12),

        TextField(
          controller: _taglineCtrl,
          decoration: const InputDecoration(labelText: 'Tagline / Subtitle', prefixIcon: Icon(Icons.subtitles)),
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 12),

        TextField(
          controller: _addressCtrl,
          decoration: const InputDecoration(labelText: 'Store Address', prefixIcon: Icon(Icons.location_on)),
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 12),

        if (isWide)
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _phoneCtrl,
                  decoration: const InputDecoration(labelText: 'Phone Number', prefixIcon: Icon(Icons.phone)),
                  onChanged: (_) => setState(() {}),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _gstinCtrl,
                  decoration: const InputDecoration(labelText: 'GSTIN / VAT No.', prefixIcon: Icon(Icons.badge)),
                  onChanged: (_) => setState(() {}),
                ),
              ),
            ],
          )
        else ...[
          TextField(
            controller: _phoneCtrl,
            decoration: const InputDecoration(labelText: 'Phone Number', prefixIcon: Icon(Icons.phone)),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _gstinCtrl,
            decoration: const InputDecoration(labelText: 'GSTIN / VAT No.', prefixIcon: Icon(Icons.badge)),
            onChanged: (_) => setState(() {}),
          ),
        ],
        const SizedBox(height: 12),

        if (isWide)
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _emailCtrl,
                  decoration: const InputDecoration(labelText: 'Email Address', prefixIcon: Icon(Icons.email)),
                  onChanged: (_) => setState(() {}),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _websiteCtrl,
                  decoration: const InputDecoration(labelText: 'Website', prefixIcon: Icon(Icons.language)),
                  onChanged: (_) => setState(() {}),
                ),
              ),
            ],
          )
        else ...[
          TextField(
            controller: _emailCtrl,
            decoration: const InputDecoration(labelText: 'Email Address', prefixIcon: Icon(Icons.email)),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _websiteCtrl,
            decoration: const InputDecoration(labelText: 'Website', prefixIcon: Icon(Icons.language)),
            onChanged: (_) => setState(() {}),
          ),
        ],
        const SizedBox(height: 12),

        if (isWide)
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _receiptTitleCtrl,
                  decoration: const InputDecoration(labelText: 'Receipt Header Title', prefixIcon: Icon(Icons.title)),
                  onChanged: (_) => setState(() {}),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _invoicePrefixCtrl,
                  decoration: const InputDecoration(labelText: 'Invoice Number Prefix', prefixIcon: Icon(Icons.numbers)),
                  onChanged: (_) => setState(() {}),
                ),
              ),
            ],
          )
        else ...[
          TextField(
            controller: _receiptTitleCtrl,
            decoration: const InputDecoration(labelText: 'Receipt Header Title', prefixIcon: Icon(Icons.title)),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _invoicePrefixCtrl,
            decoration: const InputDecoration(labelText: 'Invoice Number Prefix', prefixIcon: Icon(Icons.numbers)),
            onChanged: (_) => setState(() {}),
          ),
        ],
      ],
    );
  }

  // ========================== TAB 2: FIELDS & QR / BARCODE ==========================

  Widget _buildFieldsTab(ThemeData theme) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Show or Hide Receipt Fields', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 4),
        Text('Toggle which elements appear on printed thermal and PDF receipts.', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        const SizedBox(height: 16),

        SwitchListTile(title: const Text('Show Store Tagline / Subtitle'), value: _showTagline, onChanged: (v) => setState(() => _showTagline = v)),
        SwitchListTile(title: const Text('Show Store Address'), value: _showAddress, onChanged: (v) => setState(() => _showAddress = v)),
        SwitchListTile(title: const Text('Show Phone Number'), value: _showPhone, onChanged: (v) => setState(() => _showPhone = v)),
        SwitchListTile(title: const Text('Show Email Address'), value: _showEmail, onChanged: (v) => setState(() => _showEmail = v)),
        SwitchListTile(title: const Text('Show Website'), value: _showWebsite, onChanged: (v) => setState(() => _showWebsite = v)),
        SwitchListTile(title: const Text('Show GSTIN / Tax Number'), value: _showGstin, onChanged: (v) => setState(() => _showGstin = v)),
        SwitchListTile(title: const Text('Show Customer Details'), value: _showCustomer, onChanged: (v) => setState(() => _showCustomer = v)),
        SwitchListTile(title: const Text('Show GST Tax Breakup'), value: _showGstBreakup, onChanged: (v) => setState(() => _showGstBreakup = v)),
        SwitchListTile(title: const Text('Show Barcode at Bottom'), value: _showBarcode, onChanged: (v) => setState(() => _showBarcode = v)),
        SwitchListTile(title: const Text('Show Payment UPI QR Code'), value: _showQrCode, onChanged: (v) => setState(() => _showQrCode = v)),
        SwitchListTile(title: const Text('Show Footer Thank You Note'), value: _showFooter, onChanged: (v) => setState(() => _showFooter = v)),
        SwitchListTile(title: const Text('Show Return / Refund Policy'), value: _showRefundPolicy, onChanged: (v) => setState(() => _showRefundPolicy = v)),
        SwitchListTile(title: const Text('Show Terms & Conditions'), value: _showTerms, onChanged: (v) => setState(() => _showTerms = v)),
        const Divider(height: 24),

        if (_showQrCode) ...[
          TextField(
            controller: _qrDataCtrl,
            decoration: const InputDecoration(labelText: 'UPI QR Code Link / VPA (e.g. upi://pay?pa=store@upi)'),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  void _showQuickEditReceiptModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 8),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade400,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.edit_note, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('Edit Bill Receipt Template', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Store Header Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.blue)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _storeNameCtrl,
                            decoration: const InputDecoration(labelText: 'Store / Business Name', prefixIcon: Icon(Icons.store)),
                            onChanged: (_) {
                              setState(() {});
                              setModalState(() {});
                            },
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _taglineCtrl,
                            decoration: const InputDecoration(labelText: 'Tagline / Category Line (e.g. Retail & Supermarket Billing)', prefixIcon: Icon(Icons.subtitles)),
                            onChanged: (_) {
                              setState(() {});
                              setModalState(() {});
                            },
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _addressCtrl,
                            decoration: const InputDecoration(labelText: 'Store Address Line', prefixIcon: Icon(Icons.location_on)),
                            onChanged: (_) {
                              setState(() {});
                              setModalState(() {});
                            },
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _phoneCtrl,
                                  decoration: const InputDecoration(labelText: 'Phone Number', prefixIcon: Icon(Icons.phone)),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: TextField(
                                  controller: _gstinCtrl,
                                  decoration: const InputDecoration(labelText: 'GSTIN Number', prefixIcon: Icon(Icons.badge)),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          const Text('Receipt Header & Column Labels', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.blue)),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _receiptTitleCtrl,
                                  decoration: const InputDecoration(labelText: 'Receipt Title (e.g. TAX INVOICE)', prefixIcon: Icon(Icons.receipt)),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: TextField(
                                  controller: _invoicePrefixCtrl,
                                  decoration: const InputDecoration(labelText: 'Invoice Prefix (e.g. INV-)', prefixIcon: Icon(Icons.numbers)),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _lblItemCtrl,
                                  decoration: const InputDecoration(labelText: 'Item Label'),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: TextField(
                                  controller: _lblQtyCtrl,
                                  decoration: const InputDecoration(labelText: 'Qty Label'),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: TextField(
                                  controller: _lblRateCtrl,
                                  decoration: const InputDecoration(labelText: 'Rate Label'),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: TextField(
                                  controller: _lblAmountCtrl,
                                  decoration: const InputDecoration(labelText: 'Amount Label'),
                                  onChanged: (_) {
                                    setState(() {});
                                    setModalState(() {});
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          const Text('Footer Note, Return Policy & Terms', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.blue)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _footerCtrl,
                            decoration: const InputDecoration(labelText: 'Footer Greeting Note', prefixIcon: Icon(Icons.favorite)),
                            onChanged: (_) {
                              setState(() {});
                              setModalState(() {});
                            },
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _refundCtrl,
                            decoration: const InputDecoration(labelText: 'Return Policy Text', prefixIcon: Icon(Icons.assignment_return)),
                            onChanged: (_) {
                              setState(() {});
                              setModalState(() {});
                            },
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _termsCtrl,
                            decoration: const InputDecoration(labelText: 'Terms & Conditions Text', prefixIcon: Icon(Icons.gavel)),
                            onChanged: (_) {
                              setState(() {});
                              setModalState(() {});
                            },
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              Expanded(
                                child: SwitchListTile(
                                  title: const Text('Show Barcode', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                  value: _showBarcode,
                                  onChanged: (val) {
                                    setState(() => _showBarcode = val);
                                    setModalState(() {});
                                  },
                                ),
                              ),
                              Expanded(
                                child: SwitchListTile(
                                  title: const Text('Show GST Breakup', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                  value: _showGstBreakup,
                                  onChanged: (val) {
                                    setState(() => _showGstBreakup = val);
                                    setModalState(() {});
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green.shade700,
                                foregroundColor: Colors.white,
                                minimumSize: const Size(0, 48),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              onPressed: () async {
                                await _saveConfig();
                                if (context.mounted) Navigator.pop(ctx);
                              },
                              icon: const Icon(Icons.save),
                              label: const Text('Save & Apply Receipt Changes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // ========================== TAB 4: LIVE PREVIEW ==========================

  Widget _buildLivePreviewTab(ThemeData theme) {
    return Container(
      color: Colors.grey.shade100,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          const Text('Live Mobile Preview Panel (Tap Receipt to Edit)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 8),
          Expanded(child: SingleChildScrollView(child: _buildReceiptCardPreview(theme))),
        ],
      ),
    );
  }

  // ========================== LIVE RECEIPT CARD PREVIEW ==========================

  Widget _buildReceiptCardPreview(ThemeData theme) {
    final double maxCardWidth = _paperSize == '58mm' ? 240 : (_paperSize == 'A4' ? 380 : 300);
    final screenWidth = MediaQuery.of(context).size.width;
    final double cardWidth = (screenWidth - 32).clamp(180.0, maxCardWidth);

    return Center(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showQuickEditReceiptModal(context),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            width: cardWidth,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.15), blurRadius: 10, offset: const Offset(0, 4)),
              ],
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Directionality(
              textDirection: _isRtl ? TextDirection.rtl : TextDirection.ltr,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Store Header
                  Text(
                    _storeNameCtrl.text.toUpperCase(),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black),
                  ),
                  if (_showTagline && _taglineCtrl.text.isNotEmpty)
                    Text(_taglineCtrl.text, textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10, color: Colors.black87)),
                  if (_showAddress && _addressCtrl.text.isNotEmpty)
                    Text(_addressCtrl.text, textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10, color: Colors.black87)),
                  if (_showPhone && _phoneCtrl.text.isNotEmpty)
                    Text('Phone: ${_phoneCtrl.text}', textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10, color: Colors.black87)),
                  if (_showGstin && _gstinCtrl.text.isNotEmpty)
                    Text('GSTIN: ${_gstinCtrl.text}', textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 10, color: Colors.black87)),
                  const SizedBox(height: 8),

                  // Title Header
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    color: Colors.grey.shade200,
                    child: Text(
                      _receiptTitleCtrl.text.toUpperCase(),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black),
                    ),
                  ),
                  const SizedBox(height: 6),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Invoice No: ${_invoicePrefixCtrl.text}20260723-0017',
                          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Text(
                        'Date: 23-07-2026 10:31',
                        style: TextStyle(fontSize: 9, color: Colors.black),
                      ),
                    ],
                  ),
                  if (_showCustomer)
                    const Text(
                      'Customer: Ramesh Kumar (+91 98765 00000)',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 9, color: Colors.black),
                    ),
                  const Text('----------------------------------------------------', maxLines: 1, overflow: TextOverflow.clip, textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: Colors.black54)),

                  // Items Table Header
                  Row(
                    children: [
                      Expanded(flex: 4, child: Text(_lblItemCtrl.text, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.black))),
                      Expanded(flex: 2, child: Text(_lblQtyCtrl.text, textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.black))),
                      Expanded(flex: 3, child: Text(_lblRateCtrl.text, textAlign: TextAlign.right, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.black))),
                      Expanded(flex: 3, child: Text(_lblAmountCtrl.text, textAlign: TextAlign.right, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Colors.black))),
                    ],
                  ),
                  const Text('----------------------------------------------------', maxLines: 1, overflow: TextOverflow.clip, textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: Colors.black54)),

                  // Sample Items matching user photo
                  _buildPreviewRow('Rice', '1', 'Rs.50.00', 'Rs.50.00'),
                  const Text('----------------------------------------------------', maxLines: 1, overflow: TextOverflow.clip, textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: Colors.black54)),

                  // Totals
                  _buildTotalPreviewRow(_lblSubtotalCtrl.text, 'Rs.50.00'),
                  if (_showGstBreakup) ...[
                    _buildTotalPreviewRow('CGST (2.5%)', 'Rs.0.00'),
                    _buildTotalPreviewRow('SGST (2.5%)', 'Rs.0.00'),
                  ],
                  const Text('----------------------------------------------------', maxLines: 1, overflow: TextOverflow.clip, textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: Colors.black54)),
                  _buildTotalPreviewRow(_lblGrandTotalCtrl.text, 'Rs.50.00', isBold: true),
                  const SizedBox(height: 6),
                  const Text('Payment Mode: Cash', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black)),
                  const SizedBox(height: 8),

                  // Barcode Graphic Placeholder matching photo
                  if (_showBarcode)
                    Center(
                      child: Column(
                        children: [
                          Container(
                            height: 35,
                            width: (cardWidth * 0.75).clamp(120.0, 180.0),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: Colors.black12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: List.generate(
                                25,
                                (i) => Container(
                                  width: (i % 3 == 0) ? 3 : 1.5,
                                  height: 30,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text('${_invoicePrefixCtrl.text}20260723-0017', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 8, color: Colors.black87)),
                        ],
                      ),
                    ),
                  const SizedBox(height: 10),

                  // Footer Note
                  if (_showFooter && _footerCtrl.text.isNotEmpty)
                    Text(_footerCtrl.text, textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 9, color: Colors.black)),

                  if (_showRefundPolicy && _refundCtrl.text.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text('Policy: ${_refundCtrl.text}', textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 8, color: Colors.black87)),
                  ],

                  if (_showTerms && _termsCtrl.text.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text('Terms: ${_termsCtrl.text}', textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 8, color: Colors.black87)),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPreviewRow(String item, String qty, String rate, String amount) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(flex: 4, child: Text(item, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 9, color: Colors.black))),
          Expanded(flex: 2, child: Text(qty, textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 9, color: Colors.black))),
          Expanded(flex: 3, child: Text(rate, textAlign: TextAlign.right, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 9, color: Colors.black))),
          Expanded(flex: 3, child: Text(amount, textAlign: TextAlign.right, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black))),
        ],
      ),
    );
  }

  Widget _buildTotalPreviewRow(String label, String val, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 9, fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: Colors.black),
          ),
        ),
        Text(val, style: TextStyle(fontSize: isBold ? 11 : 9, fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: Colors.black)),
      ],
    );
  }
}
