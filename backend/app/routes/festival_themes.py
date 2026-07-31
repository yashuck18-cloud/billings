from flask import Blueprint, request, jsonify
from app import db
from app.models.festival_theme import FestivalTheme
from app.models.audit_log import AuditLog
from datetime import datetime, timezone

festival_themes_bp = Blueprint("festival_themes", __name__)

DEFAULT_THEMES = [
    {
        "id": "standard",
        "name": "Standard Apex Indigo",
        "tagline": "Modern Sleek Professional",
        "greeting": "Welcome back to your POS Dashboard",
        "icon": "⚡",
        "badge": "PROMO",
        "badge_bg": "#F59E0B",
        "gradient": "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
        "accent": "#4F46E5",
        "description": "Default sleek dark indigo theme designed for high-efficiency daily retail operations.",
        "is_default": True,
    },
    {
        "id": "ugadi",
        "name": "Ugadi Festival Theme 🌿",
        "tagline": "Fresh Mango Green & Gold",
        "greeting": "🌿 Happy Ugadi! May this New Year bring joy, health & prosperity.",
        "icon": "🌿",
        "badge": "UGADI SPECIAL",
        "badge_bg": "#F59E0B",
        "gradient": "from-[#064E3B] via-[#047857] to-[#D97706]",
        "accent": "#10B981",
        "description": "Vibrant traditional theme with mango leaves, marigold gold accents and festive greetings.",
        "is_default": True,
    },
    {
        "id": "diwali",
        "name": "Diwali Festival Theme 🪔",
        "tagline": "Golden Diya & Deep Maroon",
        "greeting": "🪔 Happy Diwali! May the festival of lights bring success & warmth.",
        "icon": "🪔",
        "badge": "DIWALI OFFER",
        "badge_bg": "#FBBF24",
        "gradient": "from-[#4C0519] via-[#881337] to-[#D97706]",
        "accent": "#F43F5E",
        "description": "Rich maroon background with golden rangoli sparkles, warm diya lighting and festive discounts.",
        "is_default": True,
    },
    {
        "id": "holi",
        "name": "Holi Festival Colors 🎨",
        "tagline": "Neon Splash & Magenta",
        "greeting": "🎨 Happy Holi! Spread colors of happiness & prosperity across your store.",
        "icon": "🎨",
        "badge": "HOLI COLORS",
        "badge_bg": "#22C55E",
        "gradient": "from-[#581C87] via-[#C026D3] to-[#06B6D4]",
        "accent": "#EC4899",
        "description": "Playful high-energy neon color splash theme celebrating the festival of colors.",
        "is_default": True,
    },
    {
        "id": "christmas",
        "name": "Christmas & New Year ❄️",
        "tagline": "Crimson Red & Winter Snow",
        "greeting": "❄️ Merry Christmas & Happy New Year! Season's greetings to all your customers.",
        "icon": "❄️",
        "badge": "HOLIDAY DEAL",
        "badge_bg": "#F59E0B",
        "gradient": "from-[#0F172A] via-[#1E3A8A] to-[#991B1B]",
        "accent": "#EF4444",
        "description": "Cozy winter night background with snow sparkles, pine green and holiday gift styling.",
        "is_default": True,
    },
]

def seed_festival_themes_if_empty():
    if FestivalTheme.query.count() == 0:
        for t in DEFAULT_THEMES:
            theme = FestivalTheme(
                id=t["id"],
                name=t["name"],
                tagline=t["tagline"],
                greeting=t["greeting"],
                icon=t["icon"],
                badge=t["badge"],
                badge_bg=t["badge_bg"],
                gradient=t["gradient"],
                accent=t["accent"],
                description=t["description"],
                is_default=t["is_default"],
            )
            db.session.add(theme)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()

def log_action(action, entity_type, entity_id, details=None):
    try:
        log = AuditLog(action=action, entity_type=entity_type, entity_id=str(entity_id), details=details)
        db.session.add(log)
        db.session.commit()
    except Exception:
        db.session.rollback()

@festival_themes_bp.route("", methods=["GET"])
def list_themes():
    seed_festival_themes_if_empty()
    themes = FestivalTheme.query.order_by(FestivalTheme.created_at.asc()).all()
    return jsonify([t.to_dict() for t in themes])

@festival_themes_bp.route("", methods=["POST"])
def create_theme():
    seed_festival_themes_if_empty()
    data = request.get_json() or {}

    raw_id = data.get("id", "").strip().lower()
    name = data.get("name", "").strip()

    if not name:
        return jsonify({"error": "Theme name is required"}), 400

    if not raw_id:
        raw_id = name.lower().replace(" ", "_").replace("🌿", "").replace("🪔", "").replace("🎨", "").replace("❄️", "").strip("_")
        raw_id = f"theme_{raw_id}_{int(datetime.now(timezone.utc).timestamp())}"

    existing = FestivalTheme.query.get(raw_id)
    if existing:
        return jsonify({"error": f"Theme ID '{raw_id}' already exists"}), 400

    theme = FestivalTheme(
        id=raw_id,
        name=name,
        tagline=data.get("tagline", "Custom Festival Theme"),
        greeting=data.get("greeting", f"Happy {name}! Best wishes to all your customers."),
        icon=data.get("icon", "🎉"),
        badge=data.get("badge", "SPECIAL"),
        badge_bg=data.get("badgeBg") or data.get("badge_bg") or "#F59E0B",
        gradient=data.get("gradient", "from-[#1E1B4B] via-[#312E81] to-[#4338CA]"),
        accent=data.get("accent", "#4F46E5"),
        description=data.get("description", "Custom theme created by administrator."),
        is_default=False,
    )

    db.session.add(theme)
    db.session.commit()
    log_action("CREATE_THEME", "FestivalTheme", theme.id, f"Created festival theme '{theme.name}'")

    return jsonify(theme.to_dict()), 201

@festival_themes_bp.route("/<string:theme_id>", methods=["PUT"])
def update_theme(theme_id):
    seed_festival_themes_if_empty()
    theme = FestivalTheme.query.get(theme_id)
    if not theme:
        return jsonify({"error": "Theme not found"}), 404

    data = request.get_json() or {}

    if "name" in data:
        theme.name = data["name"].strip() or theme.name
    if "tagline" in data:
        theme.tagline = data["tagline"]
    if "greeting" in data:
        theme.greeting = data["greeting"]
    if "icon" in data:
        theme.icon = data["icon"]
    if "badge" in data:
        theme.badge = data["badge"]
    if "badgeBg" in data or "badge_bg" in data:
        theme.badge_bg = data.get("badgeBg") or data.get("badge_bg") or theme.badge_bg
    if "gradient" in data:
        theme.gradient = data["gradient"]
    if "accent" in data:
        theme.accent = data["accent"]
    if "description" in data:
        theme.description = data["description"]

    db.session.commit()
    log_action("UPDATE_THEME", "FestivalTheme", theme.id, f"Updated festival theme '{theme.name}'")

    return jsonify(theme.to_dict())

@festival_themes_bp.route("/<string:theme_id>", methods=["DELETE"])
def delete_theme(theme_id):
    seed_festival_themes_if_empty()
    theme = FestivalTheme.query.get(theme_id)
    if not theme:
        return jsonify({"error": "Theme not found"}), 404

    if theme.is_default or theme_id == "standard":
        return jsonify({"error": "Default system themes cannot be deleted."}), 400

    db.session.delete(theme)
    db.session.commit()
    log_action("DELETE_THEME", "FestivalTheme", theme_id, f"Deleted festival theme '{theme.name}'")

    return jsonify({"deleted": True, "id": theme_id})
