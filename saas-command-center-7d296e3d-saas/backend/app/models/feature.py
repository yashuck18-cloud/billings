from app import db
from datetime import datetime, timezone

class Feature(db.Model):
    __tablename__ = "features"

    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey("plans.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    included = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    plan = db.relationship("Plan", back_populates="features")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "plan_id": self.plan_id,
            "name": self.name,
            "description": self.description,
            "included": self.included,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
