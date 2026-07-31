import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/db_provider.dart';
import '../../models/product.dart';
import '../../core/theme.dart';

class InventoryScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const InventoryScreen({super.key, this.onOpenDrawer});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _showAddStockDialog(Product product) {
    final qtyController = TextEditingController();
    final noteController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add Stock: ${product.name}'),
        content: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Current Stock: ${product.quantity} ${product.unit}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: qtyController,
                  decoration: InputDecoration(
                    labelText: 'Quantity to Add',
                    suffixText: product.unit,
                  ),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Enter quantity';
                    }
                    final qty = double.tryParse(value);
                    if (qty == null || qty <= 0) {
                      return 'Enter a valid quantity (> 0)';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: noteController,
                  decoration: const InputDecoration(
                    labelText: 'Audit Note (Optional)',
                    hintText: 'e.g., Supplier delivery #45',
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
            onPressed: () {
              if (formKey.currentState!.validate()) {
                final qty = double.parse(qtyController.text);
                final note = noteController.text.trim();
                
                Provider.of<DbProvider>(context, listen: false).addStock(product.id, qty, note);
                Navigator.pop(context);
                
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Successfully added $qty ${product.unit} to ${product.name}!'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            child: const Text('Save Stock'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final results = db.searchProducts(_searchQuery);
    final theme = Theme.of(context);
    final isTablet = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inventory & Stock ledger'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.warehouse_outlined), text: 'Stock Levels'),
            Tab(icon: Icon(Icons.history_edu_outlined), text: 'Stock History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 1st Tab: Stock Levels
          Column(
            children: [
              // Search input
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: TextFormField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search stock levels...',
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
              ),

              // Product levels list
              Expanded(
                child: results.isEmpty
                    ? const Center(child: Text('No stock data found'))
                    : isTablet
                        ? _buildStockLevelsTabletGrid(results, theme)
                        : _buildStockLevelsMobileList(results, theme),
              ),
            ],
          ),

          // 2nd Tab: Stock History Ledger
          db.stockHistory.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.history_outlined, size: 64, color: theme.colorScheme.onSurfaceVariant.withOpacity(0.5)),
                      const SizedBox(height: 16),
                      Text('No stock ledger transactions yet.', style: theme.textTheme.titleMedium),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: db.stockHistory.length,
                  itemBuilder: (context, idx) {
                    final history = db.stockHistory[idx];
                    final dateStr = DateFormat('dd MMM yyyy, hh:mm a').format(history.timestamp);
                    
                    IconData icon;
                    Color color;
                    String prefix = '';
                    if (history.type == 'ADD') {
                      icon = Icons.add_circle_outline;
                      color = Colors.green;
                      prefix = '+';
                    } else if (history.type == 'SALE') {
                      icon = Icons.remove_circle_outline;
                      color = Colors.red;
                      prefix = ''; // negative value handles it
                    } else {
                      icon = Icons.edit_note_outlined;
                      color = Colors.blue;
                      prefix = history.quantityChanged >= 0 ? '+' : '';
                    }

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
                            color: isDark ? Colors.black.withOpacity(0.05) : Colors.grey.shade50,
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(icon, color: color, size: 20),
                        ),
                        title: Text(
                          history.productName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text(
                              'Change: $prefix${history.quantityChanged.toStringAsFixed(1)}',
                              style: const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            if (history.note.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                'Note: ${history.note}',
                                style: TextStyle(color: isDark ? Slate.shade400 : Slate.shade600, fontSize: 12),
                              ),
                            ],
                            const SizedBox(height: 6),
                            Text(
                              dateStr,
                              style: theme.textTheme.bodySmall?.copyWith(
                                fontSize: 10,
                                color: isDark ? Slate.shade500 : Slate.shade400,
                              ),
                            ),
                          ],
                        ),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            history.type,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: color,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
        ],
      ),
    );
  }

  Widget _buildStockLevelsMobileList(List<Product> list, ThemeData theme) {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: list.length,
      itemBuilder: (context, idx) {
        final product = list[idx];
        final isLowStock = product.quantity > 0 && product.quantity <= product.lowStockAlert;
        final isOut = product.quantity <= 0;

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
                color: isDark ? Colors.black.withOpacity(0.05) : Colors.grey.shade50,
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
                        product.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
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
                                  'Stock: ${product.quantity.toStringAsFixed(1)} ${product.unit}',
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
                ElevatedButton.icon(
                  onPressed: () => _showAddStockDialog(product),
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Add Stock'),
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    minimumSize: Size.zero,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStockLevelsTabletGrid(List<Product> list, ThemeData theme) {
    return GridView.builder(
      padding: const EdgeInsets.all(16.0),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 2.2,
      ),
      itemCount: list.length,
      itemBuilder: (context, idx) {
        final product = list[idx];
        final isLowStock = product.quantity > 0 && product.quantity <= product.lowStockAlert;
        final isOut = product.quantity <= 0;

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Text(
                          'Stock: ${product.quantity} ${product.unit}',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
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
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              child: Text('Out', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          )
                        else if (isLowStock)
                          const Card(
                            color: Colors.amber,
                            margin: EdgeInsets.only(left: 8),
                            child: Padding(
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              child: Text('Low', style: TextStyle(color: Colors.black, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                Align(
                  alignment: Alignment.bottomRight,
                  child: ElevatedButton.icon(
                    onPressed: () => _showAddStockDialog(product),
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('Add Stock'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
