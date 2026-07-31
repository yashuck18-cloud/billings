import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../core/flutter_beep.dart';
import '../../providers/db_provider.dart';

class BarcodeScannerDialog extends StatefulWidget {
  final bool continuous;
  final String? Function(String)? onScan;
  final Function(String barcode)? onAddNewProduct;

  const BarcodeScannerDialog({
    super.key,
    this.continuous = false,
    this.onScan,
    this.onAddNewProduct,
  });

  @override
  State<BarcodeScannerDialog> createState() => _BarcodeScannerDialogState();
}

class _BarcodeScannerDialogState extends State<BarcodeScannerDialog> with SingleTickerProviderStateMixin {
  late final MobileScannerController _controller;
  late final AnimationController _animController;
  late final Animation<double> _laserAnimation;
  final _manualInputController = TextEditingController();
  bool _isTorchOn = false;
  bool _isFrontCamera = false;
  bool _hasScanned = false;

  // Real-time scan feedback banner inside dialog
  String? _statusMessage;
  bool _isErrorStatus = false;
  String? _lastNotFoundBarcode;
  Timer? _statusTimer;

  // Cooldown track for continuous scanning
  String? _lastScannedCode;
  String? _lastScannedNormCode;
  DateTime? _lastScannedTime;

  @override
  void initState() {
    super.initState();
    _controller = MobileScannerController(
      detectionSpeed: DetectionSpeed.noDuplicates,
      cameraResolution: const Size(1920, 1080),
      formats: [
        BarcodeFormat.qrCode,
        BarcodeFormat.code128,
        BarcodeFormat.code39,
        BarcodeFormat.code93,
        BarcodeFormat.ean13,
        BarcodeFormat.ean8,
        BarcodeFormat.upcA,
        BarcodeFormat.upcE,
        BarcodeFormat.itf,
        BarcodeFormat.codabar,
        BarcodeFormat.dataMatrix,
        BarcodeFormat.pdf417,
      ],
    );
    _animController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    _laserAnimation = Tween<double>(begin: 0.1, end: 0.9).animate(_animController);
  }

  @override
  void dispose() {
    _statusTimer?.cancel();
    _controller.dispose();
    _animController.dispose();
    _manualInputController.dispose();
    super.dispose();
  }

  void _showScanFeedback(String message, {bool isError = false, String? notFoundBarcode}) {
    _statusTimer?.cancel();
    setState(() {
      _statusMessage = message;
      _isErrorStatus = isError;
      _lastNotFoundBarcode = notFoundBarcode;
    });

    _statusTimer = Timer(const Duration(milliseconds: 4000), () {
      if (mounted) {
        setState(() {
          _statusMessage = null;
          _lastNotFoundBarcode = null;
        });
      }
    });
  }

  bool _lastIsNotFound = false;

  void _processCode(String code) {
    final resultMsg = widget.onScan?.call(code);
    final bool isNotFound = resultMsg == null ||
        resultMsg.toLowerCase().contains('product not found') ||
        resultMsg.toLowerCase().contains('no product') ||
        resultMsg.toLowerCase().contains('not found');

    _lastIsNotFound = isNotFound;

    if (isNotFound) {
      // Requirement: Play error sound & show "Product not found." & allow adding product
      FlutterBeep.playError();
      _showScanFeedback('Product not found.', isError: true, notFoundBarcode: code);
    } else {
      // Requirement: Play success sound & add product / increase quantity
      FlutterBeep.playSuccess();
      _showScanFeedback(resultMsg, isError: false);
    }
  }

