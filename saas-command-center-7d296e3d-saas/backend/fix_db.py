from app import create_app, db
import app.models  # load all models
from sqlalchemy import inspect, text

app = create_app()

with app.app_context():
    print("Checking MySQL database tables and columns...")
    inspector = inspect(db.engine)
    existing_tables = inspector.get_table_names()
    print("Existing tables in MySQL DB:", existing_tables)

    # Automatically discover all loaded SQLAlchemy models
    models = db.Model.__subclasses__()

    for model in models:
        if not hasattr(model, '__tablename__'):
            continue
        table_name = model.__tablename__
        if table_name in existing_tables:
            existing_columns = [col['name'] for col in inspector.get_columns(table_name)]
            model_columns = model.__table__.columns
            for col in model_columns:
                if col.name not in existing_columns:
                    print(f"Adding missing column '{col.name}' to table '{table_name}'...")
                    col_type = col.type.compile(db.engine.dialect)
                    nullable = "NULL" if col.nullable else "NOT NULL"
                    try:
                        alter_cmd = f"ALTER TABLE `{table_name}` ADD COLUMN `{col.name}` {col_type} {nullable}"
                        db.session.execute(text(alter_cmd))
                        db.session.commit()
                        print(f"[OK] Added column '{col.name}' to '{table_name}' successfully.")
                    except Exception as e:
                        db.session.rollback()
                        print(f"Error adding column '{col.name}' to '{table_name}': {e}")

    # Ensure all missing tables are created
    db.create_all()
    print("[OK] All database schemas are fully verified and synchronized!")
