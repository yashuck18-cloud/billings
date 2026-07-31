from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from app import db
from app.models.customer import Customer
from app.models.audit_log import AuditLog

auth_bp = Blueprint("auth", __name__)

# Demo admin user (in production use a proper users table)
ADMIN_EMAILS = {"admin@nexus.io", "admin@pos.com"}
ADMIN_PASSWORDS = {"demo1234", "admin123"}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()

    if not email or not password:
        return jsonify({"error": "Email address and password are required."}), 400

    # 1. Check Super Admin hardcoded demo credentials
    if email in ADMIN_EMAILS and password in ADMIN_PASSWORDS:
        import json
        identity_str = json.dumps({"email": email, "role": "admin"})
        token = create_access_token(identity=identity_str)
        try:
            log = AuditLog(
                action="ADMIN_LOGIN_SUCCESS",
                action_type="AUTHENTICATION",
                module_name="Authentication",
                entity_type="UserSession",
                user_email=email,
                user_name="Super Admin",
                user_role="Super Admin",
                organization="SaaS Command Center",
                details=f"Super Admin ({email}) logged in successfully.",
                status="SUCCESS",
                ip_address=request.remote_addr or "127.0.0.1",
                request_url="/api/auth/login",
                http_method="POST",
            )
            db.session.add(log)
            db.session.commit()
        except Exception:
            db.session.rollback()
        return jsonify({
            "access_token": token,
            "user": {
                "email": email,
                "name": "Super Admin",
                "role": "admin",
                "id": 0,
            }
        })

    # 2. Strict Customer Database Authentication (Email/Phone set by Admin on Website)
    customer = Customer.query.filter(
        (db.func.lower(db.func.trim(Customer.email)) == email) |
        (Customer.phone == email)
    ).first()

    if not customer:
        return jsonify({"error": "Account not found. Invalid email or password."}), 401

    if customer.status == "suspended":
        return jsonify({"error": "Account suspended. Please contact system support."}), 403

    # Verify password hash
    if customer.password_hash:
        if not check_password_hash(customer.password_hash, password):
            return jsonify({"error": "Invalid email or password."}), 401
    else:
        # First time login setup for existing store record
        if password:
            customer.password_hash = generate_password_hash(password)
            db.session.commit()
        else:
            return jsonify({"error": "Password is required."}), 401

    import json
    identity_str = json.dumps({"email": customer.email, "role": "user", "customer_id": customer.id})
    token = create_access_token(identity=identity_str)

    try:
        log = AuditLog(
            action="USER_LOGIN_SUCCESS",
            action_type="AUTHENTICATION",
            module_name="Authentication",
            entity_type="UserSession",
            entity_id=str(customer.id),
            user_id=str(customer.id),
            user_email=customer.email,
            user_name=customer.name,
            user_role="Store Owner",
            organization=customer.company or customer.name,
            details=f"Store owner {customer.email} ({customer.company or customer.name}) logged in successfully.",
            status="SUCCESS",
            ip_address=request.remote_addr or "127.0.0.1",
            request_url="/api/auth/login",
            http_method="POST",
        )
        db.session.add(log)
        db.session.commit()
    except Exception:
        db.session.rollback()

    return jsonify({
        "access_token": token, 
        "user": {
            "email": customer.email, 
            "name": customer.company or customer.name, 
            "phone": customer.phone or "",
            "mobile": customer.phone or "",
            "role": "user", 
            "id": customer.id
        }
    })

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    import json
    identity_raw = get_jwt_identity()
    try:
        identity = json.loads(identity_raw)
    except Exception:
        identity = identity_raw
    if isinstance(identity, dict) and "customer_id" in identity:
        customer = Customer.query.get(identity["customer_id"])
        if customer:
            return jsonify({
                "user": {
                    "id": customer.id,
                    "email": customer.email,
                    "name": customer.company or customer.name,
                    "role": "user",
                }
            })
    return jsonify({"user": identity})

