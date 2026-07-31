import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/db_provider.dart';
import '../providers/auth_provider.dart';

class ReceiptCustomizerDialog extends StatefulWidget {
  const ReceiptCustomizerDialog({super.key});

  static void show(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const ReceiptCustomizerDialog(),
    );
  }

  @override
  State<ReceiptCustomizerDialog> createState() => _ReceiptCustomizerDialogState();
}

class _ReceiptCustomizerDialogState extends State<ReceiptCustomizerDialog> {
  late TextEditingController _storeNameCtrl;
  late TextEditingController _taglineCtrl;
  late TextEditingController _addressCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _gstinCtrl;
  late TextEditingController _footerCtrl;

  String _selectedLang = 'en';
  String _paperSize = '80mm';
  bool _showGstBreakup = true;
  bool _showBarcode = true;

  @override
  void initState() {
    super.initState();
    final db = Provider.of<DbProvider>(context, listen: false);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final cfg = db.receiptConfig;

    final initialStoreName = (cfg['storeName']?.toString().isNotEmpty == true)
        ? cfg['storeName'].toString()
        : (auth.currentUser?.businessName ?? 'Girani Retail & Supermarket');

    _storeNameCtrl = TextEditingController(text: initialStoreName);
    _taglineCtrl = TextEditingController(text: cfg['tagline']?.toString() ?? 'Retail & Supermarket Billing');
    _addressCtrl = TextEditingController(text: cfg['address']?.toString() ?? 'Main Road, City Branch');
    _phoneCtrl = TextEditingController(text: cfg['phone']?.toString() ?? '+91 98765 43210');
    _gstinCtrl = TextEditingController(text: cfg['gstin']?.toString() ?? '29ABCDE1234F1Z5');
    _footerCtrl = TextEditingController(text: cfg['footerNote']?.toString() ?? 'Thank you for shopping with us! Visit again.');

    _selectedLang = cfg['language']?.toString() ?? 'en';
    _paperSize = cfg['paperSize']?.toString() ?? '80mm';
    _showGstBreakup = cfg['showGstBreakup'] == true;
    _showBarcode = cfg['showBarcode'] != false;
  }

  @override
  void dispose() {
    _storeNameCtrl.dispose();
    _taglineCtrl.dispose();
    _addressCtrl.dispose();
    _phoneCtrl.dispose();
    _gstinCtrl.dispose();
    _footerCtrl.dispose();
    super.dispose();
  }

  void _applyKannadaPreset() {
    setState(() {
      _selectedLang = 'kn';
      _storeNameCtrl.text = 'ಗಿರಣಿ ಸೂಪರ್ ಮಾರ್ಕೆಟ್';
      _taglineCtrl.text = 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ದಿನಸಿ & ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರ';
      _footerCtrl.text = 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಭೇಟಿಗೆ ಧನ್ಯವಾದಗಳು, ಮತ್ತೆ ಬನ್ನಿ!';
    });
  }

