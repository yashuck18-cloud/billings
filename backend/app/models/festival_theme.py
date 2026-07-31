from app import db
from datetime import datetime, timezone

class FestivalTheme(db.Model):
    __tablename__ = "festival_themes"

    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    tagline = db.Column(db.String(255), nullable=True)
    greeting = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(50), nullable=True, default="🎉")
    badge = db.Column(db.String(100), nullable=True, default="FESTIVAL")
    badge_bg = db.Column(db.String(50), nullable=True, default="#F59E0B")
    gradient = db.Column(db.String(255), nullable=True, default="from-[#1E1B4B] via-[#312E81] to-[#4338CA]")
    accent = db.Column(db.String(50), nullable=True, default="#4F46E5")
    description = db.Column(db.Text, nullable=True)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tagline": self.tagline or "",
            "greeting": self.greeting or "",
            "icon": self.icon or "🎉",
            "badge": self.badge or "SPECIAL",
            "badgeBg": self.badge_bg or "#F59E0B",
            "gradient": self.gradient or "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
            "accent": self.accent or "#4F46E5",
            "description": self.description or "",
            "isDefault": self.is_default,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
