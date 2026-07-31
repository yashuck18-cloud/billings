from app import db
from datetime import datetime, timezone

class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    company = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), default="active")
    plan = db.Column(db.String(100), nullable=True)
    mrr = db.Column(db.Numeric(10, 2), default=0)
    password_hash = db.Column(db.String(255), nullable=True)
    config = db.Column(db.Text, nullable=True)
    layouts = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    subscriptions = db.relationship("Subscription", back_populates="customer", lazy="dynamic")
    payments = db.relationship("Payment", back_populates="customer", lazy="dynamic")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        import json
        config_data = None
        if self.config:
            try:
                config_data = json.loads(self.config)
            except Exception:
                config_data = self.config
        layouts_data = None
        if self.layouts:
            try:
                layouts_data = json.loads(self.layouts)
            except Exception:
                layouts_data = self.layouts

        # Map plan to React-friendly subscriptionType
        sub_type = "trial"
        if isinstance(config_data, dict) and "subscriptionType" in config_data:
            sub_type = config_data["subscriptionType"]
        elif self.plan:
            plan_lower = self.plan.lower()
            if "year" in plan_lower or "annual" in plan_lower or "premium" in plan_lower or "enterprise" in plan_lower:
                sub_type = "yearly"
            elif "month" in plan_lower or "professional" in plan_lower or "pro" in plan_lower:
                sub_type = "monthly"

        # Try to parse features from config
        features = []
        if isinstance(config_data, dict) and "modules" in config_data:
            features = config_data["modules"]

        expiry_val = None
        created_val = self.created_at.isoformat() if self.created_at else None
        if isinstance(config_data, dict):
            if "expiryDate" in config_data:
                expiry_val = config_data["expiryDate"]
            if "createdAt" in config_data:
                created_val = config_data["createdAt"]

        if not expiry_val:
            expiry_val = self.updated_at.isoformat() if self.updated_at else datetime.now().isoformat()

        # Count products and bills dynamically from sync tables
        from app.models.pos_sync import PosProduct, PosInvoice
        products_count = PosProduct.query.filter_by(customer_id=self.id).count()
        bills_count = PosInvoice.query.filter_by(customer_id=self.id).count()

        return {
            "id": str(self.id),
            "businessName": self.company or self.name,
            "ownerName": self.name,
            "email": self.email,
            "mobile": self.phone or "",
            "phone": self.phone or "",
            "company": self.company or "",
            "address": "Main Street, India",
            "status": self.status or "active",
            "subscriptionType": sub_type,
            "expiryDate": expiry_val,
            "createdAt": created_val,
            "lastLogin": (self.updated_at.isoformat() if self.updated_at else datetime.now().isoformat()),
            "bills": bills_count,
            "products": products_count,
            "features": features,
            "plan": self.plan or sub_type.capitalize(),
            "mrr": float(self.mrr) if self.mrr else 0,
            "has_password": self.password_hash is not None,
            "config": config_data,
            "layouts": layouts_data,
            "created_at": created_val,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
