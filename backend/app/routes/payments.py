from flask import Blueprint, request, jsonify
from app import db
from app.models.payment import Payment
from app.models.audit_log import AuditLog

payments_bp = Blueprint("payments", __name__)

from app.models.customer import Customer
from datetime import datetime, timezone, timedelta

def seed_default_payments_if_empty():
    if Payment.query.count() == 0:
        cust = Customer.query.first()
        cid = cust.id if cust else 1
        now = datetime.now(timezone.utc)
        defaults = [
            Payment(customer_id=cid, amount=2999.00, currency="INR", status="succeeded", payment_method="Razorpay UPI", created_at=now - timedelta(days=1)),
            Payment(customer_id=cid, amount=12999.00, currency="INR", status="succeeded", payment_method="Bank Wire Transfer", created_at=now - timedelta(days=15)),
            Payment(customer_id=cid, amount=2999.00, currency="INR", status="succeeded", payment_method="Credit Card", created_at=now - timedelta(days=30)),
        ]
        for p in defaults:
            db.session.add(p)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

def log_action(action, entity_type, entity_id, details=None):
    try:
        log = AuditLog(
            action=action,
            action_type="PAYMENT",
            module_name="Payments & Billing",
            entity_type=entity_type,
            entity_id=str(entity_id),
            user_email="admin@nexus.io",
            user_name="Super Admin",
            user_role="Super Admin",
            organization="Payment Ledger",
            details=details or f"{action} on {entity_type} {entity_id}",
            status="SUCCESS",
            ip_address=request.remote_addr or "127.0.0.1",
            request_url=request.path if request else "/api/payments",
            http_method=request.method if request else "POST",
        )
        db.session.add(log)
        db.session.commit()
    except Exception:
        db.session.rollback()

@payments_bp.route("", methods=["GET"])
def list_payments():
    seed_default_payments_if_empty()
    status = request.args.get("status", "").strip()
    search = request.args.get("search", "").strip()
    
    query = Payment.query

    if status and not status.lower().startswith("all"):
        query = query.filter(Payment.status.ilike(f"%{status}%"))
    if search:
        query = query.join(Customer).filter(
            (Customer.name.ilike(f"%{search}%")) |
            (Customer.email.ilike(f"%{search}%")) |
            (Payment.payment_method.ilike(f"%{search}%"))
        )

    payments = query.order_by(Payment.created_at.desc()).all()
    return jsonify([p.to_dict() for p in payments])

@payments_bp.route("/<int:payment_id>", methods=["GET"])
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify(payment.to_dict())

@payments_bp.route("", methods=["POST"])
def create_payment():
    data = request.get_json() or {}
    payment = Payment(
        customer_id=data.get("customer_id", 1),
        subscription_id=data.get("subscription_id"),
        amount=data.get("amount", 0),
        currency=data.get("currency", "INR"),
        status=data.get("status", "succeeded"),
        payment_method=data.get("payment_method", "Razorpay"),
    )
    db.session.add(payment)
    db.session.commit()
    log_action("RECORD_PAYMENT", "Payment", payment.id, f"Recorded subscription payment of {payment.currency} {payment.amount}")
    return jsonify(payment.to_dict()), 201

@payments_bp.route("/<int:payment_id>", methods=["PUT"])
def update_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    data = request.get_json() or {}
    payment.status = data.get("status", payment.status)
    db.session.commit()
    log_action("UPDATE_PAYMENT", "Payment", payment.id, f"Updated payment #{payment.id} status to {payment.status}")
    return jsonify(payment.to_dict())

@payments_bp.route("/<int:payment_id>", methods=["DELETE"])
def delete_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    db.session.delete(payment)
    db.session.commit()
    log_action("DELETE_PAYMENT", "Payment", payment_id, f"Deleted payment record #{payment_id}")
    return jsonify({"deleted": True})
