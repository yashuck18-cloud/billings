# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify
from app import db
from app.models.audit_log import AuditLog
from datetime import datetime, timezone, timedelta

audit_logs_bp = Blueprint("audit_logs", __name__)

def seed_default_audit_logs_if_empty():
    if AuditLog.query.count() == 0:
        now = datetime.now(timezone.utc)
        sample_logs = [
            AuditLog(
                action="USER_LOGIN_SUCCESS",
                action_type="AUTHENTICATION",
                module_name="Authentication",
                entity_type="UserSession",
                entity_id="sess_881",
                user_id="1",
                user_email="admin@nexus.io",
                user_name="Super Admin",
                user_role="Super Admin",
                organization="Nexus SaaS Global",
                details="Super Admin authenticated successfully via Multi-Factor Authentication.",
                before_value=None,
                after_value='{"mfa_verified": true, "session_active": true}',
                status="SUCCESS",
                ip_address="157.48.12.90",
                device_info="MacBook Pro M3 Max",
                browser="Chrome 126.0",
                operating_system="macOS Sonoma",
                request_url="/api/auth/login",
                http_method="POST",
                created_at=now - timedelta(minutes=5),
            ),
            AuditLog(
                action="UPDATE_CUSTOMER_STATUS",
                action_type="SUSPEND",
                module_name="Customer Management",
                entity_type="Customer",
                entity_id="cust_3",
                user_id="SYSTEM",
                user_email="system@nexus.io",
                user_name="Automated Expiry Scheduler",
                user_role="System Daemon",
                organization="Supermarket Deluxe (ID: cust_3)",
                details="Subscription expired on 2026-07-20. Account automatically suspended to freeze POS billing while preserving 100% store inventory data.",
                before_value='{"status": "active", "subscriptionType": "Free Trial"}',
                after_value='{"status": "suspended", "subscriptionType": "Expired Trial"}',
                status="WARNING",
                ip_address="10.0.0.1",
                device_info="AWS ECS Worker Node",
                browser="System Service",
                operating_system="Linux Kernel 6.1",
                request_url="/api/customers/cust_3/sync",
                http_method="POST",
                created_at=now - timedelta(minutes=25),
            ),
            AuditLog(
                action="CREATE_ADVERTISEMENT",
                action_type="CREATE",
                module_name="Advertisements",
                entity_type="Advertisement",
                entity_id="ad_889",
                user_id="1",
                user_email="admin@nexus.io",
                user_name="Super Admin",
                user_role="Super Admin",
                organization="Nexus SaaS Global",
                details="Created global banner advertisement for Ugadi Festival offer.",
                before_value=None,
                after_value='{"title": "Ugadi Super Sale 20%", "badge": "FESTIVAL OFFER", "active": true}',
                status="SUCCESS",
                ip_address="157.48.12.90",
                device_info="Windows 11 Workstation",
                browser="Edge 126.0",
                operating_system="Windows 11",
                request_url="/api/advertisements",
                http_method="POST",
                created_at=now - timedelta(hours=2),
            ),
            AuditLog(
                action="BROADCAST_FESTIVAL_THEME",
                action_type="UPDATE",
                module_name="Festival Themes",
                entity_type="FestivalConfig",
                entity_id="theme_ugadi",
                user_id="1",
                user_email="admin@nexus.io",
                user_name="Super Admin",
                user_role="Super Admin",
                organization="All Customer POS Devices",
                details="Applied Ugadi Festival Theme 🌿 with instant cloud sync across all connected POS terminals.",
                before_value='{"festivalTheme": "standard"}',
                after_value='{"festivalTheme": "ugadi", "applyGlobal": true}',
                status="SUCCESS",
                ip_address="157.48.12.90",
                device_info="MacBook Pro M3 Max",
                browser="Chrome 126.0",
                operating_system="macOS",
                request_url="/api/customers/config",
                http_method="PUT",
                created_at=now - timedelta(hours=5),
            ),
            AuditLog(
                action="RECORD_PAYMENT",
                action_type="CREATE",
                module_name="Payments & Billing",
                entity_type="PaymentTransaction",
                entity_id="pay_9941",
                user_id="1",
                user_email="admin@nexus.io",
                user_name="Super Admin",
                user_role="Super Admin",
                organization="Fresh Mart Grocery (ID: cust_1)",
                details="Recorded manual bank wire payment of ₹35,988 for Yearly Enterprise Renewal.",
                before_value='{"paymentStatus": "pending"}',
                after_value='{"amount": 35988, "method": "Bank Wire UTR#98218392", "status": "paid"}',
                status="SUCCESS",
                ip_address="157.48.12.90",
                device_info="Windows Workstation",
                browser="Firefox 127",
                operating_system="Windows 11",
                request_url="/api/payments/record",
                http_method="POST",
                created_at=now - timedelta(hours=12),
            ),
            AuditLog(
                action="UNAUTHORIZED_ACCESS_ATTEMPT",
                action_type="SECURITY_EVENT",
                module_name="Security Events",
                entity_type="AuthEndpoint",
                entity_id="sec_403",
                user_id="UNKNOWN",
                user_email="attacker@external-net.org",
                user_name="Unverified IP",
                user_role="Anonymous",
                organization="External IP Range",
                details="Blocked 5 consecutive invalid admin password attempts. Triggered IP rate-limiting lockout.",
                before_value='{"failed_attempts": 4}',
                after_value='{"failed_attempts": 5, "ip_locked": true, "duration_minutes": 30}',
                status="FAILED",
                is_suspicious=True,
                ip_address="198.51.100.42",
                device_info="Python Requests / Bot Scanner",
                browser="Automated Script",
                operating_system="Linux",
                request_url="/api/auth/login",
                http_method="POST",
                error_message="HTTP 403 Forbidden: Account lockout limit exceeded.",
                created_at=now - timedelta(hours=18),
            ),
        ]
        for log in sample_logs:
            db.session.add(log)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

