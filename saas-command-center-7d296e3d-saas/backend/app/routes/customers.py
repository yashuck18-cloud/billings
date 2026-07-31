from flask import Blueprint, request, jsonify
from app import db
from app.models.customer import Customer
from app.models.audit_log import AuditLog
import json
from datetime import datetime
from app.models.pos_sync import PosCategory, PosProduct, PosStockHistory, PosInvoice, PosInvoiceItem, PosCreditDue

customers_bp = Blueprint("customers", __name__)

def log_action(action, entity_type, entity_id, details=None, user_email="system", user_name=None, user_role="Store User", organization=None, module_name="Store Operations", action_type="UPDATE"):
    try:
        log = AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id),
            user_id=str(entity_id),
            user_email=user_email,
            user_name=user_name or user_email,
            user_role=user_role,
            organization=organization or "Store POS System",
            module_name=module_name,
            action_type=action_type,
            details=details,
            status="SUCCESS",
            ip_address=request.remote_addr or "127.0.0.1",
            request_url=request.path if request else "/api",
            http_method=request.method if request else "POST",
        )
        db.session.add(log)
        db.session.commit()
    except Exception:
        db.session.rollback()

@customers_bp.route("", methods=["GET"])
def list_customers():
    q = request.args.get("q", "").strip()
    status = request.args.get("status", "").strip()
    query = Customer.query
    if q:
        query = query.filter(
            db.or_(
                Customer.name.ilike(f"%{q}%"),
                Customer.email.ilike(f"%{q}%"),
                Customer.company.ilike(f"%{q}%"),
            )
        )
    if status:
        query = query.filter(Customer.status.ilike(status))
    customers = query.order_by(Customer.created_at.desc()).all()
    if not customers and not q and not status:
        c1 = Customer(
            name="Rajesh Kumar",
            email="apex@bakery.com",
            company="Apex Bakery & Retail",
            phone="+91 98765 43210",
            status="active",
            plan="Yearly Pro",
            mrr=99.0
        )
        c2 = Customer(
            name="Anil Sharma",
            email="star@supermarket.com",
            company="Star Supermarket",
            phone="+91 91234 56789",
            status="active",
            plan="Monthly Standard",
            mrr=49.0
        )
        db.session.add(c1)
        db.session.add(c2)
        db.session.commit()
        customers = [c1, c2]
    return jsonify([c.to_dict() for c in customers])

def get_customer_by_id_param(customer_id_param):
    if not customer_id_param:
        return Customer.query.first()

    param_str = str(customer_id_param).strip()

    # 1. Try direct integer ID lookup
    try:
        val = int(param_str)
        customer = Customer.query.get(val)
        if customer:
            return customer
    except (ValueError, TypeError):
        pass

    # 2. Try lookup by exact email
    c_email = Customer.query.filter(db.func.lower(Customer.email) == param_str.lower()).first()
    if c_email:
        return c_email

    # 3. Try lookup by CUS- formatted string (e.g. CUS-1, CUS-2, CUS-1001)
    if param_str.upper().startswith("CUS-"):
        parts = param_str.split("-")
        if len(parts) == 2 and parts[1].isdigit():
            num = int(parts[1])
            # Direct ID match
            c_direct = Customer.query.get(num)
            if c_direct:
                return c_direct
            # 1000 offset match
            if num > 1000:
                c_offset = Customer.query.get(num - 1000)
                if c_offset:
                    return c_offset

    # 4. Try lookup by company or name
    c_company = Customer.query.filter(db.func.lower(Customer.company) == param_str.lower()).first()
    if c_company:
        return c_company

    c_name = Customer.query.filter(db.func.lower(Customer.name) == param_str.lower()).first()
    if c_name:
        return c_name

    # 5. Fallback to first customer if exists
    customer = Customer.query.first()
    if customer:
        return customer

    # 6. Default fallback customer if table is completely empty
    default_customer = Customer(
        name="Demo Customer",
        email="demo@nexus.io",
        company="Demo Corp",
        status="active",
        plan="Professional",
        mrr=99.0
    )
    db.session.add(default_customer)
    db.session.commit()
    return default_customer

