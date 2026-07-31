class Product {
  final String id;
  final String name;
  final String categoryId;
  final String? brand;
  final String unit; // Piece, Kg, Litre, Box, Pack, etc.
  final double quantity; // Current stock level
  final double defaultSellingPrice;
  final double purchasePrice; // Purchase cost to calculate profit
  final double lowStockAlert; // Minimum stock alert threshold
  final double? maxStockLimit; // Maximum stock limit
  final String? barcode;

  Product({
    required this.id,
    required this.name,
    required this.categoryId,
    this.brand,
    required this.unit,
    required this.quantity,
    required this.defaultSellingPrice,
    required this.purchasePrice,
    required this.lowStockAlert,
    this.maxStockLimit,
    this.barcode,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'categoryId': categoryId,
        'brand': brand,
        'unit': unit,
        'quantity': quantity,
        'defaultSellingPrice': defaultSellingPrice,
        'purchasePrice': purchasePrice,
        'lowStockAlert': lowStockAlert,
        'maxStockLimit': maxStockLimit,
        'barcode': barcode,
      };

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'] as String,
        name: json['name'] as String,
        categoryId: json['categoryId'] as String,
        brand: json['brand'] as String?,
        unit: json['unit'] as String,
        quantity: (json['quantity'] as num).toDouble(),
        defaultSellingPrice: (json['defaultSellingPrice'] as num).toDouble(),
        purchasePrice: (json['purchasePrice'] as num?)?.toDouble() ?? ((json['defaultSellingPrice'] as num).toDouble() * 0.75),
        lowStockAlert: (json['lowStockAlert'] as num).toDouble(),
        maxStockLimit: (json['maxStockLimit'] as num?)?.toDouble(),
        barcode: json['barcode'] as String?,
      );

  Product copyWith({
    String? id,
    String? name,
    String? categoryId,
    String? brand,
    String? unit,
    double? quantity,
    double? defaultSellingPrice,
    double? purchasePrice,
    double? lowStockAlert,
    double? maxStockLimit,
    String? barcode,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      categoryId: categoryId ?? this.categoryId,
      brand: brand ?? this.brand,
      unit: unit ?? this.unit,
      quantity: quantity ?? this.quantity,
      defaultSellingPrice: defaultSellingPrice ?? this.defaultSellingPrice,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      lowStockAlert: lowStockAlert ?? this.lowStockAlert,
      maxStockLimit: maxStockLimit ?? this.maxStockLimit,
      barcode: barcode ?? this.barcode,
    );
  }
}
