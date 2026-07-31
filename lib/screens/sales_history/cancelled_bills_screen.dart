import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/db_provider.dart';
import '../../models/cancelled_invoice.dart';

class CancelledBillsScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const CancelledBillsScreen({
    super.key,
    this.onOpenDrawer,
  });

  @override
  State<CancelledBillsScreen> createState() => _CancelledBillsScreenState();
}

class _CancelledBillsScreenState extends State<CancelledBillsScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _confirmRestore(CancelledInvoice item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.restore_page_outlined, color: Colors.blue),
            SizedBox(width: 8),
            Text('Restore Cancelled Bill'),
          ],
        ),
        content: Text(
          'Are you sure you want to restore invoice "${item.invoiceNumber}"? This will move it back to active sales and deduct product stock accordingly.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Provider.of<DbProvider>(context, listen: false).restoreCancelledInvoice(item.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Invoice "${item.invoiceNumber}" restored to active sales history!'),
                  backgroundColor: Colors.green.shade700,
                ),
              );
            },
            child: const Text('Restore Bill'),
          ),
        ],
      ),
    );
  }

  void _confirmPermanentDelete(CancelledInvoice item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.delete_forever, color: Colors.red),
            SizedBox(width: 8),
            Text('Delete Permanently'),
          ],
        ),
        content: Text(
          'Permanently remove record of cancelled bill "${item.invoiceNumber}"? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Provider.of<DbProvider>(context, listen: false).deleteCancelledInvoicePermanently(item.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Cancelled bill record "${item.invoiceNumber}" permanently deleted.'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Delete Permanently'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final theme = Theme.of(context);

    final results = db.cancelledInvoices.where((c) {
      if (_searchQuery.isEmpty) return true;
      return c.invoiceNumber.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          c.cancellationReason.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    final totalCancelledAmount = db.cancelledInvoices.fold(0.0, (sum, c) => sum + c.grandTotal);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cancelled Bills Ledger'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
      ),
      body: Column(
        children: [
          // Header summary card
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.red.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Total Cancelled Value',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.red),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '₹${totalCancelledAmount.toStringAsFixed(1)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.red),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text('Total Cancelled Bills', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(
                        '${db.cancelledInvoices.length} Bills',
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
                hintText: 'Search cancelled invoice number or reason...',
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

          // Cancelled bills list
          Expanded(
            child: results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.cancel_outlined,
                          size: 64,
                          color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                        ),
                        const SizedBox(height: 16),
                        const Text('No Cancelled Bills Recorded'),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: results.length,
                    itemBuilder: (context, idx) {
                      final item = results[idx];
                      final origDateStr = DateFormat('dd MMM yyyy, hh:mm a').format(item.originalDateTime);
                      final canDateStr = DateFormat('dd MMM yyyy, hh:mm a').format(item.cancelledAt);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        child: ListTile(
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                item.invoiceNumber,
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '₹${item.grandTotal.toStringAsFixed(1)}',
                                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
                              ),
                            ],
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text('Original Date: $origDateStr', style: const TextStyle(fontSize: 12)),
                              Text('Cancelled At: $canDateStr', style: const TextStyle(fontSize: 12, color: Colors.redAccent)),
                              Text('Reason: ${item.cancellationReason}', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic)),
                            ],
                          ),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.restore, color: Colors.green),
                                tooltip: 'Restore Bill',
                                onPressed: () => _confirmRestore(item),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete_forever, color: Colors.red),
                                tooltip: 'Delete Permanently',
                                onPressed: () => _confirmPermanentDelete(item),
                              ),
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