@audit_logs_bp.route("", methods=["GET"])
def list_audit_logs():
    seed_default_audit_logs_if_empty()
    action = request.args.get("action", "").strip()
    module = request.args.get("module", "").strip()
    status = request.args.get("status", "").strip()
    search = request.args.get("search", "").strip()
    entity_type = request.args.get("entity_type", "").strip()

    query = AuditLog.query

    if search:
        query = query.filter(
            (AuditLog.details.ilike(f"%{search}%")) |
            (AuditLog.action.ilike(f"%{search}%")) |
            (AuditLog.user_name.ilike(f"%{search}%")) |
            (AuditLog.user_email.ilike(f"%{search}%")) |
            (AuditLog.organization.ilike(f"%{search}%")) |
            (AuditLog.module_name.ilike(f"%{search}%"))
        )
    if action and not action.lower().startswith("all"):
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if module and not module.lower().startswith("all"):
        query = query.filter(AuditLog.module_name.ilike(f"%{module}%"))
    if status and not status.lower().startswith("all"):
        query = query.filter(AuditLog.status.ilike(f"%{status}%"))
    if entity_type and not entity_type.lower().startswith("all"):
        query = query.filter(AuditLog.entity_type.ilike(f"%{entity_type}%"))

    logs = query.order_by(AuditLog.created_at.desc()).limit(10000).all()
    return jsonify([log.to_dict() for log in logs])

@audit_logs_bp.route("/<int:log_id>", methods=["GET"])
def get_audit_log(log_id):
    log = AuditLog.query.get_or_404(log_id)
    return jsonify(log.to_dict())

@audit_logs_bp.route("/<int:log_id>/pin", methods=["POST"])
def toggle_pin_audit_log(log_id):
    log = AuditLog.query.get_or_404(log_id)
    log.is_pinned = not bool(log.is_pinned)
    db.session.commit()
    return jsonify({"success": True, "is_pinned": log.is_pinned})

@audit_logs_bp.route("/<int:log_id>/suspicious", methods=["POST"])
def toggle_suspicious_audit_log(log_id):
    log = AuditLog.query.get_or_404(log_id)
    log.is_suspicious = not bool(log.is_suspicious)
    db.session.commit()
    return jsonify({"success": True, "is_suspicious": log.is_suspicious})
