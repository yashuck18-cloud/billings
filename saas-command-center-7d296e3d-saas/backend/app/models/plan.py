from app import db
from datetime import datetime, timezone

class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price_monthly = db.Column(db.Numeric(10, 2), default=0)
    price_yearly = db.Column(db.Numeric(10, 2), default=0)
    status = db.Column(db.String(50), default="active")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    subscriptions = db.relationship("Subscription", back_populates="plan", lazy="dynamic")
    features = db.relationship("Feature", back_populates="plan", lazy="dynamic")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price_monthly": float(self.price_monthly) if self.price_monthly else 0,
            "price_yearly": float(self.price_yearly) if self.price_yearly else 0,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
