from app import db
from datetime import datetime, timezone

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    subscription_id = db.Column(db.Integer, db.ForeignKey("subscriptions.id"), nullable=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default="USD")
    status = db.Column(db.String(50), default="succeeded")
    payment_method = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    customer = db.relationship("Customer", back_populates="payments")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "customer_name": self.customer.name if self.customer else "Store Owner",
            "customer_email": self.customer.email if self.customer else "store@pos.com",
            "customer_company": self.customer.company if self.customer else "Retail Store",
            "subscription_id": self.subscription_id,
            "amount": float(self.amount) if self.amount else 0.0,
            "currency": self.currency or "INR",
            "status": self.status or "succeeded",
            "payment_method": self.payment_method or "Razorpay",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
