import 'dart:typed_data';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import '../models/invoice.dart';
import 'storage.dart';

class InvoiceGenerator {
  static Future<Uint8List> generatePdf(
    Invoice invoice,
    String defaultBusinessName, {
    String address = '',
    String phone = '',
    String gstin = '',
    String paymentMode = 'Cash',
    String paperSize = '80mm',
  }) async {
    final pdf = pw.Document();
    final dateStr = DateFormat('dd-MM-yyyy hh:mm a').format(invoice.dateTime);
    final cfg = StorageService.getReceiptConfig();

    final storeName = (cfg['storeName']?.toString().isNotEmpty == true)
        ? cfg['storeName'].toString()
        : defaultBusinessName;
    final tagline = cfg['tagline']?.toString() ?? '';
    final storeAddress = address.isNotEmpty ? address : (cfg['address']?.toString() ?? '');
    final storePhone = phone.isNotEmpty ? phone : (cfg['phone']?.toString() ?? '');
    final storeGstin = gstin.isNotEmpty ? gstin : (cfg['gstin']?.toString() ?? '');
    final receiptTitle = cfg['receiptTitle']?.toString() ?? 'TAX INVOICE';
    final invoicePrefix = cfg['invoicePrefix']?.toString() ?? 'INV-';
    final footerNote = cfg['footerNote']?.toString() ?? 'Thank you for shopping with us! Visit again.';
    final refundPolicy = cfg['refundPolicy']?.toString() ?? '';
    final termsConditions = cfg['termsConditions']?.toString() ?? '';

    // Labels
    final lblItem = cfg['lblItem']?.toString() ?? 'Item';
    final lblQty = cfg['lblQty']?.toString() ?? 'Qty';
    final lblRate = cfg['lblRate']?.toString() ?? 'Rate';
    final lblAmount = cfg['lblAmount']?.toString() ?? 'Amount';
    final lblSubtotal = cfg['lblSubtotal']?.toString() ?? 'Subtotal';
    final lblTax = cfg['lblTax']?.toString() ?? 'GST Tax';
    final lblDiscount = cfg['lblDiscount']?.toString() ?? 'Discount';
    final lblGrandTotal = cfg['lblGrandTotal']?.toString() ?? 'Grand Total';
    final lblPaymentMode = cfg['lblPaymentMode']?.toString() ?? 'Payment Mode';

    final effectivePaperSize = cfg['paperSize']?.toString() ?? paperSize;
    final showTagline = cfg['showTagline'] != false;
    final showAddress = cfg['showAddress'] != false;
    final showPhone = cfg['showPhone'] != false;
    final showGstin = cfg['showGstin'] != false;
    final showGstBreakup = cfg['showGstBreakup'] != false;
    final showBarcode = cfg['showBarcode'] != false;
    final showQrCode = cfg['showQrCode'] != false;
    final showFooter = cfg['showFooter'] != false;
    final showRefundPolicy = cfg['showRefundPolicy'] == true;
    final showTerms = cfg['showTerms'] == true;
    final qrData = cfg['qrData']?.toString() ?? 'upi://pay?pa=store@upi';

    // Calculate Tax amounts dynamically
    final double netBeforeTax = invoice.subTotal - invoice.discount;
    final double computedTax = invoice.grandTotal > netBeforeTax ? (invoice.grandTotal - netBeforeTax) : 0.0;
    final double halfTax = computedTax / 2.0;

    PdfPageFormat pageFormat;
    if (effectivePaperSize == '58mm') {
      pageFormat = PdfPageFormat(
        58 * PdfPageFormat.mm,
        (180 + invoice.items.length * 16) * PdfPageFormat.mm,
        marginAll: 6,
      );
    } else if (effectivePaperSize == 'A4') {
      pageFormat = PdfPageFormat.a4.copyWith(
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
      );
    } else if (effectivePaperSize == 'A5') {
      pageFormat = PdfPageFormat.a5.copyWith(
        marginBottom: 15,
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
      );
    } else {
      // Default 80mm
      pageFormat = PdfPageFormat(
        80 * PdfPageFormat.mm,
        (170 + invoice.items.length * 15) * PdfPageFormat.mm,
        marginAll: 10,
      );
    }

    pdf.addPage(
      pw.Page(
        pageFormat: pageFormat,
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.stretch,
            children: [
              // Business Header
              pw.Text(
                storeName.toUpperCase(),
                textAlign: pw.TextAlign.center,
                style: pw.TextStyle(
                  fontSize: 14,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              if (showTagline && tagline.isNotEmpty)
                pw.Text(tagline, textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
              if (showAddress && storeAddress.isNotEmpty)
                pw.Text(storeAddress, textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
              if (showPhone && storePhone.isNotEmpty)
                pw.Text('Phone: $storePhone', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
              if (showGstin && storeGstin.isNotEmpty)
                pw.Text('GSTIN: $storeGstin', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
              pw.SizedBox(height: 6),

              // Title Header Banner
              pw.Text(
                receiptTitle.toUpperCase(),
                textAlign: pw.TextAlign.center,
                style: pw.TextStyle(
                  fontSize: 11,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              pw.SizedBox(height: 4),
              () {
                final displayInvNo = (invoice.invoiceNumber.startsWith(invoicePrefix) ||
                        invoice.invoiceNumber.startsWith('INV-') ||
                        invoice.invoiceNumber.startsWith('PREVIEW-'))
                    ? invoice.invoiceNumber
                    : '$invoicePrefix${invoice.invoiceNumber}';
                return pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Expanded(
                      child: pw.Text(
                        'Invoice No: $displayInvNo',
                        style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold),
                      ),
                    ),
                    pw.SizedBox(width: 6),
                    pw.Text(
                      'Date: $dateStr',
                      style: const pw.TextStyle(fontSize: 8),
                    ),
                  ],
                );
              }(),
              if (invoice.notes.isNotEmpty)
                pw.Text(invoice.notes, style: const pw.TextStyle(fontSize: 8)),
              pw.SizedBox(height: 4),

              // Dashed Line
              pw.Text('---------------------------------------------------------', style: const pw.TextStyle(fontSize: 8)),

              // Table Header
              pw.Padding(
                padding: const pw.EdgeInsets.symmetric(vertical: 2),
                child: pw.Row(
                  children: [
                    pw.Expanded(flex: 4, child: pw.Text(lblItem, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 8))),
                    pw.Expanded(flex: 2, child: pw.Text(lblQty, textAlign: pw.TextAlign.center, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 8))),
                    pw.Expanded(flex: 3, child: pw.Text(lblRate, textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 8))),
                    pw.Expanded(flex: 3, child: pw.Text(lblAmount, textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 8))),
                  ],
                ),
              ),

              // Dashed Line
              pw.Text('---------------------------------------------------------', style: const pw.TextStyle(fontSize: 8)),

              // Items List
              ...invoice.items.map((item) {
                final qtyStr = item.quantity % 1 == 0 ? item.quantity.toInt().toString() : item.quantity.toString();
                return pw.Padding(
                  padding: const pw.EdgeInsets.symmetric(vertical: 1.5),
                  child: pw.Row(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Expanded(flex: 4, child: pw.Text(item.productName, style: const pw.TextStyle(fontSize: 8))),
                      pw.Expanded(flex: 2, child: pw.Text(qtyStr, textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8))),
                      pw.Expanded(flex: 3, child: pw.Text('Rs.${item.billingPrice.toStringAsFixed(2)}', textAlign: pw.TextAlign.right, style: const pw.TextStyle(fontSize: 8))),
                      pw.Expanded(flex: 3, child: pw.Text('Rs.${item.total.toStringAsFixed(2)}', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                    ],
                  ),
                );
              }),

              // Dashed Line
              pw.Text('---------------------------------------------------------', style: const pw.TextStyle(fontSize: 8)),

              // Subtotal & Taxes
              _buildPdfTotalRow(lblSubtotal, 'Rs.${invoice.subTotal.toStringAsFixed(2)}'),
              if (showGstBreakup) ...[
                _buildPdfTotalRow('CGST (2.5%)', 'Rs.${halfTax.toStringAsFixed(2)}'),
                _buildPdfTotalRow('SGST (2.5%)', 'Rs.${halfTax.toStringAsFixed(2)}'),
              ] else ...[
                _buildPdfTotalRow(lblTax, 'Rs.${computedTax.toStringAsFixed(2)}'),
              ],
              if (invoice.discount > 0)
                _buildPdfTotalRow(lblDiscount, '-Rs.${invoice.discount.toStringAsFixed(2)}'),
              pw.SizedBox(height: 2),
              _buildPdfTotalRow(lblGrandTotal, 'Rs.${invoice.grandTotal.toStringAsFixed(2)}', isBold: true),

              // Dashed Line
              pw.Text('---------------------------------------------------------', style: const pw.TextStyle(fontSize: 8)),
              pw.SizedBox(height: 4),

              // Payment Mode
              pw.Text('$lblPaymentMode: $paymentMode', style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 6),

              // UPI QR Code
              if (showQrCode && qrData.isNotEmpty) ...[
                pw.Center(
                  child: pw.Column(
                    children: [
                      pw.BarcodeWidget(
                        barcode: pw.Barcode.qrCode(),
                        data: qrData,
                        width: 50,
                        height: 50,
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text('Scan & Pay via UPI', style: const pw.TextStyle(fontSize: 6)),
                    ],
                  ),
                ),
                pw.SizedBox(height: 6),
              ],

              // Barcode
              if (showBarcode) ...[
                () {
                  final sanitizedBarcode = invoice.invoiceNumber.replaceAll(RegExp(r'[^a-zA-Z0-9\-]'), '');
                  final validBarcode = sanitizedBarcode.isNotEmpty ? sanitizedBarcode : 'INV1001';
                  return pw.Center(
                    child: pw.BarcodeWidget(
                      barcode: pw.Barcode.code128(),
                      data: validBarcode,
                      width: 140,
                      height: 26,
                    ),
                  );
                }(),
                pw.SizedBox(height: 6),
              ],

              // Footer Notes & Policy
              if (showFooter && footerNote.isNotEmpty)
                pw.Text(footerNote, textAlign: pw.TextAlign.center, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold)),
              if (showRefundPolicy && refundPolicy.isNotEmpty)
                pw.Text('Policy: $refundPolicy', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 7)),
              if (showTerms && termsConditions.isNotEmpty)
                pw.Text('Terms: $termsConditions', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 7)),
            ],
          );
        },
      ),
    );

    try {
      return await pdf.save();
    } catch (e) {
      // Fallback safe document generator in case of any pdf compilation engine issue
      final fallbackPdf = pw.Document();
      fallbackPdf.addPage(
        pw.Page(
          pageFormat: pageFormat,
          build: (pw.Context ctx) {
            return pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.center,
              children: [
                pw.Text(storeName.toUpperCase(), style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
                pw.SizedBox(height: 8),
                pw.Text('INVOICE: ${invoice.invoiceNumber}', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                pw.SizedBox(height: 8),
                ...invoice.items.map((it) => pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text(it.productName, style: const pw.TextStyle(fontSize: 9)),
                    pw.Text('Rs.${it.total.toStringAsFixed(2)}', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
                  ],
                )),
                pw.Divider(),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Grand Total', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                    pw.Text('Rs.${invoice.grandTotal.toStringAsFixed(2)}', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                  ],
                ),
                pw.SizedBox(height: 12),
                pw.Text(footerNote, style: const pw.TextStyle(fontSize: 8)),
              ],
            );
          },
        ),
      );
      return await fallbackPdf.save();
    }
  }

  static pw.Widget _buildPdfTotalRow(String label, String value, {bool isBold = false}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 1),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(label, style: pw.TextStyle(fontSize: 8, fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal)),
          pw.Text(value, style: pw.TextStyle(fontSize: isBold ? 9 : 8, fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal)),
        ],
      ),
    );
  }
}
