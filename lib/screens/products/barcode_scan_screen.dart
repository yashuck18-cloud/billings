import 'package:flutter/material.dart';
import '../billing/barcode_scanner_dialog.dart';

/// A full-screen wrapper around BarcodeScannerDialog.
/// Push this screen via Navigator.push — the result is the scanned barcode string.
/// By keeping this in its own file, mobile_scanner is NOT eagerly initialized
/// when AddEditProductScreen loads.
class BarcodeScanScreen extends StatefulWidget {
  const BarcodeScanScreen({super.key});

  @override
  State<BarcodeScanScreen> createState() => _BarcodeScanScreenState();
}

class _BarcodeScanScreenState extends State<BarcodeScanScreen> {
  bool _hasResult = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan Barcode'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: BarcodeScannerDialog(
        continuous: false,
        onScan: (code) {
          if (!_hasResult && mounted) {
            _hasResult = true;
            Navigator.pop(context, code);
          }
          return code;
        },
      ),
    );
  }
}