  void _onBarcodeDetected(BarcodeCapture capture) {
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isNotEmpty) {
      final barcodeObj = barcodes.first;
      final rawVal = barcodeObj.rawValue;
      final displayVal = barcodeObj.displayValue;

      String code = '';
      if (displayVal != null && displayVal.trim().isNotEmpty) {
        code = DbProvider.cleanControlChars(displayVal);
      }
      if (code.isEmpty && rawVal != null && rawVal.trim().isNotEmpty) {
        code = DbProvider.cleanControlChars(rawVal);
      }
      if (code.isEmpty) return;

      final normCode = DbProvider.normalizeBarcodeKey(code);
      if (normCode.isEmpty) return;

      final now = DateTime.now();
      if (widget.continuous) {
        // Cooldown: Ignore scan if it's the same barcode or normalized key scanned within cooldown duration
        final cooldownMs = _lastIsNotFound ? 3500 : 1800;
        final isSame = (code == _lastScannedCode || normCode == _lastScannedNormCode);
        if (isSame &&
            _lastScannedTime != null &&
            now.difference(_lastScannedTime!) < Duration(milliseconds: cooldownMs)) {
          return;
        }
        _lastScannedCode = code;
        _lastScannedNormCode = normCode;
        _lastScannedTime = now;

        _processCode(code);
      } else {
        if (_hasScanned) return;
        _hasScanned = true;

        FlutterBeep.playSuccess();
        Navigator.pop(context, code);
      }
    }
  }

  void _submitManualCode() {
    final code = _manualInputController.text.trim();
    if (code.isNotEmpty) {
      if (widget.continuous) {
        _manualInputController.clear();
        _processCode(code);
      } else {
        FlutterBeep.playSuccess();
        Navigator.pop(context, code);
      }
    }
  }

  void _triggerAddProduct(String barcode) {
    if (widget.onAddNewProduct != null) {
      widget.onAddNewProduct!(barcode);
    } else {
      // Close this dialog and return the barcode — caller navigates to add product
      Navigator.pop(context, '__ADD_PRODUCT__:$barcode');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final screenWidth = MediaQuery.of(context).size.width;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
      child: Container(
        width: screenWidth > 440 ? 380 : screenWidth * 0.9,
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Title Header
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.qr_code_scanner_rounded,
                          color: theme.colorScheme.primary,
                          size: 24,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Scan Barcode',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 20),
                      onPressed: () => Navigator.pop(context),
                      style: IconButton.styleFrom(
                        padding: const EdgeInsets.all(6),
                        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.grey.shade100,
                      ),
                    ),
                  ],
                ),
              ),

              // Compact Camera Viewport (Height 180)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: SizedBox(
                  height: 180,
                  child: Stack(
                    children: [
                      // Bounded Preview Box
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          color: Colors.black,
                          child: MobileScanner(
                            controller: _controller,
                            onDetect: _onBarcodeDetected,
                          ),
                        ),
                      ),

                      // Camera Overlay Border
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: Colors.black.withOpacity(0.35),
                              width: 12,
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),

                      // Target Box Corner markers
                      Positioned.fill(
                        child: LayoutBuilder(
                          builder: (context, constraints) {
                            const double padding = 20.0;
                            const double size = 24.0;
                            const double thickness = 3.0;
                            final Color color = theme.colorScheme.primary;

                            return Stack(
                              children: [
                                // Top Left
                                Positioned(
                                  top: padding,
                                  left: padding,
                                  child: Container(width: size, height: thickness, color: color),
                                ),
                                Positioned(
                                  top: padding,
                                  left: padding,
                                  child: Container(width: thickness, height: size, color: color),
                                ),

                                // Top Right
                                Positioned(
                                  top: padding,
                                  right: padding,
                                  child: Container(width: size, height: thickness, color: color),
                                ),
                                Positioned(
                                  top: padding,
                                  right: padding,
                                  child: Container(width: thickness, height: size, color: color),
                                ),

                                // Bottom Left
                                Positioned(
                                  bottom: padding,
                                  left: padding,
                                  child: Container(width: size, height: thickness, color: color),
                                ),
                                Positioned(
                                  bottom: padding,
                                  left: padding,
                                  child: Container(width: thickness, height: size, color: color),
                                ),

                                // Bottom Right
                                Positioned(
                                  bottom: padding,
                                  right: padding,
                                  child: Container(width: size, height: thickness, color: color),
                                ),
                                Positioned(
                                  bottom: padding,
                                  right: padding,
                                  child: Container(width: thickness, height: size, color: color),
                                ),

                                // Pulsing Laser Line
                                AnimatedBuilder(
                                  animation: _laserAnimation,
                                  builder: (context, child) {
                                    final double topPos = padding +
                                        _laserAnimation.value *
                                            (constraints.maxHeight - padding * 2 - thickness);
                                    return Positioned(
                                      top: topPos,
                                      left: padding + 6,
                                      right: padding + 6,
                                      child: Container(
                                        height: 2,
                                        decoration: BoxDecoration(
                                          color: color,
                                          boxShadow: [
                                            BoxShadow(
                                              color: color,
                                              blurRadius: 6,
                                              spreadRadius: 1,
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ],
                            );
                          },
                        ),
                      ),

                      // Camera Controls Overlay (Torch, Camera Switch)
                      Positioned(
                        bottom: 12,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              radius: 18,
                              backgroundColor: Colors.black.withOpacity(0.6),
                              child: IconButton(
                                iconSize: 18,
                                padding: EdgeInsets.zero,
                                icon: Icon(
                                  _isTorchOn ? Icons.flash_on_rounded : Icons.flash_off_rounded,
                                  color: Colors.white,
                                ),
                                onPressed: () {
                                  _controller.toggleTorch();
                                  setState(() {
                                    _isTorchOn = !_isTorchOn;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 14),
                            CircleAvatar(
                              radius: 18,
                              backgroundColor: Colors.black.withOpacity(0.6),
                              child: IconButton(
                                iconSize: 18,
                                padding: EdgeInsets.zero,
                                icon: Icon(
                                  _isFrontCamera ? Icons.camera_front_rounded : Icons.camera_rear_rounded,
                                  color: Colors.white,
                                ),
                                onPressed: () {
                                  _controller.switchCamera();
                                  setState(() {
                                    _isFrontCamera = !_isFrontCamera;
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // In-Dialog Real-Time Status Toast & Add New Product Action
              if (_statusMessage != null)
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: _isErrorStatus
                          ? Colors.red.withOpacity(0.12)
                          : Colors.green.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: _isErrorStatus
                            ? Colors.red.withOpacity(0.4)
                            : Colors.green.withOpacity(0.4),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              _isErrorStatus ? Icons.error_outline_rounded : Icons.check_circle_rounded,
                              color: _isErrorStatus ? Colors.red.shade700 : Colors.green.shade700,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _statusMessage!,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: _isErrorStatus ? Colors.red.shade900 : Colors.green.shade900,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        if (_isErrorStatus && _lastNotFoundBarcode != null) ...[
                          const SizedBox(height: 8),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () => _triggerAddProduct(_lastNotFoundBarcode!),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red.shade700,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              icon: const Icon(Icons.add, size: 16),
                              label: Text(
                                'Add Product (${_lastNotFoundBarcode!})',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

              // Manual Input Section
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      "Can't scan? Enter barcode manually:",
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                        fontSize: 11,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: SizedBox(
                            height: 42,
                            child: TextFormField(
                              controller: _manualInputController,
                              decoration: InputDecoration(
                                hintText: 'Type Barcode...',
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14),
                                filled: true,
                                fillColor: isDark ? const Color(0xFF1E293B) : Colors.grey.shade100,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                              style: const TextStyle(fontSize: 13),
                              onFieldSubmitted: (_) => _submitManualCode(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          height: 42,
                          child: ElevatedButton(
                            onPressed: _submitManualCode,
                            style: ElevatedButton.styleFrom(
                              minimumSize: const Size(42, 42),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                            ),
                            child: const Icon(Icons.add_rounded, size: 20),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
