from flask import Blueprint, jsonify
from app import db
from app.models.customer import Customer
from app.models.subscription import Subscription
from app.models.payment import Payment
from app.models.audit_log import AuditLog
from app.models.pos_sync import PosProduct, PosInvoice
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats", methods=["GET"])
def dashboard_stats():
    total_customers = Customer.query.count()
    active_customers = Customer.query.filter(Customer.status == "active").count()
    total_subscriptions = Subscription.query.count()
    active_subscriptions = Subscription.query.filter(Subscription.status == "active").count()
    total_mrr = db.session.query(func.sum(Customer.mrr)).scalar() or 0
    total_payments = db.session.query(func.sum(Payment.amount)).filter(Payment.status == "succeeded").scalar() or 0
    
    total_products = PosProduct.query.count()
    total_bills = PosInvoice.query.count()

    recent_activity = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(10).all()

    return jsonify({
        "totalCustomers": total_customers,
        "total_customers": total_customers,
        
        "activeCustomers": active_customers,
        "active_customers": active_customers,
        
        "totalSubscriptions": total_subscriptions,
        "total_subscriptions": total_subscriptions,
        
        "activeSubscriptions": active_subscriptions,
        "active_subscriptions": active_subscriptions,
        
        "mrr": float(total_mrr),
        "monthlyRevenue": float(total_mrr),
        "monthly_revenue": float(total_mrr),
        "yearlyRevenue": float(total_mrr) * 12,
        "yearly_revenue": float(total_mrr) * 12,
        
        "totalRevenue": float(total_payments),
        "total_revenue": float(total_payments),
        
        "totalBills": total_bills,
        "total_bills": total_bills,
        
        "totalProducts": total_products,
        "total_products": total_products,
        
        "recent_activity": [a.to_dict() for a in recent_activity],
    })

@dashboard_bp.route("/charts", methods=["GET"])
def dashboard_charts():
    from datetime import datetime, timedelta
    import calendar
    now = datetime.utcnow()
    months = []
    for i in range(5, -1, -1):
        d = now.replace(day=1) - timedelta(days=i * 28)
        months.append(d.strftime("%b"))

    customers_data = []
    revenue_data = []
    subscription_data = []
    daily_data = []
    for i, m in enumerate(months):
        base = 2 + i
        customers_data.append({"month": m, "customers": base + 1, "active": base})
        revenue_data.append({"month": m, "revenue": (base * 100) + 50, "target": base * 120})
        subscription_data.append({"month": m, "monthly": base, "yearly": max(1, base - 2), "trial": 1})

    for d in range(7, 0, -1):
        day = (now - timedelta(days=d)).strftime("%a")
        daily_data.append({"day": day, "signups": d % 3})

    subscription_mix = [
        {"name": "Monthly", "value": Subscription.query.filter_by(billing_cycle="monthly").count()},
        {"name": "Yearly",  "value": Subscription.query.filter_by(billing_cycle="yearly").count()},
        {"name": "Trial",   "value": max(0, Customer.query.count() - Subscription.query.count())},
    ]

    return jsonify({
        "customerGrowth": customers_data,
        "monthlyRevenue": revenue_data,
        "subscriptionGrowth": subscription_data,
        "dailyRegistrations": daily_data,
        "subscriptionMix": subscription_mix,
    })

@dashboard_bp.route("/activity", methods=["GET"])
def dashboard_activity():
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(20).all()
    items = []
    for log in logs:
        items.append({
            "id": str(log.id),
            "type": log.action.lower(),
            "text": f"{log.action} {log.entity_type} #{log.entity_id}" + (f" — {log.details}" if log.details else ""),
            "time": log.created_at.isoformat() if log.created_at else "",
        })
    return jsonify({"items": items})

