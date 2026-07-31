import os
from app import create_app

env_name = os.environ.get("FLASK_ENV", "production")
app = create_app(env_name)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() in ("true", "1", "yes")
    app.run(host="0.0.0.0", port=port, debug=debug_mode)