  void _applyEnglishPreset() {
    setState(() {
      _selectedLang = 'en';
      _storeNameCtrl.text = 'Girani Supermarket';
      _taglineCtrl.text = 'Quality Groceries & Retail Store';
      _footerCtrl.text = 'Thank you for shopping with us! Visit again.';
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final db = Provider.of<DbProvider>(context, listen: false);
    final media = MediaQuery.of(context);
    final screenWidth = media.size.width;
    final screenHeight = media.size.height;
    final isCompact = screenWidth < 450;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 500,
          maxHeight: screenHeight * 0.85,
        ),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header Title Row
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.receipt_long, color: theme.colorScheme.primary, size: 22),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Receipt & Bill Designer', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        Text('Customize language, store name, header & footer', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const Divider(height: 20),

              // Scrollable Body
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Preset Language Bar
                      const Text('Quick Language Preset / ಕನ್ನಡ ಬೆಂಬಲ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      const SizedBox(height: 6),
                      Flex(
                        direction: isCompact ? Axis.vertical : Axis.horizontal,
                        children: [
                          Expanded(
                            flex: isCompact ? 0 : 1,
                            child: OutlinedButton.icon(
                              onPressed: _applyKannadaPreset,
                              icon: const Text('🌿', style: TextStyle(fontSize: 14)),
                              label: const Text('Kannada (ಕನ್ನಡ)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            ),
                          ),
                          SizedBox(width: isCompact ? 0 : 8, height: isCompact ? 8 : 0),
                          Expanded(
                            flex: isCompact ? 0 : 1,
                            child: OutlinedButton.icon(
                              onPressed: _applyEnglishPreset,
                              icon: const Text('⚡', style: TextStyle(fontSize: 14)),
                              label: const Text('English (Default)', style: TextStyle(fontSize: 12)),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Language Selector
                      DropdownButtonFormField<String>(
                        value: _selectedLang,
                        decoration: const InputDecoration(
                          labelText: 'Receipt Primary Language',
                          prefixIcon: Icon(Icons.translate, size: 20),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'kn', child: Text('ಕನ್ನಡ (Kannada)')),
                          DropdownMenuItem(value: 'en', child: Text('English (Default)')),
                          DropdownMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
                          DropdownMenuItem(value: 'te', child: Text('ತೆಲುಗು (Telugu)')),
                          DropdownMenuItem(value: 'ta', child: Text('தமிழ் (Tamil)')),
                        ],
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedLang = val);
                        },
                      ),
                      const SizedBox(height: 12),

                      // Store Name Field (Supports Kannada & Multi-language input)
                      TextField(
                        controller: _storeNameCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Store / Business Header Name',
                          hintText: 'e.g. Girani Supermarket / ಗಿರಣಿ ಸೂಪರ್ ಮಾರ್ಕೆಟ್',
                          prefixIcon: Icon(Icons.storefront, size: 20),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Tagline / Subtitle
                      TextField(
                        controller: _taglineCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Tagline / Category Description',
                          hintText: 'e.g. Quality Groceries & Retail Store',
                          prefixIcon: Icon(Icons.description, size: 20),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Address & Mobile
                      if (isCompact) ...[
                        TextField(
                          controller: _addressCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Store Address',
                            prefixIcon: Icon(Icons.location_on, size: 18),
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _phoneCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Contact Phone',
                            prefixIcon: Icon(Icons.phone, size: 18),
                          ),
                        ),
                      ] else ...[
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _addressCtrl,
                                decoration: const InputDecoration(
                                  labelText: 'Store Address',
                                  prefixIcon: Icon(Icons.location_on, size: 18),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextField(
                                controller: _phoneCtrl,
                                decoration: const InputDecoration(
                                  labelText: 'Contact Phone',
                                  prefixIcon: Icon(Icons.phone, size: 18),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 12),

                      // GSTIN & Paper Size
                      if (isCompact) ...[
                        TextField(
                          controller: _gstinCtrl,
                          decoration: const InputDecoration(
                            labelText: 'GSTIN / Tax No.',
                            prefixIcon: Icon(Icons.confirmation_number, size: 18),
                          ),
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          value: _paperSize,
                          decoration: const InputDecoration(
                            labelText: 'Paper Size',
                            prefixIcon: Icon(Icons.print, size: 18),
                          ),
                          items: const [
                            DropdownMenuItem(value: '80mm', child: Text('80mm Thermal')),
                            DropdownMenuItem(value: '58mm', child: Text('58mm Small Thermal')),
                            DropdownMenuItem(value: 'A4', child: Text('A4 Standard Sheet')),
                          ],
                          onChanged: (val) {
                            if (val != null) setState(() => _paperSize = val);
                          },
                        ),
                      ] else ...[
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _gstinCtrl,
                                decoration: const InputDecoration(
                                  labelText: 'GSTIN / Tax No.',
                                  prefixIcon: Icon(Icons.confirmation_number, size: 18),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _paperSize,
                                decoration: const InputDecoration(
                                  labelText: 'Paper Size',
                                  prefixIcon: Icon(Icons.print, size: 18),
                                ),
                                items: const [
                                  DropdownMenuItem(value: '80mm', child: Text('80mm Thermal')),
                                  DropdownMenuItem(value: '58mm', child: Text('58mm Small Thermal')),
                                  DropdownMenuItem(value: 'A4', child: Text('A4 Standard Sheet')),
                                ],
                                onChanged: (val) {
                                  if (val != null) setState(() => _paperSize = val);
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 12),

                      // Footer Message / Terms
                      TextField(
                        controller: _footerCtrl,
                        maxLines: 2,
                        decoration: const InputDecoration(
                          labelText: 'Receipt Footer Thank You Message / Terms',
                          hintText: 'e.g. ಧನ್ಯವಾದಗಳು! ಮತ್ತೆ ಬನ್ನಿ! / Thank you!',
                          prefixIcon: Icon(Icons.rate_review, size: 20),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Options Switches
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Show GST / Tax Breakup on Bill', style: TextStyle(fontSize: 13)),
                        value: _showGstBreakup,
                        onChanged: (v) => setState(() => _showGstBreakup = v),
                      ),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Print Barcode on Bill Bottom', style: TextStyle(fontSize: 13)),
                        value: _showBarcode,
                        onChanged: (v) => setState(() => _showBarcode = v),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Action Buttons Row
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () async {
                      await db.updateReceiptConfig({
                        'storeName': _storeNameCtrl.text.trim(),
                        'language': _selectedLang,
                        'tagline': _taglineCtrl.text.trim(),
                        'address': _addressCtrl.text.trim(),
                        'phone': _phoneCtrl.text.trim(),
                        'gstin': _gstinCtrl.text.trim(),
                        'footerNote': _footerCtrl.text.trim(),
                        'paperSize': _paperSize,
                        'showGstBreakup': _showGstBreakup,
                        'showBarcode': _showBarcode,
                      });
                      if (context.mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('✓ Receipt bill layout & language saved successfully!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                    },
                    icon: const Icon(Icons.check, size: 18),
                    label: const Text('Save Receipt Design'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
