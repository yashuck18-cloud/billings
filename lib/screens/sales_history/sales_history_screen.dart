import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:printing/printing.dart';
import '../../providers/db_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/invoice.dart';
import '../../core/invoice_generator.dart';

class SalesHistoryScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const SalesHistoryScreen({super.key, this.onOpenDrawer});

  @override
  State<SalesHistoryScreen> createState() => _SalesHistoryScreenState();
}

class _SalesHistoryScreenState extends State<SalesHistoryScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showInvoiceDetailsDialog(Invoice invoice) {
    final theme = Theme.of(context);
    final businessName =
        Provider.of<AuthProvider>(
          context,
          listen: false,
        ).currentUser?.businessName ??
        'ApexPOS';
    final dateStr = DateFormat('dd MMM yyyy, hh:mm a').format(invoice.dateTime);

    final screenWidth = MediaQuery.of(context).size.width;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Invoice details: ${invoice.invoiceNumber}'),
        content: SizedBox(
          width: screenWidth > 540 ? 500 : screenWidth * 0.9,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Date: $dateStr',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                if (invoice.notes.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text(
                    'Notes: ${invoice.notes}',
                    style: TextStyle(color: theme.colorScheme.onSurfaceVariant),
                  ),
                ],
                const Divider(height: 24),

                // Item Header
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Item Name',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    Text('Qty', style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(width: 24),
                    Text(
                      'Total',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Item Rows
                ...invoice.items.map(
                  (item) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.productName),
                              if (item.billingPrice != item.defaultPrice)
                                Text(
                                  'Price: ₹${item.billingPrice} (MRP: ₹${item.defaultPrice})',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Colors.amber,
                                  ),
                                ),
                              if (item.packName != null)
                                Text(
                                  'Pack: ${item.packName}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: theme.colorScheme.primary,
                                  ),
                                ),
                            ],
                          ),
                        ),
                        Text('${item.quantity} ${item.unit}'),
                        const SizedBox(width: 24),
                        Text('₹${item.total.toStringAsFixed(1)}'),
                      ],
                    ),
                  ),
                ),

                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Original Total (MRP):'),
                    Text('₹${invoice.originalSubTotal.toStringAsFixed(1)}'),
                  ],
                ),
                if (invoice.rateOverrideDiscount > 0) ...[
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Rate Override Discount:'),
                      Text(
                        '-₹${invoice.rateOverrideDiscount.toStringAsFixed(1)}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ],
                  ),
                ],
                if (invoice.discount > 0) ...[
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Additional Discount:'),
                      Text(
                        '-₹${invoice.discount.toStringAsFixed(1)}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ],
                  ),
                ],
                if (invoice.totalSavings > 0) ...[
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total Savings:',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      Text(
                        '₹${invoice.totalSavings.toStringAsFixed(1)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Grand Total (Actual):',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      '₹${invoice.grandTotal.toStringAsFixed(1)}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: Colors.indigo),
            tooltip: 'Share PDF',
            onPressed: () async {
              final pdfBytes = await InvoiceGenerator.generatePdf(
                invoice,
                businessName,
              );
              await Printing.sharePdf(
                bytes: pdfBytes,
                filename: 'Invoice-${invoice.invoiceNumber}.pdf',
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.print, color: Colors.indigo),
            tooltip: 'Reprint Invoice',
            onPressed: () async {
              final pdfBytes = await InvoiceGenerator.generatePdf(
                invoice,
                businessName,
              );
              await Printing.layoutPdf(
                onLayout: (format) => pdfBytes,
                name: 'Invoice-${invoice.invoiceNumber}',
              );
            },
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(Invoice invoice) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red),
            SizedBox(width: 8),
            Text('Delete Bill'),
          ],
        ),
        content: Text(
          'Are you sure you want to delete "${invoice.invoiceNumber}"? This will restore stock levels for all products included in this bill.',
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
              ).deleteInvoice(invoice.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Bill "${invoice.invoiceNumber}" deleted. Stock levels restored.',
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete & Refund Stock'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final theme = Theme.of(context);

    // Filter invoices by search query (invoice number or notes matching)
    final results = db.invoices.where((inv) {
      if (_searchQuery.isEmpty) return true;
      return inv.invoiceNumber.toLowerCase().contains(
            _searchQuery.toLowerCase(),
          ) ||
          inv.notes.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sales & Invoicing History'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextFormField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search invoice number or notes...',
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

          // Invoices list
          Expanded(
            child: results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.history_outlined,
                          size: 64,
                          color: theme.colorScheme.onSurfaceVariant.withValues(
                            alpha: 0.5,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text('No Invoices Found'),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: results.length,
                    itemBuilder: (context, idx) {
                      final invoice = results[idx];
                      final dateStr = DateFormat(
                        'dd MMM yyyy, hh:mm a',
                      ).format(invoice.dateTime);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          child: ListTile(
                            title: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    invoice.invoiceNumber,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  '₹${invoice.grandTotal.toStringAsFixed(1)}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: theme.colorScheme.primary,
                                  ),
                                ),
                              ],
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 4),
                                Text(
                                  'Date: $dateStr',
                                  style: const TextStyle(fontSize: 12),
                                ),
                                Text(
                                  '${invoice.items.length} items sold ${invoice.notes.isNotEmpty ? "• Note: ${invoice.notes}" : ""}',
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                            trailing: Wrap(
                              spacing: 0,
                              children: [
                                IconButton(
                                  constraints: const BoxConstraints(),
                                  padding: const EdgeInsets.all(8),
                                  icon: const Icon(
                                    Icons.visibility_outlined,
                                    color: Colors.blue,
                                    size: 20,
                                  ),
                                  tooltip: 'View Details',
                                  onPressed: () =>
                                      _showInvoiceDetailsDialog(invoice),
                                ),
                                IconButton(
                                  constraints: const BoxConstraints(),
                                  padding: const EdgeInsets.all(8),
                                  icon: const Icon(
                                    Icons.delete_sweep_outlined,
                                    color: Colors.red,
                                    size: 20,
                                  ),
                                  tooltip: 'Delete Invoice',
                                  onPressed: () => _confirmDelete(invoice),
                                ),
                              ],
                            ),
                            onTap: () => _showInvoiceDetailsDialog(invoice),
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
