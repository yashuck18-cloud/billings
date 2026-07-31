from app import db
from datetime import datetime, timezone

class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(100), nullable=False)
    entity_type = db.Column(db.String(100), nullable=False)
    entity_id = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.String(100), nullable=True)
    user_email = db.Column(db.String(255), nullable=True)
    user_name = db.Column(db.String(255), nullable=True)
    user_role = db.Column(db.String(100), default="Super Admin")
    organization = db.Column(db.String(255), default="SaaS Platform")
    module_name = db.Column(db.String(100), default="System")
    action_type = db.Column(db.String(100), default="UPDATE")
    details = db.Column(db.Text, nullable=True)
    before_value = db.Column(db.Text, nullable=True)
    after_value = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default="SUCCESS")
    ip_address = db.Column(db.String(100), default="127.0.0.1")
    device_info = db.Column(db.String(255), default="Desktop Workstation")
    browser = db.Column(db.String(100), default="Chrome 126.0")
    operating_system = db.Column(db.String(100), default="Windows 11")
    request_url = db.Column(db.String(500), nullable=True)
    http_method = db.Column(db.String(20), default="POST")
    session_id = db.Column(db.String(100), nullable=True)
    geo_location = db.Column(db.String(100), default="Bengaluru, India")
    error_message = db.Column(db.Text, nullable=True)
    execution_time = db.Column(db.Float, default=12.5)
    is_pinned = db.Column(db.Boolean, default=False)
    is_suspicious = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action or self.action_type,
            "entity_type": self.entity_type or self.module_name,
            "entity_id": str(self.entity_id or self.id),
            "user_id": str(self.user_id or "1"),
            "user_email": self.user_email or "admin@nexus.io",
            "user_name": self.user_name or self.user_email or "Super Admin",
            "user_role": self.user_role or "Super Admin",
            "organization": self.organization or "Nexus SaaS Global",
            "module_name": self.module_name or self.entity_type or "System",
            "action_type": self.action_type or self.action or "UPDATE",
            "details": self.details or f"{self.action} on {self.entity_type}",
            "before_value": self.before_value,
            "after_value": self.after_value,
            "status": self.status or "SUCCESS",
            "ip_address": self.ip_address or "127.0.0.1",
            "device_info": self.device_info or "Windows Desktop",
            "browser": self.browser or "Chrome",
            "operating_system": self.operating_system or "Windows",
            "request_url": self.request_url or "/api",
            "http_method": self.http_method or "POST",
            "session_id": self.session_id or f"sess_{self.id}981",
            "geo_location": self.geo_location or "India",
            "error_message": self.error_message,
            "execution_time": self.execution_time or 14.2,
            "is_pinned": bool(self.is_pinned),
            "is_suspicious": bool(self.is_suspicious),
            "timestamp": self.created_at.isoformat() if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
