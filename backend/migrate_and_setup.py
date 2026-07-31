import sys
import subprocess

# Ensure all dependencies from requirements.txt are installed
try:
    import pymysql
    import flask
    from dotenv import load_dotenv
except ImportError:
    print("Missing backend dependencies detected. Auto-installing requirements.txt...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    import pymysql
    import flask
    from dotenv import load_dotenv

import os
load_dotenv()

db_name = "crafzio_billingpos"

print(f"Connecting to MySQL server to ensure database '{db_name}' exists...")

try:
    # Connect to local XAMPP MySQL server
    conn = pymysql.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="",
        autocommit=True
    )
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print(f"[SUCCESS] Database '{db_name}' is verified and ready on MySQL server.")
    conn.close()
except Exception as e:
    print(f"[ERROR] Failed to connect to MySQL server: {e}")
    print("Please ensure XAMPP MySQL module is STARTED in XAMPP Control Panel.")
    sys.exit(1)

# Import Flask app and initialize database tables
from app import create_app, db
import app.models
from sqlalchemy import inspect

app = create_app()

with app.app_context():
    print("Creating and updating database tables for Flask models...")
    db.create_all()
    
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"[SUCCESS] MySQL database '{db_name}' contains the following {len(tables)} tables:")
    for t in sorted(tables):
        print(f"  - {t}")

print("\nDatabase migration completed successfully!")
