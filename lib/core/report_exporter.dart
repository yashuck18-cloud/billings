import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../providers/db_provider.dart';

class ReportExporter {
  /// Generates a complete store performance PDF document
  static Future<Uint8List> generatePdfReport(DbProvider db, String businessName) async {
    final pdf = pw.Document();
    final today = DateFormat('dd MMM yyyy, hh:mm a').format(DateTime.now());

    final totalSales = db.invoices.fold(0.0, (sum, i) => sum + i.grandTotal);
    final totalCost = db.invoices.fold(0.0, (sum, i) => sum + i.items.fold(0.0, (s, item) => s + (item.purchasePrice * item.quantity)));
    final grossProfit = totalSales - totalCost;
    final totalInvoices = db.invoices.length;
    final lowStockCount = db.getLowStockCount();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        header: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text(
                  businessName.toUpperCase(),
                  style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: PdfColors.indigo900),
                ),
                pw.Text(
                  'EXECUTIVE SALES & INVENTORY REPORT',
                  style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.grey700),
                ),
              ],
            ),
            pw.SizedBox(height: 4),
            pw.Text('Generated: $today', style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600)),
            pw.Divider(thickness: 1, color: PdfColors.indigo200),
            pw.SizedBox(height: 10),
          ],
        ),
        footer: (context) => pw.Column(
          children: [
            pw.Divider(thickness: 0.5, color: PdfColors.grey400),
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text('ApexPOS Business Suite', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600)),
                pw.Text('Page ${context.pageNumber} of ${context.pagesCount}', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600)),
              ],
            ),
          ],
        ),
        build: (context) => [
          // Financial Summary Cards
          pw.Text('Financial Highlights', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 8),
          pw.Row(
            children: [
              _buildMetricBox('Total Sales', 'Rs.${totalSales.toStringAsFixed(2)}', PdfColors.blue800),
              pw.SizedBox(width: 10),
              _buildMetricBox('Est. Profit', 'Rs.${grossProfit.toStringAsFixed(2)}', PdfColors.green800),
              pw.SizedBox(width: 10),
              _buildMetricBox('Total Invoices', '$totalInvoices', PdfColors.purple800),
              pw.SizedBox(width: 10),
              _buildMetricBox('Low Stock Alert', '$lowStockCount', PdfColors.orange800),
            ],
          ),
          pw.SizedBox(height: 20),

          // Sales Ledger Table
          pw.Text('Recent Transaction History', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 8),
          pw.Table.fromTextArray(
            headerDecoration: const pw.BoxDecoration(color: PdfColors.indigo50),
            headerHeight: 25,
            cellHeight: 20,
            cellAlignments: {
              0: pw.Alignment.centerLeft,
              1: pw.Alignment.centerLeft,
              2: pw.Alignment.center,
              3: pw.Alignment.centerRight,
            },
            headers: ['Invoice #', 'Date & Time', 'Items', 'Grand Total'],
            data: db.invoices.take(15).map((inv) => [
              inv.invoiceNumber,
              DateFormat('dd-MM-yyyy hh:mm a').format(inv.dateTime),
              '${inv.items.length} items',
              'Rs.${inv.grandTotal.toStringAsFixed(2)}',
            ]).toList(),
            headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 9),
            cellStyle: const pw.TextStyle(fontSize: 9),
          ),
          pw.SizedBox(height: 20),

          // Inventory Summary Table
          pw.Text('Product Inventory Catalogue', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 8),
          pw.Table.fromTextArray(
            headerDecoration: const pw.BoxDecoration(color: PdfColors.grey100),
            headerHeight: 25,
            cellHeight: 20,
            cellAlignments: {
              0: pw.Alignment.centerLeft,
              1: pw.Alignment.center,
              2: pw.Alignment.centerRight,
              3: pw.Alignment.centerRight,
            },
            headers: ['Product Name', 'Stock Qty', 'Selling Price', 'Cost Price'],
            data: db.products.map((p) => [
              p.name,
              '${p.quantity} ${p.unit}',
              'Rs.${p.defaultSellingPrice.toStringAsFixed(2)}',
              'Rs.${p.purchasePrice.toStringAsFixed(2)}',
            ]).toList(),
            headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 9),
            cellStyle: const pw.TextStyle(fontSize: 9),
          ),
          pw.SizedBox(height: 20),

          // Customer Credit & Dues Table
          if (db.creditDues.isNotEmpty) ...[
            pw.Text('Customer Credit & Dues Ledger', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
            pw.SizedBox(height: 8),
            pw.Table.fromTextArray(
              headerDecoration: const pw.BoxDecoration(color: PdfColors.orange50),
              headerHeight: 25,
              cellHeight: 20,
              cellAlignments: {
                0: pw.Alignment.centerLeft,
                1: pw.Alignment.center,
                2: pw.Alignment.centerRight,
                3: pw.Alignment.center,
              },
              headers: ['Customer Name', 'Phone', 'Balance Due', 'Status'],
              data: db.creditDues.map((d) => [
                d.customerName,
                d.customerPhone.isNotEmpty ? d.customerPhone : 'N/A',
                'Rs.${d.dueAmount.toStringAsFixed(2)}',
                d.status,
              ]).toList(),
              headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 9),
              cellStyle: const pw.TextStyle(fontSize: 9),
            ),
          ],
        ],
      ),
    );

    return pdf.save();
  }

  static pw.Widget _buildMetricBox(String title, String value, PdfColor color) {
    return pw.Expanded(
      child: pw.Container(
        padding: const pw.EdgeInsets.all(10),
        decoration: pw.BoxDecoration(
          border: pw.Border.all(color: color, width: 1),
          borderRadius: const pw.BorderRadius.all(pw.Radius.circular(6)),
        ),
        child: pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(title, style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
            pw.SizedBox(height: 4),
            pw.Text(value, style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }

  /// Exports Excel / CSV data string for sales history, products, dues, and purchases
  static String generateCsvData(DbProvider db) {
    final buffer = StringBuffer();

    // Sales Section
    buffer.writeln('=== SALES INVOICES LEDGER ===');
    buffer.writeln('Invoice Number,Date Time,Items Count,Subtotal,Discount,Grand Total');
    for (var inv in db.invoices) {
      final dateStr = DateFormat('yyyy-MM-dd HH:mm').format(inv.dateTime);
      buffer.writeln('"${inv.invoiceNumber}","$dateStr",${inv.items.length},${inv.subTotal},${inv.discount},${inv.grandTotal}');
    }

    buffer.writeln('\n=== PRODUCTS CATALOGUE ===');
    buffer.writeln('Product Name,Unit,Stock Quantity,Selling Price,Purchase Price,Low Stock Alert');
    for (var p in db.products) {
      buffer.writeln('"${p.name}","${p.unit}",${p.quantity},${p.defaultSellingPrice},${p.purchasePrice},${p.lowStockAlert}');
    }

    buffer.writeln('\n=== CUSTOMER CREDIT & DUES LEDGER ===');
    buffer.writeln('Customer Name,Phone,Invoice Ref,Due Date,Total Amount,Due Amount,Status');
    for (var d in db.creditDues) {
      final dueDateStr = DateFormat('yyyy-MM-dd').format(d.dueDate);
      buffer.writeln('"${d.customerName}","${d.customerPhone}","${d.invoiceNumber}","$dueDateStr",${d.totalAmount},${d.dueAmount},"${d.status}"');
    }

    buffer.writeln('\n=== CANCELLED BILLS LEDGER ===');
    buffer.writeln('Invoice Number,Original Date,Cancelled Date,Reason,Amount');
    for (var c in db.cancelledInvoices) {
      final origDate = DateFormat('yyyy-MM-dd HH:mm').format(c.originalDateTime);
      final canDate = DateFormat('yyyy-MM-dd HH:mm').format(c.cancelledAt);
      buffer.writeln('"${c.invoiceNumber}","$origDate","$canDate","${c.cancellationReason}",${c.grandTotal}');
    }

    return buffer.toString();
  }

  /// Triggers Export PDF Preview & Download
  static Future<void> showExportPdfDialog(BuildContext context, DbProvider db, String businessName) async {
    final pdfBytes = await generatePdfReport(db, businessName);
    if (!context.mounted) return;

    await Printing.layoutPdf(
      onLayout: (format) => pdfBytes,
      name: 'Store-Report-${DateFormat('ddMMM').format(DateTime.now())}',
    );
  }

  /// Triggers Share Report via Native Share
  static Future<void> shareReport(BuildContext context, DbProvider db, String businessName) async {
    final pdfBytes = await generatePdfReport(db, businessName);
    await Printing.sharePdf(
      bytes: pdfBytes,
      filename: 'POS-Report-${DateFormat('yyyyMMdd').format(DateTime.now())}.pdf',
    );
  }

  /// Triggers Export Excel / CSV Dialog & Direct File Download / Share
  static void showExportExcelDialog(BuildContext context, DbProvider db) {
    final csvData = generateCsvData(db);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.table_chart_outlined, color: Theme.of(context).colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Export Excel / CSV'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Your store data formatted as an Excel / CSV spreadsheet ready for download or sharing:'),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              constraints: const BoxConstraints(maxHeight: 200),
              width: double.maxFinite,
              decoration: BoxDecoration(
                color: Colors.grey.shade900,
                borderRadius: BorderRadius.circular(8),
              ),
              child: SingleChildScrollView(
                child: Text(
                  csvData,
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.greenAccent),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          OutlinedButton.icon(
            icon: const Icon(Icons.copy, size: 16),
            label: const Text('Copy CSV'),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: csvData));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Excel / CSV data copied to clipboard!')),
              );
              Navigator.pop(context);
            },
          ),
          ElevatedButton.icon(
            icon: const Icon(Icons.download, size: 16),
            label: const Text('Download / Share Excel'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade700,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              final bytes = Uint8List.fromList(utf8.encode(csvData));
              Navigator.pop(context);
              await Printing.sharePdf(
                bytes: bytes,
                filename: 'ApexPOS-Data-${DateFormat('yyyyMMdd').format(DateTime.now())}.csv',
              );
            },
          ),
        ],
      ),
    );
  }
}
