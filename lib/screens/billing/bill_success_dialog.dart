import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:printing/printing.dart';
import '../../models/invoice.dart';
import '../../providers/auth_provider.dart';
import '../../core/invoice_generator.dart';

class InvoicePreviewDialog extends StatelessWidget {
  final Invoice invoice;
  final String businessName;

  const InvoicePreviewDialog({
    super.key,
    required this.invoice,
    required this.businessName,
  });

  static void show(BuildContext context, Invoice invoice, String businessName) {
    showDialog(
      context: context,
      builder: (ctx) => InvoicePreviewDialog(
        invoice: invoice,
        businessName: businessName,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 850, maxHeight: 750),
        child: Column(
          children: [
            // Header Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 14.0),
              child: Row(
                children: [
                  Icon(Icons.receipt_long_outlined, color: theme.colorScheme.primary),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Invoice Preview (${invoice.invoiceNumber})',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.close),
                    tooltip: 'Close Preview',
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            // Live Interactive PDF Invoice Preview
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
                child: PdfPreview(
                  build: (format) => InvoiceGenerator.generatePdf(
                    invoice,
                    businessName,
                  ),
                  allowPrinting: true,
                  allowSharing: true,
                  canChangeOrientation: false,
                  canChangePageFormat: false,
                  loadingWidget: const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 12),
                        Text('Generating Thermal Receipt...', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                      ],
                    ),
                  ),
                  onError: (context, error) {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.receipt_long, size: 64, color: Colors.blue),
                            const SizedBox(height: 12),
                            Text('Invoice: ${invoice.invoiceNumber}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            Text('Total Amount: ₹${invoice.grandTotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 14, color: Colors.green, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 16),
                            ElevatedButton.icon(
                              onPressed: () async {
                                final pdfBytes = await InvoiceGenerator.generatePdf(invoice, businessName);
                                await Printing.layoutPdf(onLayout: (format) => pdfBytes);
                              },
                              icon: const Icon(Icons.print),
                              label: const Text('Print Bill Receipt'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class BillSuccessDialog extends StatelessWidget {
  final Invoice invoice;

  const BillSuccessDialog({super.key, required this.invoice});

  void _previewInvoice(BuildContext context, String businessName) {
    InvoicePreviewDialog.show(context, invoice, businessName);
  }

  void _printInvoice(BuildContext context, String businessName) async {
    try {
      final pdfBytes = await InvoiceGenerator.generatePdf(
        invoice,
        businessName,
      );
      await Printing.layoutPdf(
        onLayout: (format) => pdfBytes,
        name: 'Invoice-${invoice.invoiceNumber}',
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to trigger print: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _sharePdf(BuildContext context, String businessName) async {
    try {
      final pdfBytes = await InvoiceGenerator.generatePdf(
        invoice,
        businessName,
      );
      await Printing.sharePdf(
        bytes: pdfBytes,
        filename: 'Invoice-${invoice.invoiceNumber}.pdf',
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to share PDF: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final businessName =
        Provider.of<AuthProvider>(context).currentUser?.businessName ??
        'ApexPOS';

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 420),
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Success Icon Banner
            CircleAvatar(
              radius: 36,
              backgroundColor: Colors.green.withOpacity(0.15),
              child: const Icon(
                Icons.check_circle_outline,
                color: Colors.green,
                size: 48,
              ),
            ),
            const SizedBox(height: 16),

            Text(
              'Bill Saved & Completed!',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),

            Text(
              'Invoice: ${invoice.invoiceNumber}',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),

            Text(
              'Total: ₹${invoice.grandTotal.toStringAsFixed(1)}',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),

            // Preview Invoice Action
            OutlinedButton.icon(
              onPressed: () => _previewInvoice(context, businessName),
              icon: const Icon(Icons.visibility_outlined),
              label: const Text('Preview Invoice'),
              style: OutlinedButton.styleFrom(
                foregroundColor: theme.colorScheme.primary,
                side: BorderSide(color: theme.colorScheme.primary, width: 1.5),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
            const SizedBox(height: 10),

            // Print Action
            ElevatedButton.icon(
              onPressed: () => _printInvoice(context, businessName),
              icon: const Icon(Icons.print),
              label: const Text('Print Receipt (Thermal / A4)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: theme.colorScheme.onPrimary,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
            const SizedBox(height: 10),

            // Share Action
            OutlinedButton.icon(
              onPressed: () => _sharePdf(context, businessName),
              icon: const Icon(Icons.share),
              label: const Text('Share PDF Receipt'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
            const SizedBox(height: 16),

            const Divider(),
            const SizedBox(height: 4),

            // Done/Close Button
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'Done & Close',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
