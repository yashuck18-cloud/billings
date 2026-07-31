import click
from flask.cli import with_appcontext
from app import db
from app.models.customer import Customer
from app.models.plan import Plan
from app.models.subscription import Subscription
from app.models.payment import Payment
from app.models.audit_log import AuditLog
from app.models.notification import Notification, NotificationPref
from app.models.setting import Setting

@click.command("seed")
@with_appcontext
def seed():
    """Seed the database with demo data."""
    db.drop_all()
    db.create_all()

    # Plans
    plans = [
        Plan(name="Starter", description="For small teams", price_monthly=29, price_yearly=290, status="active"),
        Plan(name="Professional", description="For growing businesses", price_monthly=99, price_yearly=990, status="active"),
        Plan(name="Enterprise", description="For large organizations", price_monthly=299, price_yearly=2990, status="active"),
    ]
    db.session.add_all(plans)
    db.session.commit()

    # Customers
    customers = [
        Customer(name="Alice Johnson", email="alice@example.com", company="Acme Corp", status="active", plan="Professional", mrr=99),
        Customer(name="Bob Smith", email="bob@example.com", company="Globex", status="active", plan="Starter", mrr=29),
        Customer(name="Charlie Brown", email="charlie@example.com", company="Initech", status="inactive", plan="Starter", mrr=0),
        Customer(name="Diana Prince", email="diana@example.com", company="Wayne Ent", status="active", plan="Enterprise", mrr=299),
    ]
    db.session.add_all(customers)
    db.session.commit()

    # Subscriptions
    from datetime import datetime, timezone
    subs = [
        Subscription(customer_id=customers[0].id, plan_id=plans[1].id, status="active", billing_cycle="monthly", amount=99),
        Subscription(customer_id=customers[1].id, plan_id=plans[0].id, status="active", billing_cycle="monthly", amount=29),
        Subscription(customer_id=customers[3].id, plan_id=plans[2].id, status="active", billing_cycle="yearly", amount=2990),
    ]
    db.session.add_all(subs)
    db.session.commit()

    # Payments
    payments = [
        Payment(customer_id=customers[0].id, subscription_id=subs[0].id, amount=99, currency="USD", status="succeeded", payment_method="card"),
        Payment(customer_id=customers[1].id, subscription_id=subs[1].id, amount=29, currency="USD", status="succeeded", payment_method="card"),
        Payment(customer_id=customers[3].id, subscription_id=subs[2].id, amount=2990, currency="USD", status="succeeded", payment_method="bank_transfer"),
    ]
    db.session.add_all(payments)
    db.session.commit()

    # Audit logs
    logs = [
        AuditLog(action="CREATE", entity_type="Customer", entity_id=str(customers[0].id), user_email="admin@nexus.io", details="Created customer"),
        AuditLog(action="CREATE", entity_type="Subscription", entity_id=str(subs[0].id), user_email="admin@nexus.io", details="Created subscription"),
        AuditLog(action="CREATE", entity_type="Payment", entity_id=str(payments[0].id), user_email="admin@nexus.io", details="Processed payment"),
    ]
    db.session.add_all(logs)
    db.session.commit()

    # Notifications
    notifications = [
        Notification(title="Welcome", message="Welcome to Nexus Admin!", type="info"),
        Notification(title="Payment received", message="Payment of $99 received from Alice Johnson.", type="success"),
    ]
    db.session.add_all(notifications)
    db.session.commit()

    # Notification preferences
    prefs = NotificationPref()
    db.session.add(prefs)
    db.session.commit()

    # Settings
    settings = [
        Setting(section="company", key="name", value="Nexus Admin"),
        Setting(section="company", key="email", value="hello@nexus.io"),
        Setting(section="email", key="smtp_host", value="smtp.example.com"),
        Setting(section="email", key="smtp_port", value="587"),
        Setting(section="backup", key="auto_backup", value="true"),
        Setting(section="security", key="two_factor", value="false"),
    ]
    db.session.add_all(settings)
    db.session.commit()

    click.echo("Database seeded successfully.")

@click.command("clean-db")
@with_appcontext
def clean_db():
    """Reset database to a clean production state (keeps only default plans and settings structure)."""
    db.drop_all()
    db.create_all()

    # Base plans for production
    plans = [
        Plan(name="Starter", description="For small teams", price_monthly=29, price_yearly=290, status="active"),
        Plan(name="Professional", description="For growing businesses", price_monthly=99, price_yearly=990, status="active"),
        Plan(name="Enterprise", description="For large organizations", price_monthly=299, price_yearly=2990, status="active"),
    ]
    db.session.add_all(plans)

    # Base notification preferences default row
    prefs = NotificationPref()
    db.session.add(prefs)

    # Base settings structures
    settings = [
        Setting(section="company", key="name", value="Nexus Admin"),
        Setting(section="company", key="email", value="hello@nexus.io"),
        Setting(section="email", key="smtp_host", value="smtp.example.com"),
        Setting(section="email", key="smtp_port", value="587"),
        Setting(section="backup", key="auto_backup", value="true"),
        Setting(section="security", key="two_factor", value="false"),
    ]
    db.session.add_all(settings)
    db.session.commit()

    click.echo("Database cleaned and initialized for production successfully.")