@customers_bp.route("/<customer_id_param>", methods=["GET"])
def get_customer(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    return jsonify(customer.to_dict())

@customers_bp.route("", methods=["POST"])
def create_customer():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "Email address is required"}), 400

    # Check if email already exists
    existing = Customer.query.filter(db.func.lower(Customer.email) == email).first()
    if existing:
        return jsonify({"error": f"A customer with email '{email}' already exists."}), 400

    from werkzeug.security import generate_password_hash
    password = data.get("password", "")
    password_hash = generate_password_hash(password) if password else None

    # Map React keys to DB schema
    name = data.get("ownerName") or data.get("name") or ""
    company = data.get("businessName") or data.get("company") or ""
    phone = data.get("mobile") or data.get("phone") or ""
    plan = data.get("subscriptionType") or data.get("plan") or "trial"

    config_dict = {}
    if data.get("expiryDate"):
        config_dict["expiryDate"] = data.get("expiryDate")
    if data.get("createdAt"):
        config_dict["createdAt"] = data.get("createdAt")
    if data.get("subscriptionType"):
        config_dict["subscriptionType"] = data.get("subscriptionType")
    if data.get("features"):
        config_dict["modules"] = data.get("features")

    global_theme = get_global_theme_settings()
    if "festivalTheme" in global_theme:
        config_dict["festivalTheme"] = global_theme["festivalTheme"]
        config_dict["appTheme"] = global_theme["festivalTheme"]
    if "festivalBannerUrl" in global_theme:
        config_dict["festivalBannerUrl"] = global_theme["festivalBannerUrl"]
    if "festivalBannerImages" in global_theme:
        config_dict["festivalBannerImages"] = global_theme["festivalBannerImages"]

    try:
        customer = Customer(
            name=name,
            email=email,
            company=company,
            phone=phone,
            status=data.get("status", "trial" if plan == "trial" else "active"),
            plan=plan,
            mrr=data.get("mrr", 0),
            password_hash=password_hash,
            config=json.dumps(config_dict) if config_dict else None,
        )
        db.session.add(customer)
        db.session.commit()
        log_action("CREATE", "Customer", customer.id, f"Created customer {customer.email}")
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create customer: {str(e)}"}), 400

