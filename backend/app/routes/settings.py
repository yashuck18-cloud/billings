from flask import Blueprint, request, jsonify
from app import db
from app.models.setting import Setting
from app.models.audit_log import AuditLog

settings_bp = Blueprint("settings", __name__)

def seed_default_settings_if_empty():
    if Setting.query.count() == 0:
        defaults = [
            ("general", "platformName", "Nexus SaaS POS Platform"),
            ("general", "supportEmail", "support@nexuspos.io"),
            ("general", "currencySymbol", "₹"),
            ("general", "defaultTrialDays", "14"),
            ("security", "enforceMfa", "true"),
            ("security", "passwordMinLength", "8"),
            ("security", "sessionTimeoutMinutes", "120"),
            ("maintenance", "isMaintenanceMode", "false"),
            ("maintenance", "maintenanceNotice", "Scheduled platform upgrade in progress. POS billing remains 100% active."),
            ("notifications", "enableEmailNotifications", "true"),
            ("notifications", "enableSmsReminders", "true"),
            ("smtp", "smtpHost", "smtp.sendgrid.net"),
            ("smtp", "smtpPort", "587"),
            ("smtp", "senderEmail", "no-reply@nexuspos.io"),
        ]
        for sec, k, v in defaults:
            db.session.add(Setting(section=sec, key=k, value=v))
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

def log_action(action, entity_type, entity_id, details=None):
    try:
        log = AuditLog(
            action=action,
            action_type="UPDATE",
            module_name="System Settings",
            entity_type=entity_type,
            entity_id=str(entity_id),
            user_email="admin@nexus.io",
            user_name="Super Admin",
            user_role="Super Admin",
            organization="SaaS Command Center",
            details=details or f"{action} on {entity_type} {entity_id}",
            status="SUCCESS",
            ip_address=request.remote_addr or "127.0.0.1",
            request_url=request.path if request else "/api/settings",
            http_method=request.method if request else "PUT",
        )
        db.session.add(log)
        db.session.commit()
    except Exception:
        db.session.rollback()

@settings_bp.route("", methods=["GET"])
def get_all_settings():
    seed_default_settings_if_empty()
    settings = Setting.query.all()
    result = {}
    for s in settings:
        result.setdefault(s.section, {})[s.key] = s.value
    return jsonify(result)

@settings_bp.route("/<section>", methods=["GET"])
def get_section_settings(section):
    seed_default_settings_if_empty()
    settings = Setting.query.filter(Setting.section == section).all()
    return jsonify({s.key: s.value for s in settings})

@settings_bp.route("/<section>", methods=["PUT"])
def update_section_settings(section):
    seed_default_settings_if_empty()
    data = request.get_json() or {}
    for key, value in data.items():
        setting = Setting.query.filter_by(section=section, key=key).first()
        if setting:
            setting.value = str(value)
        else:
            setting = Setting(section=section, key=key, value=str(value))
            db.session.add(setting)
    db.session.commit()
    log_action("UPDATE_SETTINGS", "SystemSettings", section, f"Updated System Settings for section '{section}'")
    return jsonify({s.key: s.value for s in Setting.query.filter_by(section=section).all()})
