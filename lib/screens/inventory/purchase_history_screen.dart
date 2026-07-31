import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/db_provider.dart';
import '../../models/purchase_entry.dart';
import '../../models/product.dart';

class PurchaseHistoryScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const PurchaseHistoryScreen({
    super.key,
    this.onOpenDrawer,
  });

  @override
  State<PurchaseHistoryScreen> createState() => _PurchaseHistoryScreenState();
}

class _PurchaseHistoryScreenState extends State<PurchaseHistoryScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddPurchaseDialog(BuildContext context, DbProvider db) {
    if (db.products.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add products to your catalogue first before recording purchases.')),
      );
      return;
    }

    Product selectedProduct = db.products.first;
    final qtyController = TextEditingController(text: '10');
    final priceController = TextEditingController(text: selectedProduct.purchasePrice.toString());
    final supplierController = TextEditingController(text: 'General Wholesale Supplier');
    final notesController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setStateDialog) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.add_shopping_cart, color: Colors.indigo),
              SizedBox(width: 8),
              Text('Record Stock Purchase'),
            ],
          ),
          content: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Select Product:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  DropdownButtonFormField<Product>(
                    value: selectedProduct,
                    isExpanded: true,
                    decoration: const InputDecoration(border: OutlineInputBorder()),
                    items: db.products
                        .map((p) => DropdownMenuItem<Product>(
                              value: p,
                              child: Text('${p.name} (Stock: ${p.quantity} ${p.unit})'),
                            ))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setStateDialog(() {
                          selectedProduct = val;
                          priceController.text = val.purchasePrice.toString();
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: qtyController,
                          decoration: InputDecoration(
                            labelText: 'Purchase Qty',
                            suffixText: selectedProduct.unit,
                          ),
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) return 'Enter quantity';
                            final q = double.tryParse(v);
                            if (q == null || q <= 0) return 'Invalid qty';
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextFormField(
                          controller: priceController,
                          decoration: const InputDecoration(
                            labelText: 'Cost / Unit (₹)',
                          ),
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) return 'Enter price';
                            final p = double.tryParse(v);
                            if (p == null || p < 0) return 'Invalid cost';
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: supplierController,
                    decoration: const InputDecoration(
                      labelText: 'Vendor / Supplier Name',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: notesController,
                    decoration: const InputDecoration(
                      labelText: 'Batch / Invoice Reference Notes',
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
            ElevatedButton.icon(
              icon: const Icon(Icons.check),
              label: const Text('Save Purchase Entry'),
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  final qty = double.parse(qtyController.text.trim());
                  final price = double.parse(priceController.text.trim());
                  final entry = PurchaseEntry(
                    id: 'pur_${DateTime.now().millisecondsSinceEpoch}',
                    productId: selectedProduct.id,
                    productName: selectedProduct.name,
                    quantity: qty,
                    purchasePrice: price,
                    totalAmount: qty * price,
                    supplierName: supplierController.text.trim().isEmpty ? 'General Supplier' : supplierController.text.trim(),
                    timestamp: DateTime.now(),
                    note: notesController.text.trim(),
                  );

                  db.addPurchaseEntry(entry);
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Recorded purchase of $qty ${selectedProduct.unit} for ${selectedProduct.name}!'),
                      backgroundColor: Colors.green.shade700,
                    ),
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final theme = Theme.of(context);

    final results = db.purchaseEntries.where((p) {
      if (_searchQuery.isEmpty) return true;
      return p.productName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.supplierName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.note.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    final totalPurchaseExpenditure = db.purchaseEntries.fold(0.0, (sum, p) => sum + p.totalAmount);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Purchase & Stock Inward Ledger'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'fab_purchase_history_screen',
        onPressed: () => _showAddPurchaseDialog(context, db),
        icon: const Icon(Icons.add_shopping_cart),
        label: const Text('Record Purchase'),
      ),
      body: Column(
        children: [
          // Summary Header
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.indigo.withOpacity(0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.indigo.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Total Purchase Expenditure',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.indigo),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '₹${totalPurchaseExpenditure.toStringAsFixed(1)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.indigo),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text('Purchase Entries', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(
                        '${db.purchaseEntries.length} Batches',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: TextFormField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search product, supplier, or reference notes...',
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
          const SizedBox(height: 12),

          // Purchase list
          Expanded(
            child: results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.inventory_outlined,
                          size: 64,
                          color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                        ),
                        const SizedBox(height: 16),
                        const Text('No Purchase Entries Recorded Yet'),
                        const SizedBox(height: 8),
                        ElevatedButton.icon(
                          onPressed: () => _showAddPurchaseDialog(context, db),
                          icon: const Icon(Icons.add),
                          label: const Text('Record First Purchase Batch'),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: results.length,
                    itemBuilder: (context, idx) {
                      final item = results[idx];
                      final dateStr = DateFormat('dd MMM yyyy, hh:mm a').format(item.timestamp);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        child: ListTile(
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                item.productName,
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'Total: ₹${item.totalAmount.toStringAsFixed(1)}',
                                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                              ),
                            ],
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text('Quantity: ${item.quantity} • Cost/Unit: ₹${item.purchasePrice}'),
                              Text('Vendor: ${item.supplierName}'),
                              Text('Date: $dateStr ${item.note.isNotEmpty ? "• Note: ${item.note}" : ""}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
