from flask import Blueprint, request, jsonify
from app import db
from app.models.feature import Feature
from app.models.audit_log import AuditLog

features_bp = Blueprint("features", __name__)

def log_action(action, entity_type, entity_id, details=None):
    log = AuditLog(action=action, entity_type=entity_type, entity_id=str(entity_id), details=details)
    db.session.add(log)
    db.session.commit()

@features_bp.route("/catalog", methods=["GET"])
def features_catalog():
    """Return a static catalog of available feature definitions."""
    catalog = [
        {"key": "pos", "label": "POS Module", "desc": "Point of Sale billing and invoicing"},
        {"key": "inventory", "label": "Inventory", "desc": "Stock and product management"},
        {"key": "reports", "label": "Reports", "desc": "Sales analytics and reports"},
        {"key": "multi_branch", "label": "Multi-Branch", "desc": "Manage multiple shop locations"},
        {"key": "gst", "label": "GST / Tax", "desc": "GST-compliant invoices and tax reports"},
        {"key": "loyalty", "label": "Loyalty Points", "desc": "Customer loyalty reward programs"},
        {"key": "whatsapp", "label": "WhatsApp Alerts", "desc": "Send invoices via WhatsApp"},
        {"key": "api_access", "label": "API Access", "desc": "REST API for third-party integrations"},
    ]
    return jsonify([{"key": f["key"], "label": f["label"], "desc": f["desc"], "enabled": True} for f in catalog])

@features_bp.route("", methods=["GET"])
def list_features():
    plan_id = request.args.get("plan_id", "").strip()
    query = Feature.query
    if plan_id:
        query = query.filter(Feature.plan_id == int(plan_id))
    features = query.order_by(Feature.created_at.desc()).all()
    return jsonify([f.to_dict() for f in features])

@features_bp.route("/<int:feature_id>", methods=["GET"])
def get_feature(feature_id):
    feature = Feature.query.get_or_404(feature_id)
    return jsonify(feature.to_dict())

@features_bp.route("", methods=["POST"])
def create_feature():
    data = request.get_json() or {}
    feature = Feature(
        plan_id=data.get("plan_id"),
        name=data.get("name", ""),
        description=data.get("description"),
        included=data.get("included", True),
    )
    db.session.add(feature)
    db.session.commit()
    log_action("CREATE", "Feature", feature.id, f"Created feature {feature.name}")
    return jsonify(feature.to_dict()), 201

@features_bp.route("/<int:feature_id>", methods=["PUT"])
def update_feature(feature_id):
    feature = Feature.query.get_or_404(feature_id)
    data = request.get_json() or {}
    feature.name = data.get("name", feature.name)
    feature.description = data.get("description", feature.description)
    feature.included = data.get("included", feature.included)
    db.session.commit()
    log_action("UPDATE", "Feature", feature.id, f"Updated feature {feature.name}")
    return jsonify(feature.to_dict())

@features_bp.route("/<int:feature_id>", methods=["DELETE"])
def delete_feature(feature_id):
    feature = Feature.query.get_or_404(feature_id)
    db.session.delete(feature)
    db.session.commit()
    log_action("DELETE", "Feature", feature_id, f"Deleted feature {feature_id}")
    return jsonify({"deleted": True})
