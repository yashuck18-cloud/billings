class CreditDue {
  final String id;
  final String customerName;
  final String customerPhone;
  final String invoiceNumber;
  final double totalAmount;
  final double paidAmount;
  final double dueAmount;
  final DateTime dueDate;
  final DateTime createdAt;
  final String status; // 'PENDING', 'PARTIAL', 'PAID'
  final String notes;

  CreditDue({
    required this.id,
    required this.customerName,
    required this.customerPhone,
    required this.invoiceNumber,
    required this.totalAmount,
    required this.paidAmount,
    required this.dueAmount,
    required this.dueDate,
    required this.createdAt,
    this.status = 'PENDING',
    this.notes = '',
  });

  bool get isOverdue => status != 'PAID' && dueDate.isBefore(DateTime.now());

  Map<String, dynamic> toJson() => {
        'id': id,
        'customerName': customerName,
        'customerPhone': customerPhone,
        'invoiceNumber': invoiceNumber,
        'totalAmount': totalAmount,
        'paidAmount': paidAmount,
        'dueAmount': dueAmount,
        'dueDate': dueDate.toIso8601String(),
        'createdAt': createdAt.toIso8601String(),
        'status': status,
        'notes': notes,
      };

  factory CreditDue.fromJson(Map<String, dynamic> json) => CreditDue(
        id: json['id'] ?? '',
        customerName: json['customerName'] ?? 'Unknown Customer',
        customerPhone: json['customerPhone'] ?? '',
        invoiceNumber: json['invoiceNumber'] ?? '',
        totalAmount: (json['totalAmount'] ?? 0.0).toDouble(),
        paidAmount: (json['paidAmount'] ?? 0.0).toDouble(),
        dueAmount: (json['dueAmount'] ?? 0.0).toDouble(),
        dueDate: json['dueDate'] != null ? DateTime.parse(json['dueDate']) : DateTime.now(),
        createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
        status: json['status'] ?? 'PENDING',
        notes: json['notes'] ?? '',
      );
}
