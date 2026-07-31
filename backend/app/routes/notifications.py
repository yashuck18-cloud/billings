import json
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify
from app import db
from app.models.notification import Notification, NotificationPref
from app.models.audit_log import AuditLog
from app.models.customer import Customer
from firebase_config import send_fcm_notification

notifications_bp = Blueprint("notifications", __name__)

def log_action(action, entity_type, entity_id, details=None):
    log = AuditLog(action=action, entity_type=entity_type, entity_id=str(entity_id), details=details)
    db.session.add(log)
    db.session.commit()

def seed_default_notifications_if_empty():
    if Notification.query.count() == 0:
        now = datetime.now(timezone.utc)
        sample = [
            Notification(title="Subscription Reminder (7 days before expiry)", message="Your subscription will expire in 7 days. Please renew.", type="reminder", created_at=now - timedelta(days=2)),
            Notification(title="Subscription Reminder (3 days before expiry)", message="Your subscription will expire in 3 days.", type="warning", created_at=now - timedelta(days=1)),
            Notification(title="Subscription Reminder (1 day before expiry)", message="Your subscription expires tomorrow.", type="warning", created_at=now - timedelta(hours=5)),
            Notification(title="Welcome to Nexus SaaS", message="Thank you for joining Nexus SaaS Platform.", type="info", created_at=now - timedelta(days=10)),
            Notification(title="Payment received", message="Payment of ₹99 for Monthly Standard plan processed successfully.", type="success", created_at=now - timedelta(hours=12)),
        ]
        for s in sample:
            db.session.add(s)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

@notifications_bp.route("", methods=["GET"])
def list_notifications():
    seed_default_notifications_if_empty()
    unread_only = request.args.get("unread", "false").lower() == "true"
    customer_id = request.args.get("customer_id", "").strip()
    mobile = request.args.get("mobile", "").strip() or request.args.get("phone", "").strip() or request.args.get("mobile_number", "").strip()

    if mobile and not customer_id:
        customer = Customer.query.filter((Customer.phone == mobile) | (Customer.mobile == mobile)).first()
        if not customer:
            for c in Customer.query.all():
                if c.config:
                    try:
                        cfg = json.loads(c.config) if isinstance(c.config, str) else c.config
                        if cfg.get("owner_mobile") == mobile or cfg.get("mobile") == mobile:
                            customer = c
                            break
                    except Exception:
                        pass
        if customer:
            customer_id = str(customer.id)

    query = Notification.query
    if customer_id:
        try:
            cid = int(str(customer_id).upper().replace("CUS-", ""))
            query = query.filter((Notification.user_id == cid) | (Notification.user_id == None))
        except (ValueError, TypeError):
            pass
    if unread_only:
        query = query.filter(Notification.read == False)
    notifications = query.order_by(Notification.created_at.desc()).all()
    
    customers_map = {}
    try:
        customers_map = {c.id: (c.company or c.name) for c in Customer.query.all()}
    except Exception:
        pass
    result = []
    for n in notifications:
        d = n.to_dict()
        if n.user_id:
            cname = customers_map.get(n.user_id, f"User #{n.user_id}")
            d["target_user"] = f"{cname} (CUS-{n.user_id})"
            d["targetUser"] = f"{cname} (CUS-{n.user_id})"
        else:
            d["target_user"] = "All POS Users (Broadcast)"
            d["targetUser"] = "All POS Users (Broadcast)"
        d["desc"] = n.message
        d["time"] = d["created_at"]
        result.append(d)
    return jsonify(result)

