from app import db
from datetime import datetime, timezone

class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey("plans.id"), nullable=True)
    status = db.Column(db.String(50), default="active")
    billing_cycle = db.Column(db.String(50), default="monthly")
    start_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    end_date = db.Column(db.DateTime, nullable=True)
    amount = db.Column(db.Numeric(10, 2), default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    customer = db.relationship("Customer", back_populates="subscriptions")
    plan = db.relationship("Plan", back_populates="subscriptions")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "plan_id": self.plan_id,
            "status": self.status,
            "billing_cycle": self.billing_cycle,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "amount": float(self.amount) if self.amount else 0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
