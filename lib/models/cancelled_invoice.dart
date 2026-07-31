import 'dart:convert';

class CancelledInvoice {
  final String id;
  final String invoiceNumber;
  final DateTime originalDateTime;
  final DateTime cancelledAt;
  final String cancellationReason;
  final double grandTotal;
  final int itemsCount;
  final Map<String, dynamic> invoiceJson;

  CancelledInvoice({
    required this.id,
    required this.invoiceNumber,
    required this.originalDateTime,
    required this.cancelledAt,
    required this.cancellationReason,
    required this.grandTotal,
    required this.itemsCount,
    required this.invoiceJson,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'invoiceNumber': invoiceNumber,
      'originalDateTime': originalDateTime.toIso8601String(),
      'cancelledAt': cancelledAt.toIso8601String(),
      'cancellationReason': cancellationReason,
      'grandTotal': grandTotal,
      'itemsCount': itemsCount,
      'invoiceJson': invoiceJson,
    };
  }

  factory CancelledInvoice.fromJson(Map<String, dynamic> json) {
    return CancelledInvoice(
      id: json['id'] as String,
      invoiceNumber: json['invoiceNumber'] as String,
      originalDateTime: DateTime.parse(json['originalDateTime'] as String),
      cancelledAt: DateTime.parse(json['cancelledAt'] as String),
      cancellationReason: json['cancellationReason'] as String? ?? 'Cancelled by User',
      grandTotal: (json['grandTotal'] as num).toDouble(),
      itemsCount: (json['itemsCount'] as num).toInt(),
      invoiceJson: json['invoiceJson'] is Map<String, dynamic>
          ? json['invoiceJson'] as Map<String, dynamic>
          : jsonDecode(json['invoiceJson'] as String) as Map<String, dynamic>,
    );
  }
}
