from flask import Blueprint, request, jsonify
from app import db
from app.models.subscription import Subscription
from app.models.audit_log import AuditLog

subscriptions_bp = Blueprint("subscriptions", __name__)

def log_action(action, entity_type, entity_id, details=None):
    log = AuditLog(action=action, entity_type=entity_type, entity_id=str(entity_id), details=details)
    db.session.add(log)
    db.session.commit()

@subscriptions_bp.route("", methods=["GET"])
def list_subscriptions():
    status = request.args.get("status", "").strip()
    query = Subscription.query
    if status:
        query = query.filter(Subscription.status.ilike(status))
    subs = query.order_by(Subscription.created_at.desc()).all()
    return jsonify([s.to_dict() for s in subs])

@subscriptions_bp.route("/<int:sub_id>", methods=["GET"])
def get_subscription(sub_id):
    sub = Subscription.query.get_or_404(sub_id)
    return jsonify(sub.to_dict())

@subscriptions_bp.route("", methods=["POST"])
def create_subscription():
    data = request.get_json() or {}
    sub = Subscription(
        customer_id=data.get("customer_id"),
        plan_id=data.get("plan_id"),
        status=data.get("status", "active"),
        billing_cycle=data.get("billing_cycle", "monthly"),
        amount=data.get("amount", 0),
    )
    db.session.add(sub)
    db.session.commit()
    log_action("CREATE", "Subscription", sub.id, f"Created subscription for customer {sub.customer_id}")
    return jsonify(sub.to_dict()), 201

@subscriptions_bp.route("/<int:sub_id>", methods=["PUT"])
def update_subscription(sub_id):
    sub = Subscription.query.get_or_404(sub_id)
    data = request.get_json() or {}
    sub.status = data.get("status", sub.status)
    sub.billing_cycle = data.get("billing_cycle", sub.billing_cycle)
    if "amount" in data:
        sub.amount = data["amount"]
    if "end_date" in data:
        from datetime import datetime
        sub.end_date = datetime.fromisoformat(data["end_date"].replace("Z", "+00:00"))
    db.session.commit()
    log_action("UPDATE", "Subscription", sub.id, f"Updated subscription {sub.id}")
    return jsonify(sub.to_dict())

@subscriptions_bp.route("/<int:sub_id>", methods=["DELETE"])
def delete_subscription(sub_id):
    sub = Subscription.query.get_or_404(sub_id)
    db.session.delete(sub)
    db.session.commit()
    log_action("DELETE", "Subscription", sub_id, f"Deleted subscription {sub_id}")
    return jsonify({"deleted": True})
