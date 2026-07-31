import os
import uuid
# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app import db
from app.models.advertisement import Advertisement
from app.models.audit_log import AuditLog

advertisements_bp = Blueprint("advertisements", __name__)

@advertisements_bp.route("/upload", methods=["POST"])
def upload_ad_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]:
        ext = ".png"

    filename = f"ad_{uuid.uuid4().hex[:12]}{ext}"
    upload_dir = os.path.join(current_app.root_path, "static", "uploads", "ads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, filename)
    file.save(file_path)

    # Build full absolute URL so POS Flutter client and Web preview can load it anywhere
    host_url = request.host_url.rstrip("/")
    image_url = f"{host_url}/api/advertisements/uploads/{filename}"
    return jsonify({"imageUrl": image_url, "filename": filename}), 201

@advertisements_bp.route("/uploads/<path:filename>", methods=["GET"])
def serve_ad_image(filename):
    upload_dir = os.path.join(current_app.root_path, "static", "uploads", "ads")
    return send_from_directory(upload_dir, filename)

def log_action(action, entity_type, entity_id, details=None, user_email="superadmin@nexus.io"):
    log = AuditLog(
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        user_email=user_email,
        details=details,
    )
    db.session.add(log)
    db.session.commit()

@advertisements_bp.route("", methods=["GET"])
def list_advertisements():
    active_only = request.args.get("active_only", "false").lower() == "true"
    query = Advertisement.query
    if active_only:
        query = query.filter_by(active=True)
    ads = query.order_by(Advertisement.created_at.desc()).all()
    return jsonify([ad.to_dict() for ad in ads])

@advertisements_bp.route("", methods=["POST"])
def create_advertisement():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    ad = Advertisement(
        title=title,
        subtitle=data.get("subtitle", "").strip(),
        image_url=(data.get("imageUrl") or data.get("image_url") or "").strip(),
        badge=data.get("badge", "PROMO").strip(),
        cta_text=(data.get("ctaText") or data.get("cta_text") or "Learn More").strip(),
        cta_link=(data.get("ctaLink") or data.get("cta_link") or "").strip(),
        target_audience=data.get("targetAudience", "all").strip(),
        active=data.get("active", True),
    )
    db.session.add(ad)
    db.session.commit()
    log_action("CREATE", "Advertisement", ad.id, f"Created ad '{ad.title}'")
    return jsonify(ad.to_dict()), 201

@advertisements_bp.route("/<ad_id>", methods=["PUT"])
def update_advertisement(ad_id):
    try:
        numeric_id = int(ad_id)
        ad = Advertisement.query.get(numeric_id)
    except (ValueError, TypeError):
        ad = None
    if not ad:
        return jsonify({"error": "Advertisement not found"}), 404

    data = request.get_json() or {}
    if "title" in data:
        ad.title = data["title"].strip()
    if "subtitle" in data:
        ad.subtitle = data["subtitle"].strip()
    if "imageUrl" in data or "image_url" in data:
        ad.image_url = (data.get("imageUrl") or data.get("image_url") or "").strip()
    if "badge" in data:
        ad.badge = data["badge"].strip()
    if "ctaText" in data or "cta_text" in data:
        ad.cta_text = (data.get("ctaText") or data.get("cta_text") or "").strip()
    if "ctaLink" in data or "cta_link" in data:
        val = data.get("ctaLink") if "ctaLink" in data else data.get("cta_link")
        ad.cta_link = (val or "").strip()
    if "targetAudience" in data:
        ad.target_audience = data["targetAudience"].strip()
    if "active" in data:
        ad.active = bool(data["active"])

    db.session.commit()
    log_action("UPDATE", "Advertisement", ad.id, f"Updated ad '{ad.title}'")
    return jsonify(ad.to_dict())

@advertisements_bp.route("/<ad_id>", methods=["DELETE"])
def delete_advertisement(ad_id):
    try:
        numeric_id = int(ad_id)
        ad = Advertisement.query.get(numeric_id)
    except (ValueError, TypeError):
        ad = None
    if not ad:
        return jsonify({"error": "Advertisement not found"}), 404

    ad_id_str = str(ad.id)
    title = ad.title
    db.session.delete(ad)
    db.session.commit()
    log_action("DELETE", "Advertisement", ad_id_str, f"Deleted ad '{title}'")
    return jsonify({"deleted": True})
