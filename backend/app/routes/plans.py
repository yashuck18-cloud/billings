from flask import Blueprint, request, jsonify
from app import db
from app.models.plan import Plan
from app.models.audit_log import AuditLog

plans_bp = Blueprint("plans", __name__)

def log_action(action, entity_type, entity_id, details=None):
    log = AuditLog(action=action, entity_type=entity_type, entity_id=str(entity_id), details=details)
    db.session.add(log)
    db.session.commit()

@plans_bp.route("", methods=["GET"])
def list_plans():
    status = request.args.get("status", "").strip()
    query = Plan.query
    if status:
        query = query.filter(Plan.status.ilike(status))
    plans = query.order_by(Plan.created_at.desc()).all()
    return jsonify([p.to_dict() for p in plans])

@plans_bp.route("/<int:plan_id>", methods=["GET"])
def get_plan(plan_id):
    plan = Plan.query.get_or_404(plan_id)
    return jsonify(plan.to_dict())

@plans_bp.route("", methods=["POST"])
def create_plan():
    data = request.get_json() or {}
    plan = Plan(
        name=data.get("name", ""),
        description=data.get("description"),
        price_monthly=data.get("price_monthly", 0),
        price_yearly=data.get("price_yearly", 0),
        status=data.get("status", "active"),
    )
    db.session.add(plan)
    db.session.commit()
    log_action("CREATE", "Plan", plan.id, f"Created plan {plan.name}")
    return jsonify(plan.to_dict()), 201

@plans_bp.route("/<int:plan_id>", methods=["PUT"])
def update_plan(plan_id):
    plan = Plan.query.get_or_404(plan_id)
    data = request.get_json() or {}
    plan.name = data.get("name", plan.name)
    plan.description = data.get("description", plan.description)
    if "price_monthly" in data:
        plan.price_monthly = data["price_monthly"]
    if "price_yearly" in data:
        plan.price_yearly = data["price_yearly"]
    plan.status = data.get("status", plan.status)
    db.session.commit()
    log_action("UPDATE", "Plan", plan.id, f"Updated plan {plan.name}")
    return jsonify(plan.to_dict())

@plans_bp.route("/<int:plan_id>", methods=["DELETE"])
def delete_plan(plan_id):
    plan = Plan.query.get_or_404(plan_id)
    db.session.delete(plan)
    db.session.commit()
    log_action("DELETE", "Plan", plan_id, f"Deleted plan {plan_id}")
    return jsonify({"deleted": True})
