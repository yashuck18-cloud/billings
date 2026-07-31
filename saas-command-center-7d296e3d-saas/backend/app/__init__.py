import os
import logging
# pyrefly: ignore [missing-import]
from flask import Flask, jsonify
# pyrefly: ignore [missing-import]
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
# pyrefly: ignore [missing-import]
from flask_jwt_extended import JWTManager
from config import config
import firebase_config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
logger = logging.getLogger("nexus.app")

def create_app(config_name="default"):
    app = Flask(__name__)
    config_obj = config.get(config_name, config["default"])
    app.config.from_object(config_obj)
    config_obj.init_app(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    CORS(app, origins=cors_origins, supports_credentials=False)

    with app.app_context():
        try:
            import app.models as _models
            db.create_all()
        except Exception as e:
            logger.warning(f"Warning: db.create_all() error with primary DB: {e}. Switching to SQLite fallback...")
            try:
                sqlite_path = os.path.join(app.instance_path, "nexus_dev.db")
                os.makedirs(app.instance_path, exist_ok=True)
                app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{sqlite_path}"
                db.engine.dispose()
                db.init_app(app)
                db.create_all()
                logger.info(f"Successfully initialized SQLite database at {sqlite_path}")
            except Exception as sqle:
                logger.error(f"Fallback SQLite error: {sqle}")

    from app.routes.auth import auth_bp
    from app.routes.customers import customers_bp
    from app.routes.subscriptions import subscriptions_bp
    from app.routes.payments import payments_bp
    from app.routes.plans import plans_bp
    from app.routes.features import features_bp
    from app.routes.audit_logs import audit_logs_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.notifications import notifications_bp
    from app.routes.settings import settings_bp
    from app.routes.advertisements import advertisements_bp
    from app.routes.festival_themes import festival_themes_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(customers_bp, url_prefix="/api/customers")
    app.register_blueprint(subscriptions_bp, url_prefix="/api/subscriptions")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    app.register_blueprint(plans_bp, url_prefix="/api/plans")
    app.register_blueprint(features_bp, url_prefix="/api/features")
    app.register_blueprint(audit_logs_bp, url_prefix="/api/audit-logs")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")
    app.register_blueprint(advertisements_bp, url_prefix="/api/advertisements")
    app.register_blueprint(festival_themes_bp, url_prefix="/api/festival-themes")

    from app.seed import seed, clean_db
    app.cli.add_command(seed)
    app.cli.add_command(clean_db)

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "environment": app.config.get("ENV", "production")})

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad Request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not Found", "message": "The requested resource was not found on the server."}), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        logger.error(f"Internal server error: {e}")
        return jsonify({"error": "Internal Server Error", "message": "An internal server error occurred."}), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        logger.error(f"Unhandled exception: {e}", exc_info=True)
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

    return app

