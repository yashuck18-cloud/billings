import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/invoice.dart';
import '../core/constants.dart';

class BillingProvider extends ChangeNotifier {
  final List<InvoiceItem> _cartItems = [];
  double _discount = 0.0;
  String _notes = '';
  
  // Callback to trigger UI Out Of Stock Popup
  void Function(Product product)? onOutOfStock;

  List<InvoiceItem> get cartItems => _cartItems;
  double get discount => _discount;
  String get notes => _notes;

  double get subTotal {
    return _cartItems.fold(0.0, (sum, item) => sum + item.total);
  }

  double get grandTotal {
    final total = subTotal - _discount;
    return total > 0 ? total : 0.0;
  }

  void setDiscount(double value) {
    _discount = value;
    notifyListeners();
  }

  void setNotes(String value) {
    _notes = value;
    notifyListeners();
  }

  // Add product with specific billing method and optional pack name or custom billing price
  bool addProduct(Product product, {
    double? customPrice,
    double qty = 1.0,
    String billingMethod = 'QUANTITY',
    String? packName,
  }) {
    // 1. Check if stock is zero or less
    if (product.quantity <= 0) {
      if (onOutOfStock != null) {
        onOutOfStock!(product);
      }
      return false;
    }

    final price = customPrice ?? product.defaultSellingPrice;
    
    // Check if item is already in cart
    final existingIndex = _cartItems.indexWhere((item) => item.productId == product.id && item.billingMethod == billingMethod && item.packName == packName);
    
    double newQty = qty;
    if (existingIndex != -1) {
      newQty = _cartItems[existingIndex].quantity + qty;
    }

    // Notify if new quantity exceeds recorded stock count (without blocking store owner)
    if (newQty > product.quantity && product.quantity > 0) {
      if (onOutOfStock != null) {
        onOutOfStock!(product);
      }
    }

    final itemTotal = price * newQty;

    if (existingIndex != -1) {
      _cartItems[existingIndex] = InvoiceItem(
        productId: product.id,
        productName: product.name,
        unit: product.unit,
        defaultPrice: product.defaultSellingPrice,
        billingPrice: price,
        purchasePrice: product.purchasePrice,
        quantity: newQty,
        billingMethod: billingMethod,
        packName: packName,
        total: itemTotal,
      );
    } else {
      _cartItems.add(InvoiceItem(
        productId: product.id,
        productName: product.name,
        unit: product.unit,
        defaultPrice: product.defaultSellingPrice,
        billingPrice: price,
        purchasePrice: product.purchasePrice,
        quantity: qty,
        billingMethod: billingMethod,
        packName: packName,
        total: itemTotal,
      ));
    }

    notifyListeners();
    return true;
  }

  // Edit quantity directly (e.g. from the cart UI)
  bool updateQuantity(String productId, double newQty, Product originalProduct) {
    if (newQty <= 0) {
      removeProduct(productId);
      return true;
    }

    if (newQty > originalProduct.quantity && originalProduct.quantity > 0) {
      if (onOutOfStock != null) {
        onOutOfStock!(originalProduct);
      }
    }

    final index = _cartItems.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      final item = _cartItems[index];

      _cartItems[index] = InvoiceItem(
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        defaultPrice: item.defaultPrice,
        billingPrice: item.billingPrice,
        purchasePrice: item.purchasePrice,
        quantity: newQty,
        billingMethod: item.billingMethod,
        packName: item.packName,
        total: item.billingPrice * newQty,
      );
      notifyListeners();
      return true;
    }
    return false;
  }

  // Edit both quantity and billing price directly
  bool updateQuantityAndPrice(String productId, double newQty, double newPrice, Product originalProduct) {
    if (newQty <= 0) {
      removeProduct(productId);
      return true;
    }

    if (newQty > originalProduct.quantity && originalProduct.quantity > 0) {
      if (onOutOfStock != null) {
        onOutOfStock!(originalProduct);
      }
    }

    final index = _cartItems.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      final item = _cartItems[index];

      _cartItems[index] = InvoiceItem(
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        defaultPrice: item.defaultPrice,
        billingPrice: newPrice,
        purchasePrice: item.purchasePrice,
        quantity: newQty,
        billingMethod: item.billingMethod,
        packName: item.packName,
        total: newPrice * newQty,
      );
      notifyListeners();
      return true;
    }
    return false;
  }
  void updateBillingPrice(String productId, double newPrice) {
    final index = _cartItems.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      final item = _cartItems[index];
      _cartItems[index] = InvoiceItem(
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        defaultPrice: item.defaultPrice,
        billingPrice: newPrice,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity,
        billingMethod: item.billingMethod,
        packName: item.packName,
        total: newPrice * item.quantity,
      );
      notifyListeners();
    }
  }

  // Custom billing method helper 1: Billing by Quantity (Weight/Units)
  bool billByQuantity(Product product, double quantity, {double? customPrice}) {
    return addProduct(
      product,
      qty: quantity,
      customPrice: customPrice,
      billingMethod: 'QUANTITY',
    );
  }

  // Custom billing method helper 2: Billing by Amount (calculating quantity from total paid)
  // Price = ₹80/Kg. Customer gives ₹40. Qty = 0.5 Kg.
  bool billByAmount(Product product, double amount, {double? customPrice}) {
    final price = customPrice ?? product.defaultSellingPrice;
    if (price <= 0) return false;
    final calculatedQty = double.parse((amount / price).toStringAsFixed(3));
    return addProduct(
      product,
      qty: calculatedQty,
      customPrice: price,
      billingMethod: 'AMOUNT',
    );
  }

  // Custom billing method helper 3: Fixed Pack Products
  // Adds pre-defined pack sizes
  bool billByFixedPack(Product product, String packName, {double? customPrice}) {
    final unitPacks = AppConstants.fixedPacks[product.unit];
    if (unitPacks == null || !unitPacks.containsKey(packName)) return false;
    final qtyMultiplier = unitPacks[packName]!;
    
    return addProduct(
      product,
      qty: qtyMultiplier,
      customPrice: customPrice,
      billingMethod: 'FIXED_PACK',
      packName: packName,
    );
  }

  void removeProduct(String productId) {
    _cartItems.removeWhere((item) => item.productId == productId);
    notifyListeners();
  }

  void clearCart() {
    _cartItems.clear();
    _discount = 0.0;
    _notes = '';
    notifyListeners();
  }

  Invoice generateInvoice(String invoiceNumber) {
    return Invoice(
      id: 'inv_${DateTime.now().millisecondsSinceEpoch}',
      invoiceNumber: invoiceNumber,
      dateTime: DateTime.now(),
      items: List.from(_cartItems),
      subTotal: subTotal,
      discount: _discount,
      grandTotal: grandTotal,
      notes: _notes,
    );
  }
}
