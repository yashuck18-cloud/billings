import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../core/theme.dart';

class QuantitySelectorDialog extends StatefulWidget {
  final Product product;
  final double initialQuantity;
  final double? customPrice;

  const QuantitySelectorDialog({
    super.key,
    required this.product,
    required this.initialQuantity,
    this.customPrice,
  });

  @override
  State<QuantitySelectorDialog> createState() => _QuantitySelectorDialogState();
}

class _QuantitySelectorDialogState extends State<QuantitySelectorDialog> {
  late String _qtyBuffer;

  double get unitPrice => widget.customPrice ?? widget.product.defaultSellingPrice;

  @override
  void initState() {
    super.initState();
    _initBuffer();
  }

  void _initBuffer() {
    _setQuantityValue(widget.initialQuantity);
  }

  double get totalQuantity => double.tryParse(_qtyBuffer) ?? 0.0;

  bool _isPopping = false;
  void _popDialog([double? result]) {
    if (_isPopping || !mounted) return;
    _isPopping = true;
    Navigator.pop(context, result);
  }

  void _onKeyPress(String key) {
    setState(() {
      String candidate = _qtyBuffer;

      if (key == 'backspace') {
        if (_qtyBuffer.length > 1) {
          candidate = _qtyBuffer.substring(0, _qtyBuffer.length - 1);
          if (candidate == '-') candidate = '0';
        } else {
          candidate = '0';
        }
      } else if (key == 'clear') {
        candidate = '0';
      } else if (key == '.') {
        if (!_qtyBuffer.contains('.')) {
          candidate = '$_qtyBuffer.';
        }
      } else if (key == '+250g') {
        final unitLower = widget.product.unit.toLowerCase();
        final isLiter = unitLower == 'liter' || unitLower == 'ltr' || unitLower == 'l' || unitLower == 'ml';
        _addValue(isLiter ? 0.1 : 0.25);
        return;
      } else if (key == '+1kg') {
        _addValue(1.0);
        return;
      } else {
        // Number keys '0'-'9' and '00'
        if (_qtyBuffer == '0') {
          if (key != '0' && key != '00') {
            candidate = key;
          }
        } else {
          if (_qtyBuffer.contains('.')) {
            final parts = _qtyBuffer.split('.');
            if (parts[1].length < 3) {
              if (key == '00') {
                if (parts[1].isEmpty) {
                  candidate = '${_qtyBuffer}00';
                } else if (parts[1].length == 1) {
                  candidate = '${_qtyBuffer}0';
                }
              } else {
                candidate = '$_qtyBuffer$key';
              }
            }
          } else {
            if (key == '00' && _qtyBuffer.length > 6) return;
            if (_qtyBuffer.length < 7) {
              candidate = '$_qtyBuffer$key';
            }
          }
        }
      }

      // Stock limit validation: Reject keypresses that would exceed available stock
      if (widget.product.quantity > 0) {
        final String parseTarget = candidate.endsWith('.') ? candidate.substring(0, candidate.length - 1) : candidate;
        final double? candVal = double.tryParse(parseTarget);
        if (candVal != null && candVal > widget.product.quantity) {
          return;
        }
      }

      _qtyBuffer = candidate;
    });
  }

  void _addValue(double val) {
    double current = double.tryParse(_qtyBuffer) ?? 0.0;
    double updated = double.parse((current + val).toStringAsFixed(3));
    if (widget.product.quantity > 0 && updated > widget.product.quantity) {
      updated = widget.product.quantity;
    }
    _setQuantityValue(updated);
  }

  void _applyPreset(double qty) {
    setState(() {
      double target = qty;
      if (widget.product.quantity > 0 && target > widget.product.quantity) {
        target = widget.product.quantity;
      }
      _setQuantityValue(target);
    });
  }

