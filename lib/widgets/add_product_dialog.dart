import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/db_provider.dart';
import '../core/constants.dart';
import '../core/flutter_beep.dart';

class AddProductDialog extends StatefulWidget {
  final Product? product;
  final String? initialBarcode;
  final Function(Product)? onProductCreated;

  const AddProductDialog({
    super.key,
    this.product,
    this.initialBarcode,
    this.onProductCreated,
  });

  static Future<Product?> show(
    BuildContext context, {
    Product? product,
    String? initialBarcode,
    Function(Product)? onProductCreated,
  }) {
    return showDialog<Product>(
      context: context,
      builder: (context) => AddProductDialog(
        product: product,
        initialBarcode: initialBarcode,
        onProductCreated: onProductCreated,
      ),
    );
  }

  @override
  State<AddProductDialog> createState() => _AddProductDialogState();
}

class _AddProductDialogState extends State<AddProductDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _priceController;
  late final TextEditingController _purchasePriceController;
  late final TextEditingController _lowStockController;
  late final TextEditingController _initialStockController;
  late final TextEditingController _barcodeController;

  late String _selectedCatId;
  late String _selectedUnit;
  late List<String> _availableUnits;

  @override
  void initState() {
    super.initState();
    final p = widget.product;
    _nameController = TextEditingController(text: p?.name ?? '');
    _priceController = TextEditingController(
      text: p != null ? p.defaultSellingPrice.toString() : '',
    );
    _purchasePriceController = TextEditingController(
      text: p != null ? p.purchasePrice.toString() : '',
    );
    _lowStockController = TextEditingController(
      text: p != null ? p.lowStockAlert.toString() : '5.0',
    );
    _initialStockController = TextEditingController(text: '10.0');
    _barcodeController = TextEditingController(
      text: p?.barcode ?? widget.initialBarcode ?? '',
    );

    final db = Provider.of<DbProvider>(context, listen: false);
    _selectedCatId =
        p?.categoryId ??
        (db.categories.isNotEmpty ? db.categories.first.id : '');
    _selectedUnit = p?.unit ?? AppConstants.units.first;
    _availableUnits = [...AppConstants.units];
    final defaultPresets = [
      'Piece',
      'Kg',
      'Litre',
      'Box',
      'Pack',
      'Bag',
      'Tin',
      'Roll',
      'Bottle',
    ];
    for (var u in defaultPresets) {
      if (!_availableUnits.contains(u)) _availableUnits.add(u);
    }
    if (p != null && !_availableUnits.contains(p.unit)) {
      _availableUnits.add(p.unit);
    }
    _availableUnits = _availableUnits.toSet().toList();
    if (!_availableUnits.contains(_selectedUnit) &&
        _availableUnits.isNotEmpty) {
      _selectedUnit = _availableUnits.first;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _purchasePriceController.dispose();
    _lowStockController.dispose();
    _initialStockController.dispose();
    _barcodeController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final db = Provider.of<DbProvider>(context, listen: false);
      final isEdit = widget.product != null;

      final double sellingPrice = double.parse(_priceController.text.trim());
      final double purchasePrice =
          _purchasePriceController.text.trim().isNotEmpty
          ? double.parse(_purchasePriceController.text.trim())
          : (sellingPrice * 0.75);
      final double lowStock = double.parse(_lowStockController.text.trim());
      final double initialStock =
          double.tryParse(_initialStockController.text.trim()) ?? 0.0;
      final String? barcode = _barcodeController.text.trim().isEmpty
          ? null
          : _barcodeController.text.trim();

      Product savedProduct;
      if (isEdit) {
        savedProduct = widget.product!.copyWith(
          name: _nameController.text.trim(),
          categoryId: _selectedCatId,
          unit: _selectedUnit,
          defaultSellingPrice: sellingPrice,
          purchasePrice: purchasePrice,
          lowStockAlert: lowStock,
          barcode: barcode,
        );
        db.editProduct(savedProduct);
      } else {
        savedProduct = Product(
          id: 'prod_${DateTime.now().millisecondsSinceEpoch}',
          name: _nameController.text.trim(),
          categoryId: _selectedCatId,
          unit: _selectedUnit,
          quantity: initialStock,
          defaultSellingPrice: sellingPrice,
          purchasePrice: purchasePrice,
          lowStockAlert: lowStock,
          barcode: barcode,
        );
        db.addProductModel(savedProduct);
      }

      FlutterBeep.playSuccess();
      widget.onProductCreated?.call(savedProduct);
      Navigator.pop(context, savedProduct);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isEdit = widget.product != null;

    return AlertDialog(
      title: Row(
        children: [
          Icon(
            isEdit ? Icons.edit : Icons.add_box,
            color: theme.colorScheme.primary,
          ),
          const SizedBox(width: 8),
          Text(isEdit ? 'Edit Product' : 'Add New Product'),
        ],
      ),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Product Name
              TextFormField(
                controller: _nameController,
                autofocus: true,
                decoration: const InputDecoration(
                  labelText: 'Product Name *',
                  hintText: 'e.g., Chips / Milk / Rice',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter product name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),

              // Barcode
              TextFormField(
                controller: _barcodeController,
                decoration: const InputDecoration(
                  labelText: 'Barcode',
                  hintText: 'Scanned or manual barcode',
                  prefixIcon: Icon(Icons.qr_code_2),
                ),
              ),
              const SizedBox(height: 12),

              // Default Selling Price
              TextFormField(
                controller: _priceController,
                decoration: const InputDecoration(
                  labelText: 'Selling Price (₹) *',
                  hintText: 'e.g., 50.0',
                ),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter selling price';
                  }
                  final price = double.tryParse(value);
                  if (price == null || price <= 0) {
                    return 'Enter a valid price (> 0)';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),

              // Purchase Price
              TextFormField(
                controller: _purchasePriceController,
                decoration: const InputDecoration(
                  labelText: 'Purchase Price (₹)',
                  hintText: 'Auto-calculated if blank',
                ),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
              ),
              const SizedBox(height: 12),

              // Initial Stock (Only for Add)
              if (!isEdit) ...[
                TextFormField(
                  controller: _initialStockController,
                  decoration: const InputDecoration(
                    labelText: 'Initial Stock Quantity',
                    hintText: 'e.g., 10.0',
                  ),
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // Unit Dropdown
              DropdownButtonFormField<String>(
                value: _selectedUnit,
                isExpanded: true,
                decoration: const InputDecoration(labelText: 'Unit'),
                items: _availableUnits
                    .map((u) => DropdownMenuItem(value: u, child: Text(u)))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedUnit = val);
                },
              ),
              const SizedBox(height: 12),

              // Low Stock Limit
              TextFormField(
                controller: _lowStockController,
                decoration: const InputDecoration(
                  labelText: 'Low Stock Limit',
                  hintText: 'e.g., 5.0',
                ),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _submitForm,
          child: Text(isEdit ? 'Save Changes' : 'Create & Save'),
        ),
      ],
    );
  }
}
