from app import db
from datetime import datetime, timezone

class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default="info")
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        created_str = self.created_at.isoformat() if self.created_at else datetime.now(timezone.utc).isoformat()
        
        # Calculate human friendly time_ago string
        time_ago_str = "Just now"
        if self.created_at:
            now = datetime.now(timezone.utc)
            dt = self.created_at.replace(tzinfo=timezone.utc) if self.created_at.tzinfo is None else self.created_at
            diff = now - dt
            seconds = int(diff.total_seconds())
            if seconds < 60:
                time_ago_str = "Just now"
            elif seconds < 3600:
                mins = max(1, seconds // 60)
                time_ago_str = f"{mins}m ago"
            elif seconds < 86400:
                hours = max(1, seconds // 3600)
                time_ago_str = f"{hours}h ago"
            else:
                days = max(1, seconds // 86400)
                time_ago_str = f"{days}d ago"

        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "read": self.read,
            "created_at": created_str,
            "timestamp": created_str,
            "date": created_str,
            "time_ago": time_ago_str,
            "timeAgo": time_ago_str,
        }

class NotificationPref(db.Model):
    __tablename__ = "notification_prefs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    email_invoices = db.Column(db.Boolean, default=True)
    email_subscriptions = db.Column(db.Boolean, default=True)
    email_marketing = db.Column(db.Boolean, default=False)
    push_enabled = db.Column(db.Boolean, default=True)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "email_invoices": self.email_invoices,
            "email_subscriptions": self.email_subscriptions,
            "email_marketing": self.email_marketing,
            "push_enabled": self.push_enabled,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
