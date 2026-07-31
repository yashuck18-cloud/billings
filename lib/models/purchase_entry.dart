class PurchaseEntry {
  final String id;
  final String productId;
  final String productName;
  final double quantity;
  final double purchasePrice;
  final double totalAmount;
  final String supplierName;
  final DateTime timestamp;
  final String note;

  PurchaseEntry({
    required this.id,
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.purchasePrice,
    required this.totalAmount,
    required this.supplierName,
    required this.timestamp,
    required this.note,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'productName': productName,
      'quantity': quantity,
      'purchasePrice': purchasePrice,
      'totalAmount': totalAmount,
      'supplierName': supplierName,
      'timestamp': timestamp.toIso8601String(),
      'note': note,
    };
  }

  factory PurchaseEntry.fromJson(Map<String, dynamic> json) {
    return PurchaseEntry(
      id: json['id'] as String,
      productId: json['productId'] as String,
      productName: json['productName'] as String,
      quantity: (json['quantity'] as num).toDouble(),
      purchasePrice: (json['purchasePrice'] as num).toDouble(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      supplierName: json['supplierName'] as String? ?? 'General Supplier',
      timestamp: DateTime.parse(json['timestamp'] as String),
      note: json['note'] as String? ?? '',
    );
  }
}