@notifications_bp.route("", methods=["POST"])
def create_notification():
    import re
    data = request.get_json() or {}
    title = data.get("title", "Admin Notification").strip()
    message = (data.get("message") or data.get("desc") or data.get("body") or "").strip()
    note_type = data.get("type", "info").strip()
    raw_user_id = data.get("user_id") or data.get("customer_id") or data.get("userId") or data.get("customerId")
    mobile_number = str(data.get("mobile_number") or data.get("phone") or data.get("mobile") or "").strip()
    target = str(data.get("target", "")).strip().lower()

    user_id = None
    if raw_user_id and str(raw_user_id).lower() not in ["all", "", "none"]:
        user_str = str(raw_user_id).strip()
        match = re.search(r'CUS-(\d+)', user_str, re.IGNORECASE) or re.search(r'(\d+)', user_str)
        if match:
            try:
                user_id = int(match.group(1))
            except (IndexError, ValueError):
                user_id = None

    if mobile_number and not user_id:
        customer = Customer.query.filter((Customer.phone == mobile_number) | (Customer.mobile == mobile_number)).first()
        if not customer:
            for c in Customer.query.all():
                if c.config:
                    try:
                        cfg = json.loads(c.config) if isinstance(c.config, str) else c.config
                        if cfg.get("owner_mobile") == mobile_number or cfg.get("mobile") == mobile_number:
                            customer = c
                            break
                    except Exception:
                        pass
        if customer:
            user_id = customer.id

    if target == "all":
        user_id = None

    note = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=note_type,
        read=False,
    )
    db.session.add(note)
    db.session.commit()

    target_str = f"Mobile #{mobile_number}" if mobile_number else (f"User #{user_id}" if user_id else "All Customers (Broadcast)")
    log_action("SEND_NOTIFICATION", "Notification", note.id, f"Sent notification to {target_str}: {title}")

    # Helper to extract token from config string/dict
    def get_customer_fcm_token(cust):
        if not cust or not cust.config:
            return None
        try:
            cfg = json.loads(cust.config) if isinstance(cust.config, str) else cust.config
            return cfg.get("fcm_token") or cfg.get("fcmToken") or cfg.get("token") or cfg.get("push_token")
        except Exception:
            return None

    # Dispatch FCM Push Notification
    try:
        tokens_to_send = []
        if user_id:
            target_cust = Customer.query.get(user_id)
            if target_cust:
                t = get_customer_fcm_token(target_cust)
                if t:
                    tokens_to_send.append(t)
            if not tokens_to_send:
                for c in Customer.query.all():
                    t = get_customer_fcm_token(c)
                    if t and t not in tokens_to_send:
                        tokens_to_send.append(t)
        else:
            for c in Customer.query.all():
                t = get_customer_fcm_token(c)
                if t and t not in tokens_to_send:
                    tokens_to_send.append(t)

        for token in tokens_to_send:
            send_fcm_notification(
                fcm_token=token,
                title=title,
                body=message,
                data={
                    "notification_id": str(note.id),
                    "type": note_type,
                    "title": title,
                    "body": message,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
    except Exception as e:
        print(f"FCM push notification dispatch warning: {e}")

    return jsonify(note.to_dict()), 201

@notifications_bp.route("/<int:note_id>/read", methods=["POST"])
def mark_read(note_id):
    note = Notification.query.get_or_404(note_id)
    note.read = True
    db.session.commit()
    return jsonify(note.to_dict())

@notifications_bp.route("/<int:note_id>", methods=["DELETE"])
def delete_notification(note_id):
    note = Notification.query.get(note_id)
    if not note:
        return jsonify({"error": "Notification not found"}), 404
    db.session.delete(note)
    db.session.commit()
    log_action("DELETE", "Notification", note_id, "Deleted notification")
    return jsonify({"deleted": True})

@notifications_bp.route("/preferences", methods=["GET"])
def get_preferences():
    prefs = NotificationPref.query.first()
    if not prefs:
        prefs = NotificationPref()
        db.session.add(prefs)
        db.session.commit()
    return jsonify(prefs.to_dict())

@notifications_bp.route("/preferences", methods=["PUT"])
def update_preferences():
    data = request.get_json() or {}
    prefs = NotificationPref.query.first()
    if not prefs:
        prefs = NotificationPref()
        db.session.add(prefs)
    prefs.email_invoices = data.get("email_invoices", prefs.email_invoices)
    prefs.email_subscriptions = data.get("email_subscriptions", prefs.email_subscriptions)
    prefs.email_marketing = data.get("email_marketing", prefs.email_marketing)
    prefs.push_enabled = data.get("push_enabled", prefs.push_enabled)
    db.session.commit()
    log_action("UPDATE", "NotificationPref", prefs.id, "Updated notification preferences")
    return jsonify(prefs.to_dict())

@notifications_bp.route("/save-token", methods=["POST"])
@notifications_bp.route("/fcm/bind-mobile", methods=["POST"])
def bind_fcm_mobile():
    data = request.get_json() or {}
    mobile_number = str(data.get("mobile_number") or data.get("mobile") or data.get("phone") or "").strip()
    fcm_token = str(data.get("fcm_token") or data.get("token") or data.get("fcmToken") or "").strip()
    user_id = data.get("user_id") or data.get("customer_id") or data.get("userId")

    if not fcm_token:
        return jsonify({"error": "fcm_token is required"}), 400

    customer = None
    if user_id:
        try:
            cid = int(str(user_id).upper().replace("CUS-", "").strip())
            customer = Customer.query.get(cid)
        except Exception:
            pass
    if not customer and mobile_number:
        customer = Customer.query.filter((Customer.phone == mobile_number) | (Customer.mobile == mobile_number)).first()
    if not customer:
        customer = Customer.query.first()

    if customer:
        config = {}
        if customer.config:
            try:
                config = json.loads(customer.config) if isinstance(customer.config, str) else customer.config
            except Exception:
                pass
        config["fcm_token"] = fcm_token
        if mobile_number:
            config["owner_mobile"] = mobile_number
        customer.config = json.dumps(config)

        # Also set fcm_token on all customer accounts as fallback so push always delivers to active device
        for c in Customer.query.all():
            if c.id != customer.id:
                try:
                    c_cfg = json.loads(c.config) if isinstance(c.config, str) and c.config else (c.config or {})
                    if not c_cfg.get("fcm_token"):
                        c_cfg["fcm_token"] = fcm_token
                        c.config = json.dumps(c_cfg)
                except Exception:
                    pass

        db.session.commit()
        return jsonify({"success": True, "message": f"FCM Token bound successfully to customer {customer.id}"})

    return jsonify({"error": "Store owner customer account not found"}), 404

@notifications_bp.route("/fcm/trigger-action", methods=["POST"])
def trigger_action_notification():
    data = request.get_json() or {}
    mobile_number = str(data.get("mobile_number", "")).strip()
    title = str(data.get("title", "POS Action Alert")).strip()
    message = str(data.get("message", "")).strip()
    action_type = str(data.get("action_type", "POS_EVENT")).strip()

    customer = None
    if mobile_number:
        customer = Customer.query.filter((Customer.phone == mobile_number) | (Customer.mobile == mobile_number)).first()
    if not customer:
        customer = Customer.query.first()

    note = Notification(
        user_id=customer.id if customer else None,
        title=title,
        message=message,
        type=action_type,
        read=False,
    )
    db.session.add(note)
    db.session.commit()

    log_action("POS_ACTION_NOTIFY", "Notification", note.id, f"Notification sent to store owner mobile {mobile_number}: {title}")

    # Send real FCM Push Notification if customer has fcm_token stored
    if customer and customer.config:
        try:
            cfg = json.loads(customer.config) if isinstance(customer.config, str) else customer.config
            t = cfg.get("fcm_token")
            if t:
                send_fcm_notification(fcm_token=t, title=title, body=message, data={"notification_id": str(note.id), "type": action_type})
        except Exception as e:
            print(f"FCM action notification push warning: {e}")

    return jsonify({"success": True, "notification": note.to_dict()}), 201
