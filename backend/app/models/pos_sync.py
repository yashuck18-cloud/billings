from app import db
from datetime import datetime

class PosCategory(db.Model):
    __tablename__ = "pos_categories"

    db_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    __table_args__ = (db.UniqueConstraint("id", "customer_id", name="uq_category_customer"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }

class PosProduct(db.Model):
    __tablename__ = "pos_products"

    db_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    categoryId = db.Column(db.String(100), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    unit = db.Column(db.String(50), nullable=True)
    quantity = db.Column(db.Float, default=0.0)
    defaultSellingPrice = db.Column(db.Float, default=0.0)
    purchasePrice = db.Column(db.Float, default=0.0)
    lowStockAlert = db.Column(db.Float, default=0.0)
    maxStockLimit = db.Column(db.Float, nullable=True)
    barcode = db.Column(db.String(255), nullable=True)

    __table_args__ = (db.UniqueConstraint("id", "customer_id", name="uq_product_customer"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "categoryId": self.categoryId,
            "brand": self.brand,
            "unit": self.unit,
            "quantity": self.quantity,
            "defaultSellingPrice": self.defaultSellingPrice,
            "purchasePrice": self.purchasePrice,
            "lowStockAlert": self.lowStockAlert,
            "maxStockLimit": self.maxStockLimit,
            "barcode": self.barcode,
        }

class PosStockHistory(db.Model):
    __tablename__ = "pos_stock_history"

    db_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    productId = db.Column(db.String(100), nullable=False)
    productName = db.Column(db.String(255), nullable=False)
    quantityChanged = db.Column(db.Float, default=0.0)
    type = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    note = db.Column(db.Text, nullable=True)

    __table_args__ = (db.UniqueConstraint("id", "customer_id", name="uq_stock_history_customer"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "productId": self.productId,
            "productName": self.productName,
            "quantityChanged": self.quantityChanged,
            "type": self.type,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "note": self.note,
        }

class PosInvoice(db.Model):
    __tablename__ = "pos_invoices"

    db_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    invoiceNumber = db.Column(db.String(100), nullable=False)
    dateTime = db.Column(db.DateTime, nullable=False)
    subTotal = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    grandTotal = db.Column(db.Float, default=0.0)
    notes = db.Column(db.Text, nullable=True)

    items = db.relationship("PosInvoiceItem", backref="invoice", cascade="all, delete-orphan", lazy="joined")

    __table_args__ = (db.UniqueConstraint("id", "customer_id", name="uq_invoice_customer"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "invoiceNumber": self.invoiceNumber,
            "dateTime": self.dateTime.isoformat() if self.dateTime else None,
            "subTotal": self.subTotal,
            "discount": self.discount,
            "grandTotal": self.grandTotal,
            "notes": self.notes,
            "items": [item.to_dict() for item in self.items],
        }

class PosInvoiceItem(db.Model):
    __tablename__ = "pos_invoice_items"

    db_id = db.Column(db.Integer, primary_key=True)
    invoice_db_id = db.Column(db.Integer, db.ForeignKey("pos_invoices.db_id", ondelete="CASCADE"), nullable=False)
    productId = db.Column(db.String(100), nullable=False)
    productName = db.Column(db.String(255), nullable=False)
    unit = db.Column(db.String(50), nullable=True)
    defaultPrice = db.Column(db.Float, default=0.0)
    billingPrice = db.Column(db.Float, default=0.0)
    purchasePrice = db.Column(db.Float, default=0.0)
    quantity = db.Column(db.Float, default=0.0)
    billingMethod = db.Column(db.String(50), nullable=True)
    total = db.Column(db.Float, default=0.0)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "productId": self.productId,
            "productName": self.productName,
            "unit": self.unit,
            "defaultPrice": self.defaultPrice,
            "billingPrice": self.billingPrice,
            "purchasePrice": self.purchasePrice,
            "quantity": self.quantity,
            "billingMethod": self.billingMethod,
            "total": self.total,
        }

class PosCreditDue(db.Model):
    __tablename__ = "pos_credit_dues"

    db_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    customerName = db.Column(db.String(255), nullable=False)
    customerPhone = db.Column(db.String(100), nullable=True)
    invoiceNumber = db.Column(db.String(100), nullable=True)
    totalAmount = db.Column(db.Float, default=0.0)
    paidAmount = db.Column(db.Float, default=0.0)
    dueAmount = db.Column(db.Float, default=0.0)
    dueDate = db.Column(db.DateTime, nullable=True)
    createdDate = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default="PENDING")
    notes = db.Column(db.Text, nullable=True)

    __table_args__ = (db.UniqueConstraint("id", "customer_id", name="uq_credit_due_customer"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "customerName": self.customerName,
            "customerPhone": self.customerPhone,
            "invoiceNumber": self.invoiceNumber,
            "totalAmount": self.totalAmount,
            "paidAmount": self.paidAmount,
            "dueAmount": self.dueAmount,
            "dueDate": self.dueDate.isoformat() if self.dueDate else None,
            "createdDate": self.createdDate.isoformat() if self.createdDate else None,
            "status": self.status,
            "notes": self.notes,
        }

