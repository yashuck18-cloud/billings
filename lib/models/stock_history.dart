class StockHistory {
  final String id;
  final String productId;
  final String productName;
  final double quantityChanged;
  final String type; // 'ADD', 'SALE', 'ADJUSTMENT'
  final DateTime timestamp;
  final String note;

  StockHistory({
    required this.id,
    required this.productId,
    required this.productName,
    required this.quantityChanged,
    required this.type,
    required this.timestamp,
    this.note = '',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'productName': productName,
        'quantityChanged': quantityChanged,
        'type': type,
        'timestamp': timestamp.toIso8601String(),
        'note': note,
      };

  factory StockHistory.fromJson(Map<String, dynamic> json) => StockHistory(
        id: json['id'] as String,
        productId: json['productId'] as String,
        productName: json['productName'] as String,
        quantityChanged: (json['quantityChanged'] as num).toDouble(),
        type: json['type'] as String,
        timestamp: DateTime.parse(json['timestamp'] as String),
        note: json['note'] as String? ?? '',
      );
}