@auth_bp.route("/impersonate/<int:customer_id>", methods=["POST"])
def impersonate(customer_id):
    from flask_jwt_extended import verify_jwt_in_request
    print("DEBUG: Impersonate request received for customer ID:", customer_id)
    print("DEBUG: Authorization header:", request.headers.get("Authorization"))
    try:
        verify_jwt_in_request()
    except Exception as e:
        print("DEBUG: verify_jwt_in_request failed with:", str(e))
        return jsonify({"error": f"JWT verification failed: {str(e)}"}), 422

    import json
    identity_raw = get_jwt_identity()
    print("DEBUG: JWT Identity decoded raw:", identity_raw)
    try:
        identity = json.loads(identity_raw)
    except Exception:
        identity = identity_raw
    
    if isinstance(identity, dict) and identity.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    customer = Customer.query.get_or_404(customer_id)
    import json
    identity_str = json.dumps({"email": customer.email, "role": "user", "customer_id": customer.id})
    token = create_access_token(identity=identity_str)
    return jsonify({
        "access_token": token,
        "user": {
            "email": customer.email,
            "name": customer.company or customer.name,
            "role": "user",
            "id": customer.id
        }
    })

@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    data = request.get_json() or {}
    customer_id = data.get("customer_id") or data.get("id")
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "").strip()

    from app.routes.customers import get_customer_by_id_param
    customer = None
    if customer_id:
        customer = get_customer_by_id_param(customer_id)
    if not customer and email:
        customer = Customer.query.filter(db.func.lower(db.func.trim(Customer.email)) == email).first()

    if not customer:
        customer = Customer.query.first()

    if not customer:
        return jsonify({"error": "Customer profile record not found."}), 404

    if name:
        customer.name = name
        customer.company = name
    if email:
        customer.email = email
    if password:
        customer.password_hash = generate_password_hash(password)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Profile updated successfully.",
        "user": {
            "id": customer.id,
            "name": customer.company or customer.name,
            "email": customer.email,
        }
    })

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = str(data.get("email", "")).strip().lower()
    if not email or "@" not in email:
        return jsonify({"error": "Valid email address is required."}), 400

    if email in ADMIN_EMAILS:
        return jsonify({
            "success": True,
            "message": "Account verified. You may reset your password.",
            "email": email
        })

    customer = Customer.query.filter(db.func.lower(db.func.trim(Customer.email)) == email).first()
    if not customer:
        return jsonify({"error": "No store account found with this email address. Please check your email or contact support."}), 404

    if customer.status == "suspended":
        return jsonify({"error": "Account suspended. Please contact system administrator."}), 403

    return jsonify({
        "success": True,
        "message": "Account verified. You may now reset your password.",
        "email": customer.email
    })

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    email = str(data.get("email", "")).strip().lower()
    new_password = str(data.get("new_password", "")).strip()

    if not email or not new_password:
        return jsonify({"error": "Email address and new password are required."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters."}), 400

    customer = Customer.query.filter(db.func.lower(db.func.trim(Customer.email)) == email).first()
    if not customer and email not in ADMIN_EMAILS:
        return jsonify({"error": "No store account found with this email address."}), 404

    if customer:
        customer.password_hash = generate_password_hash(new_password)
        db.session.commit()
        try:
            log = AuditLog(
                action="PASSWORD_RESET",
                action_type="AUTHENTICATION",
                module_name="Authentication",
                entity_type="UserSession",
                entity_id=str(customer.id),
                user_id=str(customer.id),
                user_email=customer.email,
                user_name=customer.name,
                user_role="Store Owner",
                organization=customer.company or customer.name,
                details=f"Password updated for {customer.email}.",
                status="SUCCESS",
                ip_address=request.remote_addr or "127.0.0.1",
                request_url="/api/auth/reset-password",
                http_method="POST",
            )
            db.session.add(log)
            db.session.commit()
        except Exception:
            db.session.rollback()

    return jsonify({
        "success": True,
        "message": "Password updated successfully. Please sign in with your new password."
    })