  void _setQuantityValue(double qty) {
    if (qty == qty.toInt()) {
      _qtyBuffer = qty.toInt().toString();
    } else {
      String formatted = qty.toStringAsFixed(3);
      while (formatted.endsWith('0')) {
        formatted = formatted.substring(0, formatted.length - 1);
      }
      if (formatted.endsWith('.')) {
        formatted = formatted.substring(0, formatted.length - 1);
      }
      _qtyBuffer = formatted;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final totalAmount = totalQuantity * unitPrice;

    final isWeightBased = widget.product.unit.toLowerCase() == 'kg' ||
        widget.product.unit.toLowerCase() == 'liter' ||
        widget.product.unit.toLowerCase() == 'gram';

    final screenWidth = MediaQuery.of(context).size.width;
    return Dialog(
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        width: screenWidth > 460 ? 420 : screenWidth * 0.94,
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 20,
              offset: const Offset(0, 10),
            )
          ]
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title Header
            Row(
              children: [
                Icon(Icons.edit_note_rounded, color: theme.colorScheme.primary, size: 26),
                const SizedBox(width: 8),
                Text(
                  'Edit Quantity',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Slate.shade900,
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 1.5,
                  height: 16,
                  color: isDark ? Slate.shade700 : Slate.shade300,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.product.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                // Close button
                Material(
                  color: isDark ? Slate.shade800 : Slate.shade100,
                  shape: const CircleBorder(),
                  child: IconButton(
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(6),
                    icon: const Icon(Icons.close, size: 18),
                    onPressed: () => _popDialog(),
                  ),
                )
              ],
            ),
            const SizedBox(height: 12),

            // Metadata Row (Stock and Unit Price)
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isDark ? Slate.shade800 : Colors.grey.shade100),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(Icons.inventory_2_outlined, color: theme.colorScheme.primary, size: 14),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Available Stock',
                                style: TextStyle(fontSize: 10, color: isDark ? Slate.shade400 : Slate.shade500),
                              ),
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  '${widget.product.quantity.toStringAsFixed(1)} ${widget.product.unit}',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.successColor, fontSize: 13),
                                ),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isDark ? Slate.shade800 : Colors.grey.shade100),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.local_offer_outlined, color: Colors.blue, size: 14),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Unit Price',
                                style: TextStyle(fontSize: 10, color: isDark ? Slate.shade400 : Slate.shade500),
                              ),
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  '₹${unitPrice.toStringAsFixed(1)} /${widget.product.unit}',
                                  style: TextStyle(fontWeight: FontWeight.bold, color: isDark ? Colors.white : Slate.shade900, fontSize: 13),
                                ),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                )
              ],
            ),
            const SizedBox(height: 10),

            // Unified Quantity Display (Single Screen)
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: theme.colorScheme.primary.withOpacity(0.2),
                    width: 1.5,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      _qtyBuffer,
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      widget.product.unit,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Slate.shade400 : Slate.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Preset Buttons Row
            Center(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: _getPresetsList().map((preset) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 3.0),
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          minimumSize: const Size(0, 34),
                          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () => _applyPreset(preset.value),
                        child: Text(preset.label, style: const TextStyle(fontSize: 11)),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Keyboard Grid
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 3x4 Number pad
                Expanded(
                  flex: 3,
                  child: Column(
                    children: [
                      Row(
                        children: [
                          _buildNumKey('7'),
                          const SizedBox(width: 6),
                          _buildNumKey('8'),
                          const SizedBox(width: 6),
                          _buildNumKey('9'),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          _buildNumKey('4'),
                          const SizedBox(width: 6),
                          _buildNumKey('5'),
                          const SizedBox(width: 6),
                          _buildNumKey('6'),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          _buildNumKey('1'),
                          const SizedBox(width: 6),
                          _buildNumKey('2'),
                          const SizedBox(width: 6),
                          _buildNumKey('3'),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          _buildNumKey('0'),
                          const SizedBox(width: 6),
                          _buildNumKey('00'),
                          const SizedBox(width: 6),
                          _buildNumKey('.'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                // Right side control keys (Backspace, Clear, presets)
                Expanded(
                  flex: 1,
                  child: Column(
                    children: [
                      _buildControlKey(
                        child: const Icon(Icons.backspace_outlined, size: 16, color: Colors.red),
                        color: Colors.red.withOpacity(0.08),
                        onPressed: () => _onKeyPress('backspace'),
                      ),
                      const SizedBox(height: 6),
                      _buildControlKey(
                        child: const Text('C', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.red)),
                        color: Colors.red.withOpacity(0.08),
                        onPressed: () => _onKeyPress('clear'),
                      ),
                      const SizedBox(height: 6),
                      _buildControlKey(
                        child: Text(isWeightBased ? (widget.product.unit.toLowerCase() == 'liter' ? '+100ml' : '+250g') : '+5', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: theme.colorScheme.primary)),
                        color: theme.colorScheme.primary.withOpacity(0.08),
                        onPressed: () {
                          if (isWeightBased) {
                            _onKeyPress('+250g');
                          } else {
                            _addValue(5.0);
                          }
                        },
                      ),
                      const SizedBox(height: 6),
                      _buildControlKey(
                        child: Text(isWeightBased ? '+1 ${widget.product.unit}' : '+10', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: theme.colorScheme.primary)),
                        color: theme.colorScheme.primary.withOpacity(0.08),
                        onPressed: () {
                          if (isWeightBased) {
                            _onKeyPress('+1kg');
                          } else {
                            _addValue(10.0);
                          }
                        },
                      ),
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 12),

            // Bottom summary row
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: isDark ? Slate.shade800 : Colors.grey.shade100),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppTheme.successColor.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.calculate_outlined, color: AppTheme.successColor, size: 16),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Amount (₹)', style: TextStyle(fontSize: 9, color: isDark ? Slate.shade400 : Slate.shade500)),
                          Text(
                            '₹${totalAmount.toStringAsFixed(2)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.successColor, fontSize: 16),
                          )
                        ],
                      )
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '₹${unitPrice.toStringAsFixed(1)} × ${totalQuantity.toStringAsFixed(3)} ${widget.product.unit}',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Final Actions
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(0, 40),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () => _popDialog(),
                    child: const Text('Cancel', style: TextStyle(fontSize: 14)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(0, 40),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () => _popDialog(totalQuantity),
                    icon: const Icon(Icons.check_circle_outline, size: 16),
                    label: const Text('Apply', style: TextStyle(fontSize: 14)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

  Widget _buildNumKey(String key) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    return Expanded(
      child: Material(
        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: () => _onKeyPress(key),
          child: Container(
            height: 40,
            alignment: Alignment.center,
            child: Text(
              key,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: isDark ? Colors.white : Slate.shade800,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildControlKey({
    required Widget child,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Material(
      color: color,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onPressed,
        child: Container(
          height: 40,
          alignment: Alignment.center,
          child: child,
        ),
      ),
    );
  }

  List<_PresetItem> _getPresetsList() {
    final isKgOrLiter = widget.product.unit.toLowerCase() == 'kg' ||
        widget.product.unit.toLowerCase() == 'liter';

    if (isKgOrLiter) {
      final isLiter = widget.product.unit.toLowerCase() == 'liter';
      if (isLiter) {
        return [
          _PresetItem(label: '50 ml', value: 0.05),
          _PresetItem(label: '100 ml', value: 0.1),
          _PresetItem(label: '250 ml', value: 0.25),
          _PresetItem(label: '500 ml', value: 0.5),
          _PresetItem(label: '750 ml', value: 0.75),
          _PresetItem(label: '1 L', value: 1.0),
          _PresetItem(label: '2 L', value: 2.0),
          _PresetItem(label: '5 L', value: 5.0),
        ];
      } else {
        return [
          _PresetItem(label: '50 g', value: 0.05),
          _PresetItem(label: '100 g', value: 0.1),
          _PresetItem(label: '250 g', value: 0.25),
          _PresetItem(label: '500 g', value: 0.5),
          _PresetItem(label: '750 g', value: 0.75),
          _PresetItem(label: '1 Kg', value: 1.0),
          _PresetItem(label: '2 Kg', value: 2.0),
          _PresetItem(label: '5 Kg', value: 5.0),
        ];
      }
    } else {
      return [
        _PresetItem(label: '1', value: 1.0),
        _PresetItem(label: '5', value: 5.0),
        _PresetItem(label: '10', value: 10.0),
        _PresetItem(label: '12', value: 12.0),
        _PresetItem(label: '24', value: 24.0),
      ];
    }
  }
}

class _PresetItem {
  final String label;
  final double value;
  _PresetItem({required this.label, required this.value});
}
