import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/billing_provider.dart';
import '../../providers/db_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/product.dart';
import '../../models/invoice.dart';
import '../../core/constants.dart';
import 'bill_success_dialog.dart';
import 'quantity_selector_dialog.dart';
import '../../core/theme.dart';
import 'barcode_scanner_dialog.dart';
import '../../widgets/add_product_dialog.dart';

class BillingScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const BillingScreen({super.key, this.onOpenDrawer});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen>
    with SingleTickerProviderStateMixin {
  late TabController _mobileTabController;
  final _searchController = TextEditingController();
  final _discountController = TextEditingController();
  final _notesController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _mobileTabController = TabController(length: 2, vsync: this);

    // Register the Out of Stock callback
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final billing = Provider.of<BillingProvider>(context, listen: false);
      billing.onOutOfStock = _handleOutOfStock;
    });
  }

  @override
  void dispose() {
    _mobileTabController.dispose();
    _searchController.dispose();
    _discountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  // --- Out of Stock Workflow Dialogs ---
  void _handleOutOfStock(Product product) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        final qtyController = TextEditingController();
        final formKey = GlobalKey<FormState>();
        return AlertDialog(
          title: Row(
            children: [
              const Icon(Icons.error_outline, color: Colors.red),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  '${product.name} - Out of Stock',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          content: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('The product "${product.name}" has insufficient stock.'),
                const SizedBox(height: 12),
                TextFormField(
                  controller: qtyController,
                  decoration: InputDecoration(
                    labelText: 'Enter Quantity to Restock',
                    suffixText: product.unit,
                  ),
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter quantity';
                    }
                    final q = double.tryParse(value);
                    if (q == null || q <= 0) {
                      return 'Enter a valid quantity';
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close popup
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  final qtyToAdd = double.parse(qtyController.text);

                  // Save stock in cloud & database
                  Provider.of<DbProvider>(context, listen: false).addStock(
                    product.id,
                    qtyToAdd,
                    'Restocked during billing checkout',
                  );

                  Navigator.pop(context); // Close out of stock popup

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Restocked $qtyToAdd ${product.unit} of ${product.name}. Retrying...',
                      ),
                      backgroundColor: Colors.green,
                    ),
                  );

                  // Directly add product to bill
                  final updatedProd = Provider.of<DbProvider>(
                    context,
                    listen: false,
                  ).products.firstWhere((p) => p.id == product.id);
                  _addProductDirectly(updatedProd);
                }
              },
              child: const Text('Add Stock'),
            ),
          ],
        );
      },
    );
  }

  // --- Add Product Directly to Bill ---
  bool _addProductDirectly(Product product, {bool showSnackBar = true}) {
    final billing = Provider.of<BillingProvider>(context, listen: false);
    final success = billing.addProduct(
      product,
      qty: 1.0,
      billingMethod: 'QUANTITY',
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      if (showSnackBar) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${product.name} added to bill'),
            duration: const Duration(seconds: 1),
            action: SnackBarAction(
              label: 'VIEW CART',
              onPressed: () {
                if (MediaQuery.of(context).size.width <= 600) {
                  _mobileTabController.animateTo(1);
                }
              },
            ),
          ),
        );
      }
    }
    return success;
  }

  // --- Add Product Options Dialog (presets, qty, amount) ---
  void _showAddProductOptionsDialog(Product product) async {
    final qty = await showDialog<double>(
      context: context,
      builder: (context) =>
          QuantitySelectorDialog(product: product, initialQuantity: 1.0),
    );
    if (!mounted) return;
    if (qty != null) {
      final billing = Provider.of<BillingProvider>(context, listen: false);
      final success = billing.billByQuantity(product, qty);
      if (success) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${product.name} added to bill'),
            duration: const Duration(seconds: 1),
            action: SnackBarAction(
              label: 'VIEW CART',
              onPressed: () {
                if (MediaQuery.of(context).size.width <= 600) {
                  _mobileTabController.animateTo(1);
                }
              },
            ),
          ),
        );
      }
    }
  }

  // --- Temporary Price Change Dialog ---
  void _showTempPriceDialog(InvoiceItem item, Product originalProduct) {
    final priceController = TextEditingController(
      text: item.billingPrice.toString(),
    );
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit Price: ${item.productName}'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Default Price: ₹${item.defaultPrice}/${item.unit}'),
              const SizedBox(height: 12),
              TextFormField(
                controller: priceController,
                decoration: const InputDecoration(
                  labelText: 'Temporary Billing Price (₹)',
                ),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Enter price';
                  }
                  final p = double.tryParse(value);
                  if (p == null || p <= 0) {
                    return 'Enter a valid price';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 8),
              const Text(
                'This price will only apply to this bill. The default product price will remain unchanged.',
                style: TextStyle(color: Colors.grey, fontSize: 11),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                final newPrice = double.parse(priceController.text);
                Provider.of<BillingProvider>(
                  context,
                  listen: false,
                ).updateBillingPrice(item.productId, newPrice);
                Navigator.pop(context);
              }
            },
            child: const Text('Apply Temporarily'),
          ),
        ],
      ),
    );
  }

  // --- Temporary Quantity Change Dialog ---
  void _showQuantityDialog(InvoiceItem item, Product originalProduct) async {
    final qty = await showDialog<double>(
      context: context,
      builder: (context) => QuantitySelectorDialog(
        product: originalProduct,
        initialQuantity: item.quantity,
        customPrice: item.billingPrice,
      ),
    );
    if (!mounted) return;
    if (qty != null) {
      Provider.of<BillingProvider>(
        context,
        listen: false,
      ).updateQuantity(item.productId, qty, originalProduct);
    }
  }

  // --- Complete Bill Workflow ---
  void _previewDraftInvoice(BillingProvider billing, DbProvider db) {
    if (billing.cartItems.isEmpty) return;
    final String invNo =
        'PREVIEW-${DateTime.now().year}${DateTime.now().month.toString().padLeft(2, '0')}${DateTime.now().day.toString().padLeft(2, '0')}-${(db.invoices.length + 1).toString().padLeft(4, '0')}';
    final draftInvoice = billing.generateInvoice(invNo);
    final businessName =
        Provider.of<AuthProvider>(context, listen: false).currentUser?.businessName ??
        'ApexPOS';
    InvoicePreviewDialog.show(context, draftInvoice, businessName);
  }

  void _handleCheckout(BillingProvider billing, DbProvider db) async {
    if (billing.cartItems.isEmpty) return;

    final String invNo =
        'INV-${DateTime.now().year}${DateTime.now().month.toString().padLeft(2, '0')}${DateTime.now().day.toString().padLeft(2, '0')}-${(db.invoices.length + 1).toString().padLeft(4, '0')}';

    // Generate Invoice model
    final invoice = billing.generateInvoice(invNo);

    // Complete invoice: reduces stock and saves details
    await db.completeBill(invoice);

    // Clear cart
    billing.clearCart();
    _discountController.clear();
    _notesController.clear();

    if (!mounted) return;

    // Show Invoice Success Print Dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => BillSuccessDialog(invoice: invoice),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final billing = Provider.of<BillingProvider>(context);
    final results = db.searchProducts(_searchQuery);

    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isTablet = MediaQuery.of(context).size.width > 600;

    // UI Widgets for Search Panel
    final Widget searchPanel = Column(
      children: [
        // Live search bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
          child: Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search by name or barcode...',
                    prefixIcon: const Icon(Icons.search_rounded),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded),
                            onPressed: () {
                              setState(() {
                                _searchController.clear();
                                _searchQuery = '';
                              });
                            },
                          )
                        : null,
                  ),
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val.trim();
                    });
                  },
                ),
              ),
              const SizedBox(width: 12),
              Material(
                color: theme.colorScheme.primary,
                borderRadius: BorderRadius.circular(12),
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (dialogContext) => BarcodeScannerDialog(
                        continuous: true,
                        onScan: (scannedBarcode) {
                          ScaffoldMessenger.of(context).hideCurrentSnackBar();
                          final matchedProduct = db.getProductByBarcode(
                            scannedBarcode,
                          );
                          if (matchedProduct != null) {
                            final success = _addProductDirectly(matchedProduct, showSnackBar: false);
                            if (!success) {
                              return 'Out of stock: ${matchedProduct.name}';
                            }
                            final cartItemIndex = billing.cartItems.indexWhere((item) => item.productId == matchedProduct.id);
                            final qtyStr = cartItemIndex != -1 ? ' (Qty: ${billing.cartItems[cartItemIndex].quantity.toStringAsFixed(1)})' : '';

                            return 'Added to cart: ${matchedProduct.name}$qtyStr';
                          } else {
                            return 'Product not found.';
                          }
                        },
                        onAddNewProduct: (scannedBarcode) {
                          AddProductDialog.show(
                            context,
                            initialBarcode: scannedBarcode,
                            onProductCreated: (newProduct) {
                              _addProductDirectly(newProduct);
                            },
                          );
                        },
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    child: const Icon(
                      Icons.qr_code_scanner_rounded,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Product search results
        Expanded(
          child: results.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.inventory_2_outlined,
                        size: 64,
                        color: theme.colorScheme.onSurfaceVariant.withOpacity(
                          0.35,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'No products found',
                        style: TextStyle(
                          color: isDark ? Slate.shade400 : Slate.shade500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 4,
                  ),
                  itemCount: results.length,
                  itemBuilder: (context, idx) {
                    final product = results[idx];
                    final isLow =
                        product.quantity > 0 &&
                        product.quantity <= product.lowStockAlert;
                    final isOut = product.quantity <= 0;

                    // Check if product is already in cart
                    final cartItemIndex = billing.cartItems.indexWhere(
                      (item) => item.productId == product.id,
                    );
                    final isInCart = cartItemIndex != -1;
                    final cartItem = isInCart
                        ? billing.cartItems[cartItemIndex]
                        : null;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 10.0),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isDark ? Slate.shade850 : Colors.grey.shade100,
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isDark
                                ? Colors.black.withOpacity(0.05)
                                : Colors.grey.shade50,
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 6,
                        ),
                        title: Text(
                          product.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 6.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Wrap(
                                spacing: 8,
                                runSpacing: 4,
                                crossAxisAlignment: WrapCrossAlignment.center,
                                children: [
                                  Text(
                                    'MRP: ₹${product.defaultSellingPrice.toStringAsFixed(1)}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: theme.colorScheme.primary,
                                      fontSize: 13,
                                    ),
                                  ),
                                  Text(
                                    'Cost: ₹${product.purchasePrice.toStringAsFixed(1)}',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: isDark
                                          ? Slate.shade400
                                          : Slate.shade600,
                                    ),
                                  ),
                                  Text(
                                    'Type: ${product.unit}',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500,
                                      color: isDark
                                          ? Slate.shade400
                                          : Slate.shade600,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 3,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isOut
                                          ? const Color(0xFFFEE2E2)
                                          : isLow
                                          ? const Color(0xFFFEF3C7)
                                          : const Color(0xFFD1FAE5),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      isOut
                                          ? 'Out of Stock'
                                          : isLow
                                          ? 'Low Stock: ${product.quantity.toStringAsFixed(0)}'
                                          : 'Stock: ${product.quantity.toStringAsFixed(0)}',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: isOut
                                            ? const Color(0xFF991B1B)
                                            : isLow
                                            ? const Color(0xFF92400E)
                                            : const Color(0xFF065F46),
                                      ),
                                    ),
                                  ),
                                  if (isInCart) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 3,
                                      ),
                                      decoration: BoxDecoration(
                                        color: theme.colorScheme.primary
                                            .withOpacity(0.12),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        'In Cart: ${cartItem!.quantity} ${cartItem.unit}',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: theme.colorScheme.primary,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                        trailing: Material(
                          color: isOut
                              ? Colors.grey.shade300
                              : isInCart
                              ? Colors.green.withOpacity(0.1)
                              : theme.colorScheme.primary.withOpacity(0.1),
                          shape: const CircleBorder(),
                          child: IconButton(
                            icon: Icon(
                              isInCart
                                  ? Icons.check_circle_outline_rounded
                                  : Icons.add_shopping_cart_rounded,
                              color: isOut
                                  ? Colors.grey
                                  : isInCart
                                  ? Colors.green
                                  : theme.colorScheme.primary,
                              size: 20,
                            ),
                            onPressed: isOut || isInCart
                                ? null
                                : () => _addProductDirectly(product),
                          ),
                        ),
                        onTap: isOut || isInCart
                            ? null
                            : () => _addProductDirectly(product),
                      ),
                    );
                  },
                ),
        ),
      ],
    );

    // UI Widgets for Cart Panel
    final Widget cartPanel = Column(
      children: [
        // Cart list items
        Expanded(
          child: billing.cartItems.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.08),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.shopping_bag_outlined,
                          size: 48,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Your cart is empty',
                        style: TextStyle(
                          color: isDark ? Slate.shade400 : Slate.shade500,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Select products from the catalog to build a bill.',
                        style: TextStyle(
                          color: isDark ? Slate.shade500 : Slate.shade400,
                          fontSize: 13,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                  itemCount: billing.cartItems.length,
                  itemBuilder: (context, idx) {
                    final item = billing.cartItems[idx];
                    final originalProduct = db.products.firstWhere(
                      (p) => p.id == item.productId,
                      orElse: () => Product(
                        id: item.productId,
                        name: item.productName,
                        categoryId: '',
                        unit: item.unit,
                        quantity: 0.0,
                        defaultSellingPrice: item.defaultPrice,
                        purchasePrice: item.purchasePrice,
                        lowStockAlert: 0.0,
                      ),
                    );

                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isDark ? Slate.shade850 : Colors.grey.shade100,
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isDark
                                ? Colors.black.withOpacity(0.05)
                                : Colors.grey.shade50,
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: InkWell(
                                    onTap: () => _showQuantityDialog(
                                      item,
                                      originalProduct,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.productName,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                          ),
                                        ),
                                        if (item.packName != null)
                                          Padding(
                                            padding: const EdgeInsets.only(
                                              top: 4.0,
                                            ),
                                            child: Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal: 6,
                                                    vertical: 2,
                                                  ),
                                              decoration: BoxDecoration(
                                                color: theme.colorScheme.primary
                                                    .withOpacity(0.12),
                                                borderRadius:
                                                    BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                'Pack: ${item.packName}',
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color:
                                                      theme.colorScheme.primary,
                                                ),
                                              ),
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(
                                    Icons.delete_outline_rounded,
                                    color: Colors.redAccent,
                                    size: 22,
                                  ),
                                  onPressed: () =>
                                      billing.removeProduct(item.productId),
                                ),
                              ],
                            ),
                            const Divider(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                // Pricing Overrides
                                Flexible(
                                  flex: 2,
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    alignment: Alignment.centerLeft,
                                    child: InkWell(
                                      onTap: () => _showTempPriceDialog(
                                        item,
                                        originalProduct,
                                      ),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 8,
                                          vertical: 5,
                                        ),
                                        decoration: BoxDecoration(
                                          color:
                                              item.billingPrice !=
                                                  item.defaultPrice
                                              ? const Color(
                                                  0xFFFEF3C7,
                                                ) // Amber light
                                              : (isDark
                                                    ? const Color(0xFF334155)
                                                    : const Color(0xFFF1F5F9)),
                                          borderRadius: BorderRadius.circular(
                                            10,
                                          ),
                                          border: Border.all(
                                            color:
                                                item.billingPrice !=
                                                    item.defaultPrice
                                                ? const Color(0xFFF59E0B)
                                                : Colors.transparent,
                                          ),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              '₹${item.billingPrice.toStringAsFixed(1)}/${item.unit}',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color:
                                                    item.billingPrice !=
                                                        item.defaultPrice
                                                    ? const Color(0xFF92400E)
                                                    : (isDark
                                                          ? Slate.shade300
                                                          : Slate.shade700),
                                              ),
                                            ),
                                            const SizedBox(width: 4),
                                            Icon(
                                              Icons.edit_rounded,
                                              size: 12,
                                              color:
                                                  item.billingPrice !=
                                                      item.defaultPrice
                                                  ? const Color(0xFFB45309)
                                                  : Colors.blue,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 4),

                                // Quantity Editors
                                Flexible(
                                  flex: 3,
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Material(
                                          color: isDark
                                              ? const Color(0xFF334155)
                                              : const Color(0xFFF1F5F9),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),
                                          child: InkWell(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                            onTap: () {
                                              billing.updateQuantity(
                                                item.productId,
                                                item.quantity -
                                                    (item.billingMethod ==
                                                            'FIXED_PACK'
                                                        ? 0.5
                                                        : 1),
                                                originalProduct,
                                              );
                                            },
                                            child: const Padding(
                                              padding: EdgeInsets.all(6.0),
                                              child: Icon(
                                                Icons.remove,
                                                size: 16,
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 2),
                                        InkWell(
                                          onTap: () => _showQuantityDialog(
                                            item,
                                            originalProduct,
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            6,
                                          ),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 6,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: isDark
                                                  ? const Color(0xFF334155)
                                                  : const Color(0xFFF1F5F9),
                                              borderRadius:
                                                  BorderRadius.circular(6),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Text(
                                                  '${item.quantity}',
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 14,
                                                  ),
                                                ),
                                                const SizedBox(width: 4),
                                                const Icon(
                                                  Icons.edit_rounded,
                                                  size: 12,
                                                  color: Colors.blue,
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 2),
                                        Material(
                                          color: isDark
                                              ? const Color(0xFF334155)
                                              : const Color(0xFFF1F5F9),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),
                                          child: InkWell(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                            onTap: () {
                                              billing.updateQuantity(
                                                item.productId,
                                                item.quantity +
                                                    (item.billingMethod ==
                                                            'FIXED_PACK'
                                                        ? 0.5
                                                        : 1),
                                                originalProduct,
                                              );
                                            },
                                            child: const Padding(
                                              padding: EdgeInsets.all(6.0),
                                              child: Icon(Icons.add, size: 16),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 4),

                                // Subtotal
                                Flexible(
                                  flex: 2,
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    alignment: Alignment.centerRight,
                                    child: Text(
                                      '₹${item.total.toStringAsFixed(1)}',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: isDark
                                            ? Colors.white
                                            : Slate.shade900,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),

        // Billing Ledger details card (Discount, Total, Checkout button)
        Container(
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDark ? Slate.shade850 : Colors.grey.shade100,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: isDark
                    ? Colors.black.withOpacity(0.1)
                    : Colors.grey.shade100,
                blurRadius: 16,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(18.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Subtotal:',
                      style: TextStyle(
                        color: isDark ? Slate.shade400 : Slate.shade500,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      '₹${billing.subTotal.toStringAsFixed(1)}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Slate.shade800,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Discount field
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Discount:',
                        style: TextStyle(
                          color: isDark ? Slate.shade400 : Slate.shade500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 120,
                      height: 40,
                      child: TextFormField(
                        controller: _discountController,
                        decoration: InputDecoration(
                          hintText: '0.0',
                          prefixText: '₹ ',
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 8,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide(
                              color: isDark
                                  ? Slate.shade700
                                  : Colors.grey.shade300,
                            ),
                          ),
                        ),
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                        onChanged: (val) {
                          final disc = double.tryParse(val) ?? 0.0;
                          billing.setDiscount(disc);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Invoice notes field
                SizedBox(
                  height: 40,
                  child: TextFormField(
                    controller: _notesController,
                    decoration: InputDecoration(
                      labelText: 'Invoice Notes (Optional)',
                      labelStyle: const TextStyle(fontSize: 12),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(
                          color: isDark ? Slate.shade700 : Colors.grey.shade300,
                        ),
                      ),
                    ),
                    style: const TextStyle(fontSize: 13),
                    maxLines: 1,
                    onChanged: (val) => billing.setNotes(val.trim()),
                  ),
                ),
                const Divider(height: 28),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Grand Total:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: isDark ? Colors.white : Slate.shade900,
                      ),
                    ),
                    Text(
                      '₹${billing.grandTotal.toStringAsFixed(1)}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 22,
                        color: theme.colorScheme.primary,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: billing.cartItems.isEmpty
                            ? null
                            : () => _previewDraftInvoice(billing, db),
                        icon: const Icon(Icons.visibility_outlined, size: 18),
                        label: const Text(
                          'Preview',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        onPressed: billing.cartItems.isEmpty
                            ? null
                            : () => _handleCheckout(billing, db),
                        icon: const Icon(Icons.check_circle_outline, size: 18),
                        label: const Text(
                          'Complete & Print',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          elevation: billing.cartItems.isEmpty ? 0 : 4,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );

    // Responsive Rendering
    if (isTablet) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('POS Billing Checkout'),
          leading: IconButton(
            icon: const Icon(Icons.menu),
            onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
            tooltip: 'Open Menu',
          ),
          actions: [
            if (billing.cartItems.isNotEmpty)
              TextButton.icon(
                icon: const Icon(Icons.clear_all, color: Colors.white),
                label: const Text(
                  'Clear Cart',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () => billing.clearCart(),
              ),
          ],
        ),
        body: Row(
          children: [
            Expanded(flex: 5, child: searchPanel),
            const VerticalDivider(width: 1),
            Expanded(flex: 4, child: cartPanel),
          ],
        ),
      );
    } else {
      // Mobile screen: Tabbed search vs checkout cart
      return Scaffold(
        resizeToAvoidBottomInset: true,
        appBar: AppBar(
          title: const Text('POS Billing'),
          leading: IconButton(
            icon: const Icon(Icons.menu),
            onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
            tooltip: 'Open Menu',
          ),
          actions: [
            if (billing.cartItems.isNotEmpty)
              IconButton(
                icon: const Icon(Icons.delete_sweep_outlined),
                tooltip: 'Clear Cart',
                onPressed: () => billing.clearCart(),
              ),
          ],
          bottom: TabBar(
            controller: _mobileTabController,
            tabs: [
              const Tab(icon: Icon(Icons.search), text: 'Products'),
              Tab(
                icon: Badge(
                  label: Text('${billing.cartItems.length}'),
                  isLabelVisible: billing.cartItems.isNotEmpty,
                  child: const Icon(Icons.shopping_cart),
                ),
                text: 'Cart',
              ),
            ],
          ),
        ),
        body: TabBarView(
          controller: _mobileTabController,
          children: [searchPanel, cartPanel],
        ),
      );
    }
  }
}
