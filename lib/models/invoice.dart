class InvoiceItem {
  final String productId;
  final String productName;
  final String unit;
  final double defaultPrice;
  final double billingPrice; // Might differ from defaultPrice for this invoice only
  final double purchasePrice; // Cost price at the time of sale
  final double quantity;
  final String billingMethod; // 'QUANTITY', 'AMOUNT', 'FIXED_PACK'
  final String? packName; // e.g., '250 g Pack' if billingMethod is FIXED_PACK
  final double total;

  InvoiceItem({
    required this.productId,
    required this.productName,
    required this.unit,
    required this.defaultPrice,
    required this.billingPrice,
    required this.purchasePrice,
    required this.quantity,
    required this.billingMethod,
    this.packName,
    required this.total,
  });

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'productName': productName,
        'unit': unit,
        'defaultPrice': defaultPrice,
        'billingPrice': billingPrice,
        'purchasePrice': purchasePrice,
        'quantity': quantity,
        'billingMethod': billingMethod,
        'packName': packName,
        'total': total,
      };

  factory InvoiceItem.fromJson(Map<String, dynamic> json) => InvoiceItem(
        productId: json['productId'] as String,
        productName: json['productName'] as String,
        unit: json['unit'] as String,
        defaultPrice: (json['defaultPrice'] as num).toDouble(),
        billingPrice: (json['billingPrice'] as num).toDouble(),
        purchasePrice: (json['purchasePrice'] as num?)?.toDouble() ?? ((json['defaultPrice'] as num).toDouble() * 0.75),
        quantity: (json['quantity'] as num).toDouble(),
        billingMethod: json['billingMethod'] as String,
        packName: json['packName'] as String?,
        total: (json['total'] as num).toDouble(),
      );
}

class Invoice {
  final String id;
  final String invoiceNumber;
  final DateTime dateTime;
  final List<InvoiceItem> items;
  final double subTotal;
  final double discount;
  final double grandTotal;
  final String notes;

  Invoice({
    required this.id,
    required this.invoiceNumber,
    required this.dateTime,
    required this.items,
    required this.subTotal,
    required this.discount,
    required this.grandTotal,
    this.notes = '',
  });

  // Original bill total at standard product prices
  double get originalSubTotal {
    return items.fold(0.0, (sum, item) => sum + (item.defaultPrice * item.quantity));
  }

  // Total discount given through manual unit price overrides
  double get rateOverrideDiscount {
    return items.fold(0.0, (sum, item) => sum + ((item.defaultPrice - item.billingPrice) * item.quantity));
  }

  // Total customer savings (rate override discounts + invoice-level discount)
  double get totalSavings {
    return rateOverrideDiscount + discount;
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'invoiceNumber': invoiceNumber,
        'dateTime': dateTime.toIso8601String(),
        'items': items.map((e) => e.toJson()).toList(),
        'subTotal': subTotal,
        'discount': discount,
        'grandTotal': grandTotal,
        'notes': notes,
      };

  factory Invoice.fromJson(Map<String, dynamic> json) => Invoice(
        id: json['id'] as String,
        invoiceNumber: json['invoiceNumber'] as String,
        dateTime: DateTime.parse(json['dateTime'] as String),
        items: (json['items'] as List<dynamic>)
            .map((e) => InvoiceItem.fromJson(e as Map<String, dynamic>))
            .toList(),
        subTotal: (json['subTotal'] as num).toDouble(),
        discount: (json['discount'] as num).toDouble(),
        grandTotal: (json['grandTotal'] as num).toDouble(),
        notes: json['notes'] as String? ?? '',
      );
}