@customers_bp.route("/<customer_id_param>", methods=["PUT"])
def update_customer(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    data = request.get_json() or {}
    
    # Handle both React payload keys and legacy/DB keys
    if "ownerName" in data or "name" in data:
        customer.name = data.get("ownerName") or data.get("name")
    if "email" in data:
        customer.email = data.get("email").strip().lower()
    if "businessName" in data or "company" in data:
        customer.company = data.get("businessName") or data.get("company")
    if "mobile" in data or "phone" in data:
        customer.phone = data.get("mobile") or data.get("phone")
    if "status" in data:
        customer.status = data.get("status")
    if "subscriptionType" in data or "plan" in data:
        customer.plan = data.get("subscriptionType") or data.get("plan")

    # Update fields in config JSON if provided
    config_dict = {}
    if customer.config:
        try:
            config_dict = json.loads(customer.config)
        except Exception:
            pass
    if "expiryDate" in data:
        config_dict["expiryDate"] = data["expiryDate"]
    if "createdAt" in data:
        config_dict["createdAt"] = data["createdAt"]
    if "subscriptionType" in data:
        config_dict["subscriptionType"] = data["subscriptionType"]
    if "features" in data:
        config_dict["modules"] = data["features"]
    if config_dict:
        customer.config = json.dumps(config_dict)
        
    if "mrr" in data:
        customer.mrr = data["mrr"]
    if "password" in data and data["password"]:
        from werkzeug.security import generate_password_hash
        customer.password_hash = generate_password_hash(data["password"])
        
    db.session.commit()
    log_action("UPDATE", "Customer", customer.id, f"Updated customer {customer.email}")
    return jsonify(customer.to_dict())

@customers_bp.route("/<customer_id_param>", methods=["DELETE"])
def delete_customer(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    customer_id = customer.id
    
    # Delete related records to prevent foreign key constraint violations
    from app.models.subscription import Subscription
    from app.models.payment import Payment
    from app.models.pos_sync import PosCategory, PosProduct, PosStockHistory, PosInvoice, PosInvoiceItem
    
    # 1. Delete Invoice items first, then invoices
    invoices = PosInvoice.query.filter_by(customer_id=customer_id).all()
    for inv in invoices:
        PosInvoiceItem.query.filter_by(invoice_db_id=inv.db_id).delete()
        db.session.delete(inv)
        
    # 2. Delete other sync models
    PosStockHistory.query.filter_by(customer_id=customer_id).delete()
    PosProduct.query.filter_by(customer_id=customer_id).delete()
    PosCategory.query.filter_by(customer_id=customer_id).delete()
    
    # 3. Delete subscriptions and payments
    Payment.query.filter_by(customer_id=customer_id).delete()
    Subscription.query.filter_by(customer_id=customer_id).delete()
    
    # 4. Delete the customer
    db.session.delete(customer)
    db.session.commit()
    log_action("DELETE", "Customer", customer_id, f"Deleted customer {customer.email}")
    return jsonify({"deleted": True})

@customers_bp.route("/<customer_id_param>/layouts", methods=["GET"])
def get_customer_layouts(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    layouts_data = {}
    if customer.layouts:
        try:
            layouts_data = json.loads(customer.layouts)
        except Exception:
            layouts_data = {"raw": customer.layouts}
    return jsonify(layouts_data)

@customers_bp.route("/<customer_id_param>/layouts", methods=["PUT"])
def update_customer_layouts(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    data = request.get_json() or {}
    customer.layouts = json.dumps(data)
    db.session.commit()
    log_action("UPDATE", "CustomerLayouts", customer.id, f"Updated layouts for customer {customer.email}")
    return jsonify(data)

def get_global_theme_settings():
    try:
        from app.models.setting import Setting
        settings = Setting.query.filter(Setting.section.in_(["theme", "general"])).all()
        res = {}
        for s in settings:
            res[s.key] = s.value
        return res
    except Exception:
        return {}

@customers_bp.route("/<customer_id_param>/config", methods=["GET"])
def get_customer_config(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    config_data = {}
    if customer.config:
        try:
            config_data = json.loads(customer.config)
        except Exception:
            config_data = {"raw": customer.config}

    global_theme = get_global_theme_settings()
    if "festivalTheme" not in config_data or not config_data.get("festivalTheme"):
        if "festivalTheme" in global_theme:
            config_data["festivalTheme"] = global_theme["festivalTheme"]
            config_data["appTheme"] = global_theme["festivalTheme"]
    if "festivalBannerUrl" not in config_data or not config_data.get("festivalBannerUrl"):
        if "festivalBannerUrl" in global_theme:
            config_data["festivalBannerUrl"] = global_theme["festivalBannerUrl"]
    if "festivalBannerImages" not in config_data or not config_data.get("festivalBannerImages"):
        if "festivalBannerImages" in global_theme:
            config_data["festivalBannerImages"] = global_theme["festivalBannerImages"]

    config_data["status"] = customer.status
    config_data["subscriptionType"] = customer.plan or config_data.get("subscriptionType", "trial")
    config_data["customer_id"] = customer.id
    return jsonify(config_data)

@customers_bp.route("/<customer_id_param>/features", methods=["PUT"])
def update_customer_features(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    data = request.get_json() or {}
    features = data.get("features", [])
    
    config_data = {}
    if customer.config:
        try:
            config_data = json.loads(customer.config)
        except Exception:
            pass
            
    config_data["modules"] = features
    customer.config = json.dumps(config_data)
    db.session.commit()
    
    log_action("UPDATE", "CustomerFeatures", customer.id, f"Updated features/modules for customer {customer.email}")
    return jsonify(customer.to_dict())

@customers_bp.route("/<customer_id_param>/sync", methods=["POST"])
def sync_customer_data(customer_id_param):
    customer = get_customer_by_id_param(customer_id_param)
    if not customer:
        return jsonify({"error": "Customer account not found."}), 404

    # Check for subscription expiry date inside config JSON
    if customer.config and customer.status != "suspended":
        try:
            cfg = json.loads(customer.config)
            expiry_str = cfg.get("expiryDate")
            if expiry_str:
                exp_dt = datetime.fromisoformat(str(expiry_str).replace("Z", "+00:00"))
                if exp_dt < datetime.utcnow():
                    customer.status = "suspended"
                    db.session.commit()
                    log_action("AUTO_SUSPEND", "Customer", customer.id, f"Automatically suspended expired customer {customer.email}")
        except Exception:
            pass

    if customer.status == "suspended":
        return jsonify({"error": "Account suspended. Subscription expired or disabled by admin."}), 403

    data = request.get_json() or {}

    try:
        # 1. Sync Categories
        if "categories" in data:
            categories_data = data.get("categories", [])
            active_cat_ids = set()
            for cat in categories_data:
                cat_id = str(cat.get("id", "")).strip()
                if not cat_id:
                    continue
                active_cat_ids.add(cat_id)
                db_cat = PosCategory.query.filter_by(id=cat_id, customer_id=customer.id).first()
                if not db_cat:
                    db_cat = PosCategory(id=cat_id, customer_id=customer.id)
                    db.session.add(db_cat)
                db_cat.name = str(cat.get("name", ""))
                db_cat.description = str(cat.get("description", ""))

            deleted_cat_ids = set(data.get("deletedCategoryIds", []))
            existing_cats = PosCategory.query.filter_by(customer_id=customer.id).all()
            for ec in existing_cats:
                if ec.id in deleted_cat_ids or (isinstance(data.get("categories"), list) and ec.id not in active_cat_ids):
                    db.session.delete(ec)

        # 2. Sync Products
        if "products" in data:
            products_data = data.get("products", [])
            active_prod_ids = set()
            for prod in products_data:
                prod_id = str(prod.get("id", "")).strip()
                if not prod_id:
                    continue
                active_prod_ids.add(prod_id)
                db_prod = PosProduct.query.filter_by(id=prod_id, customer_id=customer.id).first()
                if not db_prod:
                    db_prod = PosProduct(id=prod_id, customer_id=customer.id)
                    db.session.add(db_prod)
                db_prod.name = str(prod.get("name", ""))
                db_prod.categoryId = prod.get("categoryId")
                db_prod.brand = prod.get("brand")
                db_prod.unit = prod.get("unit")
                db_prod.quantity = float(prod.get("quantity", 0.0))
                db_prod.defaultSellingPrice = float(prod.get("defaultSellingPrice", 0.0))
                db_prod.purchasePrice = float(prod.get("purchasePrice", 0.0))
                db_prod.lowStockAlert = float(prod.get("lowStockAlert", 0.0))
                db_prod.maxStockLimit = float(prod.get("maxStockLimit")) if prod.get("maxStockLimit") is not None else None
                db_prod.barcode = prod.get("barcode")

            deleted_prod_ids = set(data.get("deletedProductIds", []))
            existing_prods = PosProduct.query.filter_by(customer_id=customer.id).all()
            for ep in existing_prods:
                if ep.id in deleted_prod_ids or (isinstance(data.get("products"), list) and ep.id not in active_prod_ids):
                    db.session.delete(ep)

        # 3. Sync Stock History
        stock_data = data.get("stockHistory", [])
        for sh in stock_data:
            sh_id = str(sh.get("id", "")).strip()
            if not sh_id:
                continue
            db_sh = PosStockHistory.query.filter_by(id=sh_id, customer_id=customer.id).first()
            if not db_sh:
                db_sh = PosStockHistory(id=sh_id, customer_id=customer.id)
                db.session.add(db_sh)
            db_sh.productId = str(sh.get("productId", ""))
            db_sh.productName = str(sh.get("productName", ""))
            db_sh.quantityChanged = float(sh.get("quantityChanged", 0.0))
            db_sh.type = str(sh.get("type", "ADD"))
            
            ts_str = sh.get("timestamp")
            if ts_str:
                try:
                    db_sh.timestamp = datetime.fromisoformat(str(ts_str).replace("Z", "+00:00"))
                except Exception:
                    db_sh.timestamp = datetime.utcnow()
            else:
                db_sh.timestamp = datetime.utcnow()
                
            db_sh.note = sh.get("note")

        # 4. Sync Invoices
        invoices_data = data.get("invoices", [])
        for inv in invoices_data:
            inv_id = str(inv.get("id", "")).strip()
            if not inv_id:
                continue
            db_inv = PosInvoice.query.filter_by(id=inv_id, customer_id=customer.id).first()
            if not db_inv:
                db_inv = PosInvoice(id=inv_id, customer_id=customer.id)
                db.session.add(db_inv)
            db_inv.invoiceNumber = str(inv.get("invoiceNumber", ""))
            
            dt_str = inv.get("dateTime")
            if dt_str:
                try:
                    db_inv.dateTime = datetime.fromisoformat(str(dt_str).replace("Z", "+00:00"))
                except Exception:
                    db_inv.dateTime = datetime.utcnow()
            else:
                db_inv.dateTime = datetime.utcnow()
                
            db_inv.subTotal = float(inv.get("subTotal", 0.0))
            db_inv.discount = float(inv.get("discount", 0.0))
            db_inv.grandTotal = float(inv.get("grandTotal", 0.0))
            db_inv.notes = inv.get("notes")
            
            db.session.flush()
            
            PosInvoiceItem.query.filter_by(invoice_db_id=db_inv.db_id).delete()
            for item in inv.get("items", []):
                db_item = PosInvoiceItem(
                    invoice_db_id=db_inv.db_id,
                    productId=str(item.get("productId", "")),
                    productName=str(item.get("productName", "")),
                    unit=item.get("unit"),
                    defaultPrice=float(item.get("defaultPrice", 0.0)),
                    billingPrice=float(item.get("billingPrice", 0.0)),
                    purchasePrice=float(item.get("purchasePrice", 0.0)),
                    quantity=float(item.get("quantity", 0.0)),
                    billingMethod=item.get("billingMethod"),
                    total=float(item.get("total", 0.0)),
                )
                db.session.add(db_item)

        # 5. Sync Credit Dues
        if "creditDues" in data:
            credit_dues_data = data.get("creditDues", [])
            active_cd_ids = set()
            for cd in credit_dues_data:
                cd_id = str(cd.get("id", "")).strip()
                if not cd_id:
                    continue
                active_cd_ids.add(cd_id)
                db_cd = PosCreditDue.query.filter_by(id=cd_id, customer_id=customer.id).first()
                if not db_cd:
                    db_cd = PosCreditDue(id=cd_id, customer_id=customer.id)
                    db.session.add(db_cd)
                db_cd.customerName = str(cd.get("customerName", "Customer"))
                db_cd.customerPhone = cd.get("customerPhone", "")
                db_cd.invoiceNumber = cd.get("invoiceNumber", "")
                db_cd.totalAmount = float(cd.get("totalAmount", 0.0))
                db_cd.paidAmount = float(cd.get("paidAmount", 0.0))
                db_cd.dueAmount = float(cd.get("dueAmount", 0.0))
                db_cd.status = str(cd.get("status", "PENDING"))
                db_cd.notes = cd.get("notes")

                due_str = cd.get("dueDate")
                if due_str:
                    try:
                        db_cd.dueDate = datetime.fromisoformat(str(due_str).replace("Z", "+00:00"))
                    except Exception:
                        pass
                created_str = cd.get("createdDate")
                if created_str:
                    try:
                        db_cd.createdDate = datetime.fromisoformat(str(created_str).replace("Z", "+00:00"))
                    except Exception:
                        pass

            deleted_cd_ids = set(data.get("deletedCreditDueIds", []))
            existing_cds = PosCreditDue.query.filter_by(customer_id=customer.id).all()
            for ecd in existing_cds:
                if ecd.id in deleted_cd_ids or (isinstance(data.get("creditDues"), list) and ecd.id not in active_cd_ids):
                    db.session.delete(ecd)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error syncing data for customer {customer_id_param}: {e}")
        return jsonify({"error": f"Failed to save sync payload to database: {str(e)}"}), 500

    # Retrieve current configurations
    config_data = {}
    if customer.config:
        try:
            config_data = json.loads(customer.config)
        except Exception:
            pass

    # Merge global Setting theme configurations if key is not set in customer config
    try:
        from app.models.setting import Setting
        theme_settings = Setting.query.filter_by(section="theme").all()
        for ts in theme_settings:
            if ts.key not in config_data:
                config_data[ts.key] = ts.value
    except Exception:
        pass
    layouts_data = {}
    if customer.layouts:
        try:
            layouts_data = json.loads(customer.layouts)
        except Exception:
            pass

    # Fetch dynamic synced records to sync back to POS client
    db_categories = PosCategory.query.filter_by(customer_id=customer.id).all()
    db_products = PosProduct.query.filter_by(customer_id=customer.id).all()
    db_stock = PosStockHistory.query.filter_by(customer_id=customer.id).all()
    db_invoices = PosInvoice.query.filter_by(customer_id=customer.id).all()
    db_credit_dues = PosCreditDue.query.filter_by(customer_id=customer.id).all()

    return jsonify({
        "success": True,
        "customer": {
            "id": customer.id,
            "businessName": customer.company or customer.name,
            "ownerName": customer.name,
            "email": customer.email,
            "mobile": customer.phone,
        },
        "config": config_data,
        "layouts": layouts_data,
        "categories": [c.to_dict() for c in db_categories],
        "products": [p.to_dict() for p in db_products],
        "stockHistory": [s.to_dict() for s in db_stock],
        "invoices": [i.to_dict() for i in db_invoices],
        "creditDues": [cd.to_dict() for cd in db_credit_dues],
    })

@customers_bp.route("/<customer_id_param>/config", methods=["POST", "PUT"])
def update_customer_config(customer_id_param):
    data = request.get_json(silent=True) or {}
    param_str = str(customer_id_param).strip().lower()

    if data.get("festivalBannerImages") in ["[]", "", None] or not data.get("festivalBannerImages"):
        data["festivalBannerUrl"] = ""

    # Save festival theme & banner photos to global Setting model if provided
    try:
        from app.models.setting import Setting
        for k in ["festivalTheme", "festivalBannerUrl", "festivalBannerImages"]:
            if k in data:
                val = str(data[k])
                s = Setting.query.filter_by(section="theme", key=k).first()
                if s:
                    s.value = val
                else:
                    db.session.add(Setting(section="theme", key=k, value=val))
    except Exception as sqle:
        print(f"Warning: Failed to update global Setting: {sqle}")

    if param_str in ["all", "global"]:
        all_customers = Customer.query.all()
        for cust in all_customers:
            current_config = {}
            if cust.config:
                try:
                    current_config = json.loads(cust.config)
                except Exception:
                    pass
            current_config.update(data)
            cust.config = json.dumps(current_config)
        db.session.commit()
        log_action("UPDATE_GLOBAL_CONFIG", "SystemConfig", "all", f"Updated global config for all {len(all_customers)} customers")
        return jsonify({"success": True, "updated_count": len(all_customers), "config": data})

    customer = get_customer_by_id_param(customer_id_param)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    current_config = {}
    if customer.config:
        try:
            current_config = json.loads(customer.config)
        except Exception:
            pass
    current_config.update(data)
    customer.config = json.dumps(current_config)
    db.session.commit()
    log_action("UPDATE", "CustomerConfig", customer.id, f"Updated config for customer {customer.email}")
    return jsonify(current_config)
