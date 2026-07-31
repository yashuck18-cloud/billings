import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("nexus.config")

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    _db_url = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:@127.0.0.1:3306/crafzio_billingpos"
    )
    if _db_url.startswith("mysql://"):
        _db_url = _db_url.replace("mysql://", "mysql+pymysql://", 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 3600,
    }
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-dev-secret")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    _raw_cors = os.environ.get("CORS_ORIGINS", "*")
    CORS_ORIGINS = [o.strip() for o in _raw_cors.split(",") if o.strip()]

    @classmethod
    def init_app(cls, app):
        if app.config.get("ENV") == "production":
            if cls.SECRET_KEY == "dev-secret-key-change-in-production":
                logger.warning("SECURITY WARNING: Using default SECRET_KEY in production mode! Change SECRET_KEY in environment.")
            if cls.JWT_SECRET_KEY == "jwt-dev-secret":
                logger.warning("SECURITY WARNING: Using default JWT_SECRET_KEY in production mode! Change JWT_SECRET_KEY in environment.")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}

