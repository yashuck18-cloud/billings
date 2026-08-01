import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { H as Plus, I as Save, K as Palette, Kt as Blocks, L as RotateCcw, P as Search, bt as EyeOff, g as Trash2, ht as GripVertical, it as LockOpen, l as UserCog, q as Package, rt as Lock, st as LayoutGrid, t as Zap, w as Sparkles, yt as Eye } from "../_libs/lucide-react.mjs";
import { n as customers } from "./mock-data-EYXD9Fq3.mjs";
import { a as customersApi } from "./api-D5gYHQcL.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as useCustomers } from "./api-hooks-UCeWdNOc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.configuration-BjgAGqRt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var moduleCatalog = [
	{
		key: "billing",
		name: "Billing",
		description: "Invoice generation & POS billing",
		category: "Billing",
		minPlan: "trial"
	},
	{
		key: "qr_billing",
		name: "QR Billing",
		description: "UPI QR on invoices",
		category: "Billing",
		minPlan: "monthly"
	},
	{
		key: "weight_billing",
		name: "Weight / Gram Billing",
		description: "Weighing scale integration",
		category: "Billing",
		minPlan: "monthly"
	},
	{
		key: "gst",
		name: "GST",
		description: "GST-compliant invoicing & returns",
		category: "Compliance",
		minPlan: "trial"
	},
	{
		key: "barcode",
		name: "Barcode",
		description: "Scan & print barcodes",
		category: "Inventory",
		minPlan: "trial"
	},
	{
		key: "inventory",
		name: "Inventory",
		description: "Stock management",
		category: "Inventory",
		minPlan: "trial"
	},
	{
		key: "products",
		name: "Products",
		description: "Product master",
		category: "Inventory",
		minPlan: "trial"
	},
	{
		key: "customers",
		name: "Customers",
		description: "Customer master",
		category: "People",
		minPlan: "trial"
	},
	{
		key: "suppliers",
		name: "Suppliers",
		description: "Supplier master",
		category: "People",
		minPlan: "monthly"
	},
	{
		key: "purchases",
		name: "Purchases",
		description: "Purchase orders & GRN",
		category: "Sales",
		minPlan: "monthly"
	},
	{
		key: "expenses",
		name: "Expenses",
		description: "Track business expenses",
		category: "Sales",
		minPlan: "monthly"
	},
	{
		key: "returns",
		name: "Returns & Exchange",
		description: "Sales returns and exchange",
		category: "Sales",
		minPlan: "monthly"
	},
	{
		key: "credit_sales",
		name: "Credit Sales (Udhar)",
		description: "Track dues and receivables",
		category: "Sales",
		minPlan: "monthly"
	},
	{
		key: "reports",
		name: "Reports",
		description: "Standard business reports",
		category: "Reports",
		minPlan: "trial"
	},
	{
		key: "analytics",
		name: "Analytics",
		description: "Advanced analytics dashboards",
		category: "Reports",
		premium: true,
		minPlan: "yearly"
	},
	{
		key: "restaurant",
		name: "Restaurant Module",
		description: "KOT, tables, menu",
		category: "Industry",
		premium: true,
		minPlan: "yearly"
	},
	{
		key: "pharmacy",
		name: "Pharmacy Module",
		description: "Batch, expiry, rack",
		category: "Industry",
		premium: true,
		minPlan: "yearly"
	},
	{
		key: "garment",
		name: "Garment Module",
		description: "Size, color matrix",
		category: "Industry",
		premium: true,
		minPlan: "yearly"
	},
	{
		key: "loyalty",
		name: "Loyalty",
		description: "Points, rewards & offers",
		category: "Advanced",
		premium: true,
		minPlan: "yearly"
	},
	{
		key: "multi_branch",
		name: "Multi-Branch",
		description: "Multiple outlets & stock transfer",
		category: "Advanced",
		premium: true,
		minPlan: "yearly"
	},
	{
		key: "employees",
		name: "Employee Management",
		description: "Staff roles & permissions",
		category: "People",
		minPlan: "monthly"
	},
	{
		key: "attendance",
		name: "Attendance",
		description: "Staff attendance & shifts",
		category: "People",
		minPlan: "monthly"
	},
	{
		key: "cloud_backup",
		name: "Cloud Backup",
		description: "Automatic encrypted backups",
		category: "Integrations",
		minPlan: "monthly"
	},
	{
		key: "whatsapp_invoice",
		name: "WhatsApp Invoice",
		description: "Send bills via WhatsApp",
		category: "Integrations",
		minPlan: "monthly"
	},
	{
		key: "ai_features",
		name: "AI Features",
		description: "AI insights & smart suggestions",
		category: "Advanced",
		premium: true,
		minPlan: "yearly"
	}
];
var builtInPackages = [
	{
		key: "starter",
		name: "Starter",
		description: "Essentials for small shops",
		moduleKeys: [
			"billing",
			"gst",
			"barcode",
			"inventory",
			"products",
			"customers",
			"reports"
		]
	},
	{
		key: "retail_pro",
		name: "Retail Pro",
		description: "Full retail with WhatsApp & credit sales",
		moduleKeys: [
			"billing",
			"qr_billing",
			"gst",
			"barcode",
			"inventory",
			"products",
			"customers",
			"suppliers",
			"purchases",
			"expenses",
			"returns",
			"credit_sales",
			"reports",
			"employees",
			"attendance",
			"cloud_backup",
			"whatsapp_invoice"
		]
	},
	{
		key: "restaurant",
		name: "Restaurant",
		description: "For cafes and restaurants",
		moduleKeys: [
			"billing",
			"qr_billing",
			"gst",
			"inventory",
			"products",
			"customers",
			"reports",
			"restaurant",
			"loyalty",
			"whatsapp_invoice",
			"cloud_backup"
		]
	},
	{
		key: "pharmacy",
		name: "Pharmacy",
		description: "Batch/expiry tracking",
		moduleKeys: [
			"billing",
			"gst",
			"barcode",
			"inventory",
			"products",
			"customers",
			"suppliers",
			"purchases",
			"reports",
			"pharmacy",
			"cloud_backup"
		]
	},
	{
		key: "enterprise",
		name: "Enterprise",
		description: "Everything unlocked",
		moduleKeys: moduleCatalog.map((m) => m.key)
	}
];
var planRank = {
	trial: 0,
	monthly: 1,
	yearly: 2
};
function defaultModulesFor(plan) {
	const cap = planRank[plan];
	return moduleCatalog.map((m) => ({
		key: m.key,
		enabled: planRank[m.minPlan ?? "trial"] <= cap && !m.premium,
		locked: m.premium && planRank[m.minPlan ?? "yearly"] > cap
	}));
}
function defaultBranding(companyName) {
	return {
		appName: companyName,
		companyName,
		logoUrl: "",
		splashText: `Welcome to ${companyName}`,
		loginTagline: "Smart billing for smart businesses",
		primaryColor: "#6366f1",
		accentColor: "#8b5cf6",
		backgroundColor: "#0f172a",
		fontFamily: "Inter",
		iconStyle: "rounded",
		buttonStyle: "gradient",
		cardStyle: "elevated",
		animations: "subtle"
	};
}
var defaultLayout = () => ({
	dashboardWidgets: [
		{
			id: "w1",
			key: "today_sales",
			label: "Today's Sales",
			icon: "💰"
		},
		{
			id: "w2",
			key: "top_products",
			label: "Top Products",
			icon: "🏆"
		},
		{
			id: "w3",
			key: "low_stock",
			label: "Low Stock",
			icon: "⚠️"
		},
		{
			id: "w4",
			key: "receivables",
			label: "Receivables",
			icon: "📥"
		},
		{
			id: "w5",
			key: "expenses",
			label: "Expenses",
			icon: "🧾"
		},
		{
			id: "w6",
			key: "profit",
			label: "Profit",
			icon: "📈"
		}
	],
	bottomNav: [
		{
			id: "b1",
			key: "home",
			label: "Home",
			icon: "🏠"
		},
		{
			id: "b2",
			key: "billing",
			label: "Billing",
			icon: "🧾"
		},
		{
			id: "b3",
			key: "products",
			label: "Products",
			icon: "📦"
		},
		{
			id: "b4",
			key: "reports",
			label: "Reports",
			icon: "📊"
		},
		{
			id: "b5",
			key: "more",
			label: "More",
			icon: "⋯"
		}
	],
	drawerMenu: [
		{
			id: "d1",
			key: "dashboard",
			label: "Dashboard",
			icon: "📊"
		},
		{
			id: "d2",
			key: "customers",
			label: "Customers",
			icon: "👥"
		},
		{
			id: "d3",
			key: "suppliers",
			label: "Suppliers",
			icon: "🚚"
		},
		{
			id: "d4",
			key: "expenses",
			label: "Expenses",
			icon: "🧾"
		},
		{
			id: "d5",
			key: "settings",
			label: "Settings",
			icon: "⚙️"
		}
	],
	billingButtons: [
		{
			id: "bb1",
			key: "add_item",
			label: "Add Item",
			icon: "➕"
		},
		{
			id: "bb2",
			key: "scan",
			label: "Scan",
			icon: "📷"
		},
		{
			id: "bb3",
			key: "discount",
			label: "Discount",
			icon: "🏷️"
		},
		{
			id: "bb4",
			key: "tax",
			label: "Tax",
			icon: "%"
		},
		{
			id: "bb5",
			key: "hold",
			label: "Hold",
			icon: "⏸️"
		},
		{
			id: "bb6",
			key: "print",
			label: "Print",
			icon: "🖨️"
		}
	],
	quickActions: [
		{
			id: "q1",
			key: "new_bill",
			label: "New Bill",
			icon: "🧾"
		},
		{
			id: "q2",
			key: "add_product",
			label: "Add Product",
			icon: "📦"
		},
		{
			id: "q3",
			key: "collect_payment",
			label: "Collect Payment",
			icon: "💳"
		},
		{
			id: "q4",
			key: "day_close",
			label: "Day Close",
			icon: "🌙"
		}
	]
});
function defaultConfig(customerId, plan, companyName) {
	return {
		customerId,
		version: 1,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		modules: defaultModulesFor(plan),
		branding: defaultBranding(companyName),
		layout: defaultLayout()
	};
}
var KEY = "nexus.customerConfigs.v1";
var PKG_KEY = "nexus.customPackages.v1";
function read() {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(window.localStorage.getItem(KEY) || "{}");
	} catch {
		return {};
	}
}
function write(s) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(s));
}
function loadConfig(customerId, plan, companyName) {
	const existing = read()[customerId];
	const deletedKeys = new Set(loadDeletedModuleKeys());
	if (!existing) {
		const base = defaultConfig(customerId, plan, companyName);
		return {
			...base,
			modules: base.modules.filter((m) => !deletedKeys.has(m.key))
		};
	}
	const known = new Set(existing.modules.map((m) => m.key));
	const missing = moduleCatalog.filter((m) => !known.has(m.key) && !deletedKeys.has(m.key)).map((m) => ({
		key: m.key,
		enabled: false,
		locked: m.premium
	}));
	return {
		...defaultConfig(customerId, plan, companyName),
		...existing,
		modules: [...existing.modules.filter((m) => !deletedKeys.has(m.key)), ...missing],
		branding: {
			...defaultBranding(companyName),
			...existing.branding
		},
		layout: {
			...defaultLayout(),
			...existing.layout
		}
	};
}
function saveConfig(cfg) {
	const deletedKeys = new Set(loadDeletedModuleKeys());
	const cleanCfg = {
		...cfg,
		modules: cfg.modules.filter((m) => !deletedKeys.has(m.key)),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const s = read();
	s[cfg.customerId] = cleanCfg;
	write(s);
}
function readPkgs() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(window.localStorage.getItem(PKG_KEY) || "[]");
	} catch {
		return [];
	}
}
function writePkgs(p) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(PKG_KEY, JSON.stringify(p));
}
function listPackages() {
	return [...builtInPackages, ...readPkgs()];
}
function addCustomPackage(pkg) {
	const p = readPkgs();
	p.push({
		...pkg,
		custom: true
	});
	writePkgs(p);
}
function removeCustomPackage(key) {
	writePkgs(readPkgs().filter((p) => p.key !== key));
}
var CUSTOM_MOD_KEY = "nexus.customModules.v1";
function loadCustomModules() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(window.localStorage.getItem(CUSTOM_MOD_KEY) || "[]");
	} catch {
		return [];
	}
}
function addCustomModule(mod) {
	const list = loadCustomModules();
	if (list.find((m) => m.key === mod.key) || moduleCatalog.find((m) => m.key === mod.key)) return;
	list.push({
		...mod,
		custom: true,
		category: "Custom"
	});
	window.localStorage.setItem(CUSTOM_MOD_KEY, JSON.stringify(list));
	moduleCatalog.push({
		...mod,
		custom: true,
		category: "Custom"
	});
}
var DELETED_MOD_KEY = "nexus.deletedModules.v1";
function loadDeletedModuleKeys() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(window.localStorage.getItem(DELETED_MOD_KEY) || "[]");
	} catch {
		return [];
	}
}
function deleteModuleFromCatalog(key) {
	const idx = moduleCatalog.findIndex((m) => m.key === key);
	if (idx !== -1) moduleCatalog.splice(idx, 1);
	const customList = loadCustomModules().filter((m) => m.key !== key);
	if (typeof window !== "undefined") {
		window.localStorage.setItem(CUSTOM_MOD_KEY, JSON.stringify(customList));
		const delKeys = loadDeletedModuleKeys();
		if (!delKeys.includes(key)) {
			delKeys.push(key);
			window.localStorage.setItem(DELETED_MOD_KEY, JSON.stringify(delKeys));
		}
		const store = read();
		let updated = false;
		for (const cId in store) if (store[cId] && Array.isArray(store[cId].modules)) {
			store[cId].modules = store[cId].modules.filter((m) => m.key !== key);
			updated = true;
		}
		if (updated) write(store);
	}
}
if (typeof window !== "undefined") {
	const deleted = loadDeletedModuleKeys();
	for (const m of loadCustomModules()) if (!deleted.includes(m.key) && !moduleCatalog.find((x) => x.key === m.key)) moduleCatalog.push(m);
	for (let i = moduleCatalog.length - 1; i >= 0; i--) if (deleted.includes(moduleCatalog[i].key)) moduleCatalog.splice(i, 1);
}
function ConfigurationPage() {
	const { data: customers$1 = [], refetch } = useCustomers();
	const effectiveCustomers = (0, import_react.useMemo)(() => {
		return customers$1 && customers$1.length > 0 ? customers$1 : customers;
	}, [customers$1]);
	const [selectedCustomerId, setSelectedCustomerId] = (0, import_react.useState)("");
	const activeCustomerId = (0, import_react.useMemo)(() => {
		if (selectedCustomerId && effectiveCustomers.some((c) => c.id === selectedCustomerId)) return selectedCustomerId;
		return effectiveCustomers[0]?.id ?? "";
	}, [selectedCustomerId, effectiveCustomers]);
	(0, import_react.useEffect)(() => {
		if (!selectedCustomerId && effectiveCustomers.length > 0) setSelectedCustomerId(effectiveCustomers[0].id);
	}, [effectiveCustomers, selectedCustomerId]);
	const customer = (0, import_react.useMemo)(() => effectiveCustomers.find((c) => c.id === activeCustomerId) ?? effectiveCustomers[0] ?? {
		id: "1",
		businessName: "Apex Bakery & Retail",
		ownerName: "Rajesh Kumar",
		email: "apex@bakery.com",
		mobile: "+91 98765 43210",
		address: "MG Road, Bangalore",
		subscriptionType: "yearly",
		status: "active"
	}, [effectiveCustomers, activeCustomerId]);
	const [cfg, setCfg] = (0, import_react.useState)(() => loadConfig(customer?.id ?? "1", customer?.subscriptionType ?? "yearly", customer?.businessName ?? "Apex Bakery & Retail"));
	const [pkgVersion, setPkgVersion] = (0, import_react.useState)(0);
	const packages = (0, import_react.useMemo)(() => listPackages(), [pkgVersion]);
	(0, import_react.useEffect)(() => {
		const resolvedId = activeCustomerId || effectiveCustomers[0]?.id || "1";
		if (!resolvedId) return;
		const resolvedCustomer = effectiveCustomers.find((c) => c.id === resolvedId) || customer;
		setCfg(loadConfig(resolvedId, resolvedCustomer.subscriptionType, resolvedCustomer.businessName));
		customersApi.getConfig(resolvedId).then((backendCfg) => {
			if (backendCfg && Object.keys(backendCfg).length > 0) {
				saveConfig(backendCfg);
				setCfg(loadConfig(resolvedId, resolvedCustomer.subscriptionType, resolvedCustomer.businessName));
			}
		}).catch((err) => {
			console.warn("Failed to load customer config from backend, using local cache:", err);
		});
	}, [
		activeCustomerId,
		customer,
		effectiveCustomers
	]);
	const onCustomerChange = (id) => {
		const c = effectiveCustomers.find((x) => x.id === id) ?? effectiveCustomers[0];
		setSelectedCustomerId(id);
		setCfg(loadConfig(c.id, c.subscriptionType, c.businessName));
	};
	const persist = (next, silent = false) => {
		setCfg(next);
		saveConfig(next);
		if (customer?.id) customersApi.saveConfig(customer.id, next).catch((err) => {
			console.error("Failed to save config to backend:", err);
		});
		if (!silent) toast.success("Configuration saved", { description: `${customer?.businessName ?? ""} · v${next.version + 0}` });
	};
	const saveAll = () => persist({
		...cfg,
		version: cfg.version + 1
	});
	const resetAll = () => {
		persist({
			...loadConfig(customer.id, customer.subscriptionType, customer.businessName),
			branding: defaultBranding(customer.businessName),
			layout: defaultLayout()
		});
		toast.info("Reset to defaults");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight md:text-3xl",
					children: "Customer Configuration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Enable modules, apply packages, customize branding and build the mobile app UI — per customer."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[240px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Customer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: activeCustomerId,
								onValueChange: onCustomerChange,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[260px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Customer..." })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
									className: "max-h-[320px]",
									children: effectiveCustomers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: c.id,
										children: [
											c.businessName,
											" · ",
											c.subscriptionType
										]
									}, c.id))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: resetAll,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 h-4 w-4" }), "Reset"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: saveAll,
							className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-4 w-4" }), "Save all"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-gradient-to-br from-card to-card/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-wrap items-center justify-between gap-4 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: customer.businessName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								customer.ownerName,
								" · ",
								customer.mobile,
								" · Plan:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase",
									children: customer.subscriptionType
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								children: [cfg.modules.filter((m) => m.enabled).length, " modules on"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: [cfg.modules.filter((m) => m.locked).length, " locked"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "bg-gradient-primary text-primary-foreground",
								children: ["v", cfg.version]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "modules",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "modules",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocks, { className: "mr-1 h-4 w-4" }), "Modules"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "packages",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mr-1 h-4 w-4" }), "Packages"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "branding",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "mr-1 h-4 w-4" }), "Branding & UI"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "layout",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "mr-1 h-4 w-4" }), "Layout Builder"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "account",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "mr-1 h-4 w-4" }), "Account & Security"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "preview",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-1 h-4 w-4" }), "JSON Preview"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "modules",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulesTab, {
							cfg,
							onChange: persist
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "packages",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagesTab, {
							cfg,
							packages,
							onApply: (keys, pkgName) => {
								persist({
									...cfg,
									packageName: pkgName,
									modules: cfg.modules.map((m) => ({
										...m,
										enabled: keys.includes(m.key)
									}))
								});
								toast.success(`Applied package: ${pkgName}`);
							},
							onPkgChange: () => setPkgVersion((v) => v + 1)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "branding",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandingTab, {
							cfg,
							onChange: persist
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "layout",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutTab, {
							cfg,
							onChange: persist
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "account",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountTab, {
							customer,
							onUpdateSuccess: () => refetch()
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "preview",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewTab, { cfg })
					})
				]
			})
		]
	});
}
function ModulesTab({ cfg, onChange }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [catalogVersion, setCatalogVersion] = (0, import_react.useState)(0);
	const categories = (0, import_react.useMemo)(() => {
		const set = new Set(moduleCatalog.map((m) => m.category));
		return ["all", ...Array.from(set)];
	}, [catalogVersion]);
	const filtered = (0, import_react.useMemo)(() => {
		return moduleCatalog.filter((m) => {
			if (category !== "all" && m.category !== category) return false;
			if (!query) return true;
			const q = query.toLowerCase();
			return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
		});
	}, [
		query,
		category,
		catalogVersion
	]);
	const setModule = (key, patch) => {
		const updatedModules = cfg.modules.find((m) => m.key === key) ? cfg.modules.map((m) => m.key === key ? {
			...m,
			...patch
		} : m) : [...cfg.modules, {
			key,
			enabled: patch.enabled ?? false,
			locked: patch.locked ?? false,
			...patch
		}];
		onChange({
			...cfg,
			modules: updatedModules
		});
	};
	const deleteModule = (key, name) => {
		deleteModuleFromCatalog(key);
		setCatalogVersion((v) => v + 1);
		onChange({
			...cfg,
			modules: cfg.modules.filter((m) => m.key !== key)
		});
		toast.success(`Deleted module permanently: ${name}`);
	};
	const enableAll = (on) => {
		const viewKeys = new Set(filtered.map((f) => f.key));
		const nextModules = [...cfg.modules];
		viewKeys.forEach((key) => {
			const idx = nextModules.findIndex((m) => m.key === key);
			if (idx >= 0) nextModules[idx] = {
				...nextModules[idx],
				enabled: on
			};
			else nextModules.push({
				key,
				enabled: on,
				locked: false
			});
		});
		onChange({
			...cfg,
			modules: nextModules
		});
		toast.success(on ? "Enabled all in view" : "Disabled all in view");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[220px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search modules...",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: setCategory,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c === "all" ? "All categories" : c
						}, c)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => enableAll(true),
						children: "Enable all"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => enableAll(false),
						children: "Disable all"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: showAdd,
						onOpenChange: setShowAdd,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "bg-gradient-primary text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Add module"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddModuleDialog, { onAdded: (mod) => {
							addCustomModule(mod);
							setCatalogVersion((v) => v + 1);
							onChange({
								...cfg,
								modules: [...cfg.modules, {
									key: mod.key,
									enabled: true
								}]
							});
							setShowAdd(false);
							toast.success(`Added ${mod.name}`);
						} })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: filtered.map((m) => {
					const state = cfg.modules.find((x) => x.key === m.key) ?? {
						key: m.key,
						enabled: false
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex items-start justify-between gap-3 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: m.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px]",
												children: m.category
											}),
											m.premium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-warning/20 text-warning border-warning/40 text-[10px]",
												children: "Premium"
											}),
											m.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-primary/20 text-primary border-primary/40 text-[10px]",
												children: "Custom"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: m.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setModule(m.key, { locked: !state.locked }),
												className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[11px] hover:bg-muted",
												children: [state.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-warning" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-3 w-3 text-muted-foreground" }), state.locked ? "Locked" : "Unlocked"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => deleteModule(m.key, m.name),
												className: "inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-2 py-0.5 text-[11px] hover:bg-destructive/20 transition-colors",
												title: "Delete module from customer configuration",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), "Delete"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground",
												children: state.enabled ? "Available in app" : "Hidden in app"
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: state.enabled,
								disabled: state.locked,
								onCheckedChange: (v) => setModule(m.key, { enabled: v })
							})]
						})
					}, m.key);
				})
			}),
			filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
				children: "No modules match your filter."
			})
		]
	});
}
function AddModuleDialog({ onAdded }) {
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add custom module" }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Module name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: "e.g. Salon Appointments"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: description,
				onChange: (e) => setDescription(e.target.value),
				placeholder: "What does this module do?"
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: !name.trim(),
			onClick: () => {
				onAdded({
					key: "custom_" + name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Date.now().toString(36),
					name: name.trim(),
					description: description.trim(),
					category: "Custom",
					custom: true
				});
				setName("");
				setDescription("");
			},
			className: "bg-gradient-primary text-primary-foreground",
			children: "Add"
		}) })
	] });
}
function PackagesTab({ cfg, packages, onApply, onPkgChange }) {
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Feature packages"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Apply a preset or build a custom package."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: showNew,
				onOpenChange: setShowNew,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-gradient-primary text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "New package"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewPackageDialog, {
					defaultKeys: cfg.modules.filter((m) => m.enabled).map((m) => m.key),
					onCreate: (p) => {
						addCustomPackage(p);
						onPkgChange();
						setShowNew(false);
						toast.success(`Package "${p.name}" created`);
					}
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
			children: packages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "mt-1 text-xs",
							children: p.description
						})] }), p.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "bg-primary/20 text-primary border-primary/40 text-[10px]",
							children: "Custom"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap gap-1",
					children: [p.moduleKeys.slice(0, 8).map((k) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "text-[10px]",
							children: moduleCatalog.find((x) => x.key === k)?.name ?? k
						}, k);
					}), p.moduleKeys.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: [
							"+",
							p.moduleKeys.length - 8,
							" more"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "flex-1 bg-gradient-primary text-primary-foreground",
						onClick: () => onApply(p.moduleKeys, p.name),
						children: "Apply"
					}), p.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							removeCustomPackage(p.key);
							onPkgChange();
							toast.info("Package removed");
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
					})]
				})] })]
			}, p.key))
		})]
	});
}
function NewPackageDialog({ defaultKeys, onCreate }) {
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [keys, setKeys] = (0, import_react.useState)(defaultKeys);
	const toggle = (k) => setKeys((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create custom package" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "e.g. Salon Basic"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "What's included"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
					"Modules (",
					keys.length,
					")"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 max-h-[300px] overflow-y-auto rounded-lg border border-border p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1 md:grid-cols-2",
						children: moduleCatalog.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: keys.includes(m.key),
									onChange: () => toggle(m.key)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate",
									children: m.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: m.category
								})
							]
						}, m.key))
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: !name.trim() || keys.length === 0,
				onClick: () => onCreate({
					key: "pkg_" + name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Date.now().toString(36),
					name: name.trim(),
					description: description.trim() || "Custom package",
					moduleKeys: keys
				}),
				className: "bg-gradient-primary text-primary-foreground",
				children: "Create"
			}) })
		]
	});
}
function BrandingTab({ cfg, onChange }) {
	const set = (k, v) => onChange({
		...cfg,
		branding: {
			...cfg.branding,
			[k]: v
		}
	});
	const b = cfg.branding;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr,340px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Branding & UI" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "App name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: b.appName,
									onChange: (e) => set("appName", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Company name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: b.companyName,
									onChange: (e) => set("companyName", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Logo URL",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: b.logoUrl,
									onChange: (e) => set("logoUrl", e.target.value),
									placeholder: "https://..."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Font family",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: b.fontFamily,
									onValueChange: (v) => set("fontFamily", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"Inter",
										"Roboto",
										"Poppins",
										"Nunito",
										"Manrope",
										"SF Pro",
										"Lato"
									].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: f,
										children: f
									}, f)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Splash screen text",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: b.splashText,
									onChange: (e) => set("splashText", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Login screen tagline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: b.loginTagline,
									onChange: (e) => set("loginTagline", e.target.value)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Primary color",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorInput, {
									value: b.primaryColor,
									onChange: (v) => set("primaryColor", v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Accent color",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorInput, {
									value: b.accentColor,
									onChange: (v) => set("accentColor", v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Background color",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorInput, {
									value: b.backgroundColor,
									onChange: (v) => set("backgroundColor", v)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Icon style",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectMini, {
									value: b.iconStyle,
									options: [
										"rounded",
										"sharp",
										"outlined"
									],
									onChange: (v) => set("iconStyle", v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Button style",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectMini, {
									value: b.buttonStyle,
									options: [
										"solid",
										"outline",
										"ghost",
										"gradient"
									],
									onChange: (v) => set("buttonStyle", v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Card style",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectMini, {
									value: b.cardStyle,
									options: [
										"flat",
										"elevated",
										"glass",
										"bordered"
									],
									onChange: (v) => set("cardStyle", v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Animations",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectMini, {
									value: b.animations,
									options: [
										"none",
										"subtle",
										"playful"
									],
									onChange: (v) => set("animations", v)
								})
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Live preview" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-[560px] w-[280px] flex-col overflow-hidden rounded-[36px] border-8 border-foreground/80 shadow-elegant",
				style: {
					background: b.backgroundColor,
					fontFamily: b.fontFamily
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-2 text-[10px] text-white/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "9:41" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "●●●●" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-center justify-center gap-3 px-4",
						children: [
							b.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: b.logoUrl,
								alt: "",
								className: "h-16 w-16 rounded-xl object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-16 w-16 place-items-center rounded-2xl",
								style: { background: `linear-gradient(135deg, ${b.primaryColor}, ${b.accentColor})` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7 text-white" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-bold",
									children: b.appName || "App"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] opacity-70",
									children: b.splashText
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white shadow-md",
								style: {
									background: b.buttonStyle === "gradient" ? `linear-gradient(135deg, ${b.primaryColor}, ${b.accentColor})` : b.buttonStyle === "outline" || b.buttonStyle === "ghost" ? "transparent" : b.primaryColor,
									border: b.buttonStyle === "outline" ? `1.5px solid ${b.primaryColor}` : "none",
									color: b.buttonStyle === "outline" || b.buttonStyle === "ghost" ? b.primaryColor : "#fff"
								},
								children: "Continue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center text-[10px] text-white/60",
								children: b.loginTagline
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-white/10 p-2 text-center text-[10px] text-white/50",
						children: b.companyName
					})
				]
			}) })]
		})]
	});
}
function F({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs text-muted-foreground",
			children: label
		}), children]
	});
}
function ColorInput({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-9 w-12 cursor-pointer rounded-md border border-border bg-transparent"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "flex-1"
		})]
	});
}
function SelectMini({ value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value,
		onValueChange: onChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: o,
			children: o
		}, o)) })]
	});
}
var LAYOUT_SECTIONS = [
	{
		key: "dashboardWidgets",
		title: "Dashboard widgets",
		description: "Cards on the mobile home dashboard"
	},
	{
		key: "quickActions",
		title: "Quick actions",
		description: "Fast shortcuts on the home screen"
	},
	{
		key: "bottomNav",
		title: "Bottom navigation",
		description: "Tabs at the bottom of the app"
	},
	{
		key: "drawerMenu",
		title: "Drawer menu",
		description: "Side drawer items"
	},
	{
		key: "billingButtons",
		title: "Billing screen buttons",
		description: "Actions on the billing screen"
	}
];
function LayoutTab({ cfg, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground",
			children: [
				"Drag ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "mx-1 inline h-3 w-3" }),
				" to reorder. Add or remove items per section — changes save on drop."
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: LAYOUT_SECTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutSection, {
				title: s.title,
				description: s.description,
				items: cfg.layout[s.key],
				onChange: (items) => onChange({
					...cfg,
					layout: {
						...cfg.layout,
						[s.key]: items
					}
				})
			}, s.key))
		})]
	});
}
function LayoutSection({ title, description, items, onChange }) {
	const [dragIdx, setDragIdx] = (0, import_react.useState)(null);
	const [newLabel, setNewLabel] = (0, import_react.useState)("");
	const [newIcon, setNewIcon] = (0, import_react.useState)("");
	const move = (from, to) => {
		if (from === to) return;
		const next = items.slice();
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		onChange(next);
	};
	const add = () => {
		if (!newLabel.trim()) return;
		const item = {
			id: "b_" + Date.now().toString(36),
			key: newLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"),
			label: newLabel.trim(),
			icon: newIcon.trim() || "•"
		};
		onChange([...items, item]);
		setNewLabel("");
		setNewIcon("");
	};
	const remove = (id) => onChange(items.filter((i) => i.id !== id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
				className: "text-xs",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-1.5",
			children: [items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				draggable: true,
				onDragStart: () => setDragIdx(idx),
				onDragOver: (e) => e.preventDefault(),
				onDrop: () => {
					if (dragIdx !== null) move(dragIdx, idx);
					setDragIdx(null);
				},
				className: "flex items-center gap-2 rounded-lg border border-border bg-background/60 px-2 py-2 " + (dragIdx === idx ? "opacity-60" : "hover:border-primary/40"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4 shrink-0 cursor-grab text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-6 text-center text-lg",
						children: it.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate text-sm",
						children: it.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: it.key
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-7 w-7",
						onClick: () => remove(it.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})
				]
			}, it.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground",
				children: "No items — add one below."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Icon (emoji)",
					value: newIcon,
					onChange: (e) => setNewIcon(e.target.value),
					className: "w-20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Item label",
					value: newLabel,
					onChange: (e) => setNewLabel(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && add()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: add,
					className: "bg-gradient-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
				})
			]
		})] })]
	});
}
function PreviewTab({ cfg }) {
	const json = JSON.stringify(cfg, null, 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Sync payload" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
				className: "text-xs",
				children: "This JSON is delivered to the customer's Flutter app on login and cached for offline use."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => {
					navigator.clipboard?.writeText(json);
					toast.success("Copied JSON");
				},
				children: "Copy JSON"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "max-h-[500px] overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px] leading-relaxed",
			children: json
		}) })]
	});
}
function AccountTab({ customer, onUpdateSuccess }) {
	const [businessName, setBusinessName] = (0, import_react.useState)(customer.businessName || "");
	const [ownerName, setOwnerName] = (0, import_react.useState)(customer.ownerName || "");
	const [email, setEmail] = (0, import_react.useState)(customer.email || "");
	const [mobile, setMobile] = (0, import_react.useState)(customer.mobile || "");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setBusinessName(customer.businessName || "");
		setOwnerName(customer.ownerName || "");
		setEmail(customer.email || "");
		setMobile(customer.mobile || "");
		setPassword("");
	}, [customer]);
	const handleSave = async () => {
		if (!businessName.trim() || !email.trim()) {
			toast.error("Store Name and Email Address are required");
			return;
		}
		setIsSaving(true);
		try {
			const payload = {
				businessName: businessName.trim(),
				ownerName: ownerName.trim(),
				email: email.trim().toLowerCase(),
				mobile: mobile.trim()
			};
			if (password.trim()) payload.password = password.trim();
			await customersApi.update(customer.id, payload);
			toast.success("Customer profile & password updated successfully!");
			setPassword("");
			onUpdateSuccess();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update account details");
		} finally {
			setIsSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border bg-card max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-lg font-bold",
			children: "Store & User Account Management"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
			className: "text-xs text-muted-foreground",
			children: [
				"Update store name, email, mobile number, owner name, and user password for",
				" ",
				customer.businessName,
				"."
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Store Name (Business Name)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: businessName,
								onChange: (e) => setBusinessName(e.target.value),
								placeholder: "e.g. Apex Bakery Store"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Owner Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: ownerName,
								onChange: (e) => setOwnerName(e.target.value),
								placeholder: "e.g. John Doe"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "e.g. store@example.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Mobile Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: mobile,
								onChange: (e) => setMobile(e.target.value),
								placeholder: "e.g. +1 555-0199"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Set New User Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showPassword ? "text" : "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Leave blank to keep existing password",
								className: "pr-10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 text-muted-foreground hover:text-foreground",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Updating the password will take effect immediately when the user logs in on the POS app."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleSave,
						disabled: isSaving,
						className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), isSaving ? "Saving Changes..." : "Save Account Details"]
					})
				})
			]
		})]
	});
}
//#endregion
export { ConfigurationPage as component };
