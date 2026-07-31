import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/db_provider.dart';
import '../../models/product.dart';
import '../../models/category.dart';
import '../../core/theme.dart';
import 'add_product_screen.dart';

class ProductScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const ProductScreen({super.key, this.onOpenDrawer});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategoryId = ''; // Empty string means 'All'

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddEditDialog([Product? product]) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (ctx) => AddEditProductScreen(product: product),
      ),
    );
  }

  void _confirmDelete(Product product) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red),
            SizedBox(width: 8),
            Text('Delete Product'),
          ],
        ),
        content: Text(
          'Are you sure you want to delete "${product.name}"? This will delete all its history.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Provider.of<DbProvider>(
                context,
                listen: false,
              ).deleteProduct(product.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Product "${product.name}" deleted.')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final results = db.searchProducts(
      _searchQuery,
      categoryId: _selectedCategoryId,
    );
    final theme = Theme.of(context);
    final isTablet = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Management'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed:
              widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'fab_product_screen',
        onPressed: () => _showAddEditDialog(),
        icon: const Icon(Icons.add),
        label: const Text('Add Product'),
      ),
      body: Column(
        children: [
          // Filter & Search Controls
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 16.0,
              vertical: 8.0,
            ),
            child: Column(
              children: [
                // Live Search Bar
                TextFormField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search Product...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
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
                const SizedBox(height: 10),

                // Category Chips Row (Horizontal Scroll)
                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                          label: const Text('All Categories'),
                          selected: _selectedCategoryId.isEmpty,
                          onSelected: (_) {
                            setState(() {
                              _selectedCategoryId = '';
                            });
                          },
                        ),
                      ),
                      ...db.categories.map((cat) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: ChoiceChip(
                            materialTapTargetSize:
                                MaterialTapTargetSize.shrinkWrap,
                            label: Text(cat.name),
                            selected: _selectedCategoryId == cat.id,
                            onSelected: (_) {
                              setState(() {
                                _selectedCategoryId = cat.id;
                              });
                            },
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Product List Table/Grid
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
                            0.5,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No Products Found',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  )
                : isTablet
                ? _buildTabletTable(results, db, theme)
                : _buildMobileList(results, db, theme),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileList(List<Product> list, DbProvider db, ThemeData theme) {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: list.length,
      itemBuilder: (context, idx) {
        final prod = list[idx];
        final catName = db.categories
            .firstWhere(
              (c) => c.id == prod.categoryId,
              orElse: () => Category(id: '', name: 'Unknown'),
            )
            .name;
        final isLowStock =
            prod.quantity > 0 && prod.quantity <= prod.lowStockAlert;
        final isOut = prod.quantity <= 0;

        final isDark = theme.brightness == Brightness.dark;

        return Container(
          margin: const EdgeInsets.only(bottom: 12.0),
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
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        prod.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        children: [
                          Text(
                            'Cat: $catName',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Slate.shade400 : Slate.shade500,
                            ),
                          ),
                          if (prod.barcode != null && prod.barcode!.isNotEmpty)
                            Text(
                              '• Barcode: ${prod.barcode}',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? Slate.shade400 : Slate.shade500,
                              ),
                            ),
                          Text(
                            '• Cost: ₹${prod.purchasePrice.toStringAsFixed(1)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Slate.shade400 : Slate.shade500,
                            ),
                          ),
                          Text(
                            '• Price: ₹${prod.defaultSellingPrice.toStringAsFixed(1)}/${prod.unit}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
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
                                  : isLowStock
                                  ? const Color(0xFFFEF3C7)
                                  : const Color(0xFFD1FAE5),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    color: isOut
                                        ? const Color(0xFFDC2626)
                                        : isLowStock
                                        ? const Color(0xFFD97706)
                                        : const Color(0xFF059669),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Stock: ${prod.quantity.toStringAsFixed(1)} ${prod.unit}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isOut
                                        ? const Color(0xFF991B1B)
                                        : isLowStock
                                        ? const Color(0xFF92400E)
                                        : const Color(0xFF065F46),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Material(
                      color: isDark
                          ? const Color(0xFF334155)
                          : const Color(0xFFF1F5F9),
                      shape: const CircleBorder(),
                      child: IconButton(
                        icon: const Icon(
                          Icons.edit_rounded,
                          color: Colors.blue,
                          size: 18,
                        ),
                        onPressed: () => _showAddEditDialog(prod),
                        constraints: const BoxConstraints(),
                        padding: const EdgeInsets.all(8),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Material(
                      color: isDark
                          ? const Color(0xFF334155)
                          : const Color(0xFFF1F5F9),
                      shape: const CircleBorder(),
                      child: IconButton(
                        icon: const Icon(
                          Icons.delete_outline_rounded,
                          color: Colors.redAccent,
                          size: 18,
                        ),
                        onPressed: () => _confirmDelete(prod),
                        constraints: const BoxConstraints(),
                        padding: const EdgeInsets.all(8),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTabletTable(List<Product> list, DbProvider db, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Card(
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columns: const [
                DataColumn(
                  label: Text(
                    'Product Name',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Barcode',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Category',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Unit',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Purchase Cost',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Selling Price',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Current Stock',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Alert Limit',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Actions',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
              rows: list.map((prod) {
                final catName = db.categories
                    .firstWhere(
                      (c) => c.id == prod.categoryId,
                      orElse: () => Category(id: '', name: 'Unknown'),
                    )
                    .name;
                final isLowStock =
                    prod.quantity > 0 && prod.quantity <= prod.lowStockAlert;
                final isOut = prod.quantity <= 0;

                return DataRow(
                  cells: [
                    DataCell(
                      Text(
                        prod.name,
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ),
                    DataCell(Text(prod.barcode ?? '-')),
                    DataCell(Text(catName)),
                    DataCell(Text(prod.unit)),
                    DataCell(Text('₹${prod.purchasePrice.toStringAsFixed(1)}')),
                    DataCell(
                      Text('₹${prod.defaultSellingPrice.toStringAsFixed(1)}'),
                    ),
                    DataCell(
                      Row(
                        children: [
                          Text(
                            '${prod.quantity} ${prod.unit}',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: isOut
                                  ? Colors.red
                                  : isLowStock
                                  ? Colors.amber.shade800
                                  : Colors.green,
                            ),
                          ),
                          if (isOut)
                            const Card(
                              color: Colors.red,
                              margin: EdgeInsets.only(left: 8),
                              child: Padding(
                                padding: EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                child: Text(
                                  'Out',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            )
                          else if (isLowStock)
                            const Card(
                              color: Colors.amber,
                              margin: EdgeInsets.only(left: 8),
                              child: Padding(
                                padding: EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                child: Text(
                                  'Low',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    DataCell(Text('${prod.lowStockAlert} ${prod.unit}')),
                    DataCell(
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(
                              Icons.edit_outlined,
                              color: Colors.blue,
                            ),
                            onPressed: () => _showAddEditDialog(prod),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.delete_outline,
                              color: Colors.red,
                            ),
                            onPressed: () => _confirmDelete(prod),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}
