import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/product.dart';
import '../../providers/db_provider.dart';
import '../../core/constants.dart';
import 'barcode_scan_screen.dart';

class AddEditProductScreen extends StatefulWidget {
  final Product? product;
  final String? initialBarcode;

  const AddEditProductScreen({super.key, this.product, this.initialBarcode});

  @override
  State<AddEditProductScreen> createState() => _AddEditProductScreenState();
}

class _AddEditProductScreenState extends State<AddEditProductScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _barcodeController;
  late final TextEditingController _brandController;
  late final TextEditingController _purchasePriceController;
  late final TextEditingController _sellingPriceController;
  late final TextEditingController _minStockAlertController;
  late final TextEditingController _maxStockLimitController;
  late final TextEditingController _initialStockController;

  late String _selectedCatId;
  late String _selectedUnit;
  late List<String> _availableUnits;

  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    final p = widget.product;
    _nameController = TextEditingController(text: p?.name ?? '');
    _barcodeController = TextEditingController(
      text: p?.barcode ?? widget.initialBarcode ?? '',
    );
    _brandController = TextEditingController(text: p?.brand ?? '');
    _sellingPriceController = TextEditingController(
      text: p != null ? p.defaultSellingPrice.toString() : '',
    );
    _purchasePriceController = TextEditingController(
      text: p != null ? p.purchasePrice.toString() : '',
    );
    _minStockAlertController = TextEditingController(
      text: p != null ? p.lowStockAlert.toString() : '5.0',
    );
    _maxStockLimitController = TextEditingController(
      text: p?.maxStockLimit != null ? p!.maxStockLimit.toString() : '500.0',
    );
    _initialStockController = TextEditingController(
      text: p != null ? p.quantity.toString() : '10.0',
    );

    _selectedCatId = p?.categoryId ?? '';
    _selectedUnit = p?.unit ?? AppConstants.units.first;
    _availableUnits = [...AppConstants.units];

    // Standardize units without duplicates
    final defaultPresets = [
      'Piece',
      'Kg',
      'Gram',
      'Liter',
      'Box',
      'Packet',
      'Bottle',
      'Bag',
      'Tin',
      'Roll',
      'Dozen',
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
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      _initialized = true;
      // Safe place to access Provider — context is fully mounted here
      final db = Provider.of<DbProvider>(context, listen: false);
      if ((_selectedCatId.isEmpty ||
              !db.categories.any((c) => c.id == _selectedCatId)) &&
          db.categories.isNotEmpty) {
        _selectedCatId = db.categories.first.id;
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _barcodeController.dispose();
    _brandController.dispose();
    _sellingPriceController.dispose();
    _purchasePriceController.dispose();
    _minStockAlertController.dispose();
    _maxStockLimitController.dispose();
    _initialStockController.dispose();
    super.dispose();
  }

  void _resetFormForNewProduct() {
    _formKey.currentState?.reset();
    _nameController.clear();
    _barcodeController.clear();
    _brandController.clear();
    _purchasePriceController.clear();
    _sellingPriceController.clear();
    _minStockAlertController.text = '5.0';
    _maxStockLimitController.text = '500.0';
    _initialStockController.text = '10.0';

    final db = Provider.of<DbProvider>(context, listen: false);
    if (db.categories.isNotEmpty) {
      _selectedCatId = db.categories.first.id;
    } else {
      _selectedCatId = '';
    }
    if (_availableUnits.isNotEmpty) {
      _selectedUnit = _availableUnits.first;
    }
    setState(() {});
  }

  void _scanBarcode() async {
    try {
      final result = await Navigator.push<String>(
        context,
        MaterialPageRoute(
          fullscreenDialog: true,
          builder: (_) => const BarcodeScanScreen(),
        ),
      );
      if (result != null && result.isNotEmpty && mounted) {
        setState(() => _barcodeController.text = result);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Barcode scanned successfully'),
            backgroundColor: Color(0xFF10B981),
            duration: Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Camera/Scanner error: $e'),
            backgroundColor: Colors.red.shade700,
          ),
        );
      }
    }
  }

  void _showQuickCategoryAdd(DbProvider db) {
    final catNameController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add New Category'),
        content: TextField(
          controller: catNameController,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Category Name',
            hintText: 'e.g. Beverages',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final name = catNameController.text.trim();
              if (name.isNotEmpty) {
                final newCat = await db.addCategory(name, '');
                setState(() {
                  _selectedCatId = newCat.id;
                });
                if (mounted) Navigator.pop(ctx);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _showQuickUnitAdd() {
    final unitController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add New Unit'),
        content: TextField(
          controller: unitController,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Unit Name',
            hintText: 'e.g. Packet, Container, Dozen',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final u = unitController.text.trim();
              if (u.isNotEmpty && !_availableUnits.contains(u)) {
                setState(() {
                  _availableUnits.add(u);
                  _selectedUnit = u;
                });
                Navigator.pop(ctx);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  Future<void> _saveProduct({bool addAnother = false}) async {
    if (!_formKey.currentState!.validate()) return;

    final db = Provider.of<DbProvider>(context, listen: false);
    final isEdit = widget.product != null;

    final String name = _nameController.text.trim();
    final String? barcode = _barcodeController.text.trim().isEmpty
        ? null
        : _barcodeController.text.trim();
    final String? brand = _brandController.text.trim().isEmpty
        ? null
        : _brandController.text.trim();

    double sellingPrice;
    double purchasePrice;
    double minStockAlert;
    try {
      sellingPrice = double.parse(_sellingPriceController.text.trim());
      purchasePrice = _purchasePriceController.text.trim().isNotEmpty
          ? double.parse(_purchasePriceController.text.trim())
          : (sellingPrice * 0.75);
      minStockAlert = _minStockAlertController.text.trim().isNotEmpty
          ? double.parse(_minStockAlertController.text.trim())
          : 5.0;
    } catch (_) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter valid price/stock numbers.'),
        ),
      );
      return;
    }

    final double? maxStockLimit =
        _maxStockLimitController.text.trim().isNotEmpty
        ? double.tryParse(_maxStockLimitController.text.trim())
        : null;
    final double initialStock =
        double.tryParse(_initialStockController.text.trim()) ?? 0.0;

    String catId = _selectedCatId;
    if (!db.categories.any((c) => c.id == catId) && db.categories.isNotEmpty) {
      catId = db.categories.first.id;
    }

    if (isEdit) {
      final updatedProduct = widget.product!.copyWith(
        name: name,
        categoryId: catId,
        brand: brand,
        unit: _selectedUnit,
        defaultSellingPrice: sellingPrice,
        purchasePrice: purchasePrice,
        quantity: initialStock,
        lowStockAlert: minStockAlert,
        maxStockLimit: maxStockLimit,
        barcode: barcode,
      );
      await db.updateProduct(updatedProduct);
    } else {
      await db.addProduct(
        name,
        catId,
        _selectedUnit,
        sellingPrice,
        purchasePrice,
        minStockAlert,
        initialStock,
        barcode,
        brand,
        maxStockLimit,
      );
    }

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Product is saved successfully.'),
        backgroundColor: Color(0xFF10B981),
        duration: Duration(seconds: 2),
      ),
    );

    if (addAnother && !isEdit) {
      _resetFormForNewProduct();
    } else {
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final db = Provider.of<DbProvider>(context, listen: false);
    final isEdit = widget.product != null;
    final screenWidth = MediaQuery.of(context).size.width;
    final isWideScreen = screenWidth > 768;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isEdit ? 'Edit Product' : 'Add New Product',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: theme.cardColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              if (!isEdit) ...[
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(0, 48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () => _saveProduct(addAnother: true),
                    icon: const Icon(Icons.add_task_rounded, size: 18),
                    label: const FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text('Save & Add Another', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(0, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () => _saveProduct(addAnother: false),
                  icon: const Icon(Icons.check, size: 18),
                  label: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      isEdit ? 'Update Product' : 'Save Product',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Card 1: Primary Product Info
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(
                        color: theme.colorScheme.outlineVariant.withValues(
                          alpha: 0.5,
                        ),
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.inventory_2,
                                color: theme.colorScheme.primary,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Product Identification & Category',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Product Name
                          TextFormField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              labelText: 'Product Name *',
                              hintText: 'e.g. Basmati Rice 5kg',
                              prefixIcon: Icon(Icons.shopping_bag_outlined),
                            ),
                            validator: (v) => v == null || v.trim().isEmpty
                                ? 'Product name is required'
                                : null,
                          ),
                          const SizedBox(height: 16),

                          // Barcode Scanner Field Row
                          TextFormField(
                            controller: _barcodeController,
                            decoration: InputDecoration(
                              labelText: 'Barcode Scanner / SKU Code',
                              hintText: 'Scan with camera or type code...',
                              prefixIcon: const Icon(Icons.qr_code_2),
                              suffixIcon: IconButton(
                                icon: const Icon(
                                  Icons.qr_code_scanner,
                                  color: Colors.amber,
                                ),
                                tooltip: 'Open Camera Barcode Scanner',
                                onPressed: _scanBarcode,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Category & Brand Grid Row
                          if (isWideScreen)
                            Row(
                              children: [
                                Expanded(child: _buildCategoryDropdown(db)),
                                const SizedBox(width: 12),
                                Expanded(child: _buildBrandField()),
                              ],
                            )
                          else ...[
                            _buildCategoryDropdown(db),
                            const SizedBox(height: 16),
                            _buildBrandField(),
                          ],
                          const SizedBox(height: 16),

                          // Unit Field Row
                          Row(
                            children: [
                              Expanded(
                                child: DropdownButtonFormField<String>(
                                  value: _selectedUnit,
                                  isExpanded: true,
                                  decoration: const InputDecoration(
                                    labelText:
                                        'Unit (Piece, Kg, Litre, Box, Pack, etc.) *',
                                    prefixIcon: Icon(Icons.straighten),
                                  ),
                                  items: _availableUnits
                                      .map(
                                        (u) => DropdownMenuItem(
                                          value: u,
                                          child: Text(u),
                                        ),
                                      )
                                      .toList(),
                                  onChanged: (val) {
                                    if (val != null)
                                      setState(() => _selectedUnit = val);
                                  },
                                ),
                              ),
                              IconButton(
                                icon: const Icon(
                                  Icons.add_circle_outline,
                                  color: Colors.blue,
                                ),
                                tooltip: 'Add Custom Unit',
                                onPressed: _showQuickUnitAdd,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Card 2: Pricing & Stock Limits
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(
                        color: theme.colorScheme.outlineVariant.withValues(
                          alpha: 0.5,
                        ),
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.sell_outlined,
                                color: theme.colorScheme.primary,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Pricing & Inventory Threshold Limits',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Selling Price & Purchase Price Row
                          if (isWideScreen)
                            Row(
                              children: [
                                Expanded(child: _buildPurchasePriceField()),
                                const SizedBox(width: 12),
                                Expanded(child: _buildSellingPriceField()),
                              ],
                            )
                          else ...[
                            _buildPurchasePriceField(),
                            const SizedBox(height: 16),
                            _buildSellingPriceField(),
                          ],
                          const SizedBox(height: 16),

                          // Initial Quantity, Min Alert, Max Limit Row
                          if (isWideScreen)
                            Row(
                              children: [
                                Expanded(child: _buildInitialStockField()),
                                const SizedBox(width: 12),
                                Expanded(child: _buildMinStockAlertField()),
                                const SizedBox(width: 12),
                                Expanded(child: _buildMaxStockLimitField()),
                              ],
                            )
                          else ...[
                            _buildInitialStockField(),
                            const SizedBox(height: 16),
                            _buildMinStockAlertField(),
                            const SizedBox(height: 16),
                            _buildMaxStockLimitField(),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryDropdown(DbProvider db) {
    final categories = db.categories;
    String? currentSelectedId;
    if (categories.any((c) => c.id == _selectedCatId)) {
      currentSelectedId = _selectedCatId;
    } else if (categories.isNotEmpty) {
      currentSelectedId = categories.first.id;
    }

    if (categories.isEmpty) {
      return Row(
        children: [
          Expanded(
            child: TextFormField(
              readOnly: true,
              decoration: const InputDecoration(
                labelText: 'Category *',
                hintText: 'No Category (Click + to Add)',
                prefixIcon: Icon(Icons.category_outlined),
              ),
              initialValue: 'No Category (Click + to Add)',
              validator: (_) => 'Please click + to add a category first',
            ),
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Colors.blue),
            tooltip: 'Add Quick Category',
            onPressed: () => _showQuickCategoryAdd(db),
          ),
        ],
      );
    }

    return Row(
      children: [
        Expanded(
          child: DropdownButtonFormField<String>(
            value: currentSelectedId,
            isExpanded: true,
            decoration: const InputDecoration(
              labelText: 'Category *',
              prefixIcon: Icon(Icons.category_outlined),
            ),
            hint: const Text('Select category'),
            items: categories
                .map(
                  (c) => DropdownMenuItem<String>(
                    value: c.id,
                    child: Text(c.name),
                  ),
                )
                .toList(),
            validator: (val) => (val == null || val.isEmpty)
                ? 'Please select or add a category'
                : null,
            onChanged: (val) {
              if (val != null) {
                setState(() => _selectedCatId = val);
              }
            },
          ),
        ),
        IconButton(
          icon: const Icon(Icons.add_circle_outline, color: Colors.blue),
          tooltip: 'Add Quick Category',
          onPressed: () => _showQuickCategoryAdd(db),
        ),
      ],
    );
  }

  Widget _buildBrandField() {
    return TextFormField(
      controller: _brandController,
      decoration: const InputDecoration(
        labelText: 'Brand',
        hintText: 'e.g. Fortune, Nestlé, Amul, Samsung',
        prefixIcon: Icon(Icons.branding_watermark_outlined),
      ),
    );
  }

  Widget _buildPurchasePriceField() {
    return TextFormField(
      controller: _purchasePriceController,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: const InputDecoration(
        labelText: 'Purchase Price (Cost ₹)',
        hintText: '0.00',
        prefixIcon: Icon(Icons.currency_rupee),
      ),
    );
  }

  Widget _buildSellingPriceField() {
    return TextFormField(
      controller: _sellingPriceController,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: const InputDecoration(
        labelText: 'Selling Price (₹) *',
        hintText: '0.00',
        prefixIcon: Icon(Icons.sell_outlined),
      ),
      validator: (v) {
        if (v == null || v.trim().isEmpty) return 'Selling price required';
        if (double.tryParse(v.trim()) == null) return 'Invalid number';
        return null;
      },
    );
  }

  Widget _buildInitialStockField() {
    return TextFormField(
      controller: _initialStockController,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: const InputDecoration(
        labelText: 'Current Stock Qty',
        hintText: '10.0',
        prefixIcon: Icon(Icons.numbers_outlined),
      ),
    );
  }

  Widget _buildMinStockAlertField() {
    return TextFormField(
      controller: _minStockAlertController,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: const InputDecoration(
        labelText: 'Minimum Stock Alert',
        hintText: '5.0',
        prefixIcon: Icon(Icons.warning_amber_outlined),
      ),
      validator: (v) {
        if (v == null || v.trim().isEmpty) return 'Min alert required';
        if (double.tryParse(v.trim()) == null) return 'Invalid number';
        return null;
      },
    );
  }

  Widget _buildMaxStockLimitField() {
    return TextFormField(
      controller: _maxStockLimitController,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: const InputDecoration(
        labelText: 'Maximum Stock Limit',
        hintText: '500.0',
        prefixIcon: Icon(Icons.vertical_align_top_outlined),
      ),
    );
  }
}
