from app import db
from datetime import datetime

class Advertisement(db.Model):
    __tablename__ = "advertisements"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    subtitle = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.Text, nullable=True)
    badge = db.Column(db.String(100), nullable=True, default="PROMO")
    cta_text = db.Column(db.String(100), nullable=True, default="Learn More")
    cta_link = db.Column(db.String(500), nullable=True, default="")
    target_audience = db.Column(db.String(50), nullable=False, default="all") # all, active, trial
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        url = self.image_url or ""
        link = self.cta_link or ""
        return {
            "id": str(self.id),
            "title": self.title,
            "subtitle": self.subtitle or "",
            "imageUrl": url,
            "image_url": url,
            "badge": self.badge or "PROMO",
            "ctaText": self.cta_text or "Learn More",
            "cta_text": self.cta_text or "Learn More",
            "ctaLink": link,
            "cta_link": link,
            "targetAudience": self.target_audience or "all",
            "active": self.active,
            "createdAt": self.created_at.isoformat() if self.created_at else "",
        }
