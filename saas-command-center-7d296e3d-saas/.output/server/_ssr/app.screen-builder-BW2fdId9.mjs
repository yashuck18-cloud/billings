import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { D as Signal, H as Plus, I as Save, J as MoveVertical, L as RotateCcw, Ot as Copy, P as Search, R as RefreshCw, Rt as ChevronLeft, T as Smartphone, Y as MoveHorizontal, Yt as BatteryFull, Z as Monitor, b as TextAlignCenter, bt as EyeOff, f as Ungroup, g as Trash2, kt as CodeXml, mt as Group, p as Undo2, r as Wifi, rt as Lock, st as LayoutGrid, v as TextAlignStart, w as Sparkles, x as Tablet, y as TextAlignEnd, yt as Eye, z as Redo2 } from "../_libs/lucide-react.mjs";
import { a as customersApi } from "./api-D5gYHQcL.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as useCustomers } from "./api-hooks-UCeWdNOc.mjs";
import { i as Track, n as Root, r as Thumb, t as Range } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.screen-builder-BW2fdId9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Range, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Root.displayName;
var screenCatalog = [
	{
		key: "dashboard",
		name: "Dashboard",
		description: "Home overview",
		columns: 12
	},
	{
		key: "billing",
		name: "Billing",
		description: "POS billing screen",
		columns: 12
	},
	{
		key: "products",
		name: "Products",
		description: "Product master",
		columns: 12
	},
	{
		key: "inventory",
		name: "Inventory",
		description: "Stock view",
		columns: 12
	},
	{
		key: "customers",
		name: "Customers",
		description: "Customer master",
		columns: 12
	},
	{
		key: "suppliers",
		name: "Suppliers",
		description: "Supplier master",
		columns: 12
	},
	{
		key: "purchases",
		name: "Purchases",
		description: "Purchase orders",
		columns: 12
	},
	{
		key: "reports",
		name: "Reports",
		description: "Reports dashboard",
		columns: 12
	},
	{
		key: "expenses",
		name: "Expenses",
		description: "Expense tracking",
		columns: 12
	},
	{
		key: "settings",
		name: "Settings",
		description: "App settings",
		columns: 12
	},
	{
		key: "profile",
		name: "Profile",
		description: "User profile",
		columns: 12
	},
	{
		key: "employees",
		name: "Employee Management",
		description: "Staff and roles",
		columns: 12
	},
	{
		key: "analytics",
		name: "Analytics",
		description: "Advanced analytics",
		columns: 12
	}
];
var widgetCatalog = [
	{
		type: "sales_card",
		name: "Sales Card",
		category: "kpi",
		icon: "💰",
		defaultW: 3,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "profit_card",
		name: "Profit Card",
		category: "kpi",
		icon: "📈",
		defaultW: 3,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "inventory_card",
		name: "Inventory Card",
		category: "kpi",
		icon: "📦",
		defaultW: 3,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "low_stock_card",
		name: "Low Stock Card",
		category: "kpi",
		icon: "⚠️",
		defaultW: 3,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "recent_bills",
		name: "Recent Bills",
		category: "list",
		icon: "🧾",
		defaultW: 6,
		defaultH: 4,
		screens: ["dashboard"]
	},
	{
		type: "sales_chart",
		name: "Sales Chart",
		category: "chart",
		icon: "📊",
		defaultW: 6,
		defaultH: 4,
		screens: [
			"dashboard",
			"analytics",
			"reports"
		]
	},
	{
		type: "quick_actions",
		name: "Quick Actions",
		category: "action",
		icon: "⚡",
		defaultW: 6,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "pending_payments",
		name: "Pending Payments",
		category: "list",
		icon: "⏳",
		defaultW: 4,
		defaultH: 3,
		screens: ["dashboard"]
	},
	{
		type: "customer_count",
		name: "Customer Count",
		category: "kpi",
		icon: "👥",
		defaultW: 3,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "employee_count",
		name: "Employee Count",
		category: "kpi",
		icon: "🧑‍💼",
		defaultW: 3,
		defaultH: 2,
		screens: ["dashboard"]
	},
	{
		type: "product_search",
		name: "Product Search",
		category: "input",
		icon: "🔍",
		defaultW: 8,
		defaultH: 1,
		screens: ["billing"]
	},
	{
		type: "barcode_scanner",
		name: "Barcode Scanner",
		category: "action",
		icon: "📷",
		defaultW: 4,
		defaultH: 1,
		screens: ["billing"]
	},
	{
		type: "product_list",
		name: "Product List",
		category: "list",
		icon: "📋",
		defaultW: 8,
		defaultH: 6,
		screens: ["billing"]
	},
	{
		type: "quantity_controls",
		name: "Quantity Controls",
		category: "input",
		icon: "➕",
		defaultW: 4,
		defaultH: 2,
		screens: ["billing"]
	},
	{
		type: "weight_input",
		name: "Weight/Gram Input",
		category: "input",
		icon: "⚖️",
		defaultW: 4,
		defaultH: 2,
		screens: ["billing"]
	},
	{
		type: "discount_button",
		name: "Discount Button",
		category: "action",
		icon: "🏷️",
		defaultW: 2,
		defaultH: 1,
		screens: ["billing"]
	},
	{
		type: "hold_bill",
		name: "Hold Bill",
		category: "action",
		icon: "⏸️",
		defaultW: 2,
		defaultH: 1,
		screens: ["billing"]
	},
	{
		type: "customer_selection",
		name: "Customer Selection",
		category: "input",
		icon: "🧑",
		defaultW: 4,
		defaultH: 1,
		screens: ["billing"]
	},
	{
		type: "payment_section",
		name: "Payment Section",
		category: "section",
		icon: "💳",
		defaultW: 4,
		defaultH: 4,
		screens: ["billing"]
	},
	{
		type: "payment_buttons",
		name: "Payment Buttons",
		category: "action",
		icon: "💵",
		defaultW: 4,
		defaultH: 2,
		screens: ["billing"]
	},
	{
		type: "print_button",
		name: "Print Button",
		category: "action",
		icon: "🖨️",
		defaultW: 2,
		defaultH: 1,
		screens: ["billing"]
	},
	{
		type: "total_summary",
		name: "Total Summary",
		category: "section",
		icon: "🧮",
		defaultW: 4,
		defaultH: 3,
		screens: ["billing"]
	},
	{
		type: "tax_summary",
		name: "Tax Summary",
		category: "section",
		icon: "%",
		defaultW: 4,
		defaultH: 2,
		screens: ["billing"]
	},
	{
		type: "data_table",
		name: "Data Table",
		category: "list",
		icon: "🗂️",
		defaultW: 12,
		defaultH: 6,
		screens: [
			"products",
			"inventory",
			"customers",
			"suppliers",
			"purchases",
			"expenses",
			"employees"
		]
	},
	{
		type: "filter_bar",
		name: "Filter Bar",
		category: "input",
		icon: "🎛️",
		defaultW: 12,
		defaultH: 1,
		screens: [
			"products",
			"inventory",
			"customers",
			"suppliers",
			"purchases",
			"expenses",
			"employees",
			"reports"
		]
	},
	{
		type: "add_button",
		name: "Add Button",
		category: "action",
		icon: "➕",
		defaultW: 2,
		defaultH: 1,
		screens: [
			"products",
			"inventory",
			"customers",
			"suppliers",
			"purchases",
			"expenses",
			"employees"
		]
	},
	{
		type: "kpi_row",
		name: "KPI Row",
		category: "kpi",
		icon: "📊",
		defaultW: 12,
		defaultH: 2,
		screens: [
			"products",
			"inventory",
			"reports",
			"analytics",
			"expenses"
		]
	},
	{
		type: "profile_card",
		name: "Profile Card",
		category: "section",
		icon: "👤",
		defaultW: 6,
		defaultH: 4,
		screens: ["profile"]
	},
	{
		type: "settings_group",
		name: "Settings Group",
		category: "section",
		icon: "⚙️",
		defaultW: 12,
		defaultH: 3,
		screens: ["settings"]
	},
	{
		type: "text_block",
		name: "Text / Notice",
		category: "text",
		icon: "📝",
		defaultW: 6,
		defaultH: 2,
		screens: []
	}
];
function widgetsForScreen(screen) {
	return widgetCatalog.filter((w) => w.screens.length === 0 || w.screens.includes(screen));
}
var layoutPresets = [
	{
		key: "grid",
		name: "Grid",
		description: "12-col responsive grid"
	},
	{
		key: "list",
		name: "List",
		description: "Single column stacked"
	},
	{
		key: "two_col",
		name: "Two Column",
		description: "Two equal columns"
	},
	{
		key: "three_col",
		name: "Three Column",
		description: "Three equal columns"
	},
	{
		key: "responsive",
		name: "Responsive",
		description: "Adapts to width"
	},
	{
		key: "compact",
		name: "Compact",
		description: "Tight spacing"
	},
	{
		key: "modern",
		name: "Modern",
		description: "Rounded, elevated"
	},
	{
		key: "classic",
		name: "Classic",
		description: "Flat, dense"
	}
];
var defaultStyle = () => ({
	paddingPx: 12,
	marginPx: 0,
	radiusPx: 12,
	bg: "rgba(255,255,255,0.04)",
	fg: "#ffffff",
	fontSize: 14,
	fontWeight: 500,
	elevation: 2,
	shadow: true,
	opacity: 1
});
function makeWidget(def, x = 0, y = 0) {
	return {
		id: "w_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6),
		type: def.type,
		label: def.name,
		icon: def.icon,
		x,
		y,
		w: def.defaultW,
		h: def.defaultH,
		visible: true,
		locked: false,
		style: defaultStyle()
	};
}
function place(defs, columns) {
	const out = [];
	let x = 0, y = 0, rowMax = 0;
	for (const d of defs) {
		if (x + d.defaultW > columns) {
			x = 0;
			y += rowMax;
			rowMax = 0;
		}
		out.push({ ...makeWidget(d, x, y) });
		x += d.defaultW;
		rowMax = Math.max(rowMax, d.defaultH);
	}
	return out;
}
function defaultLayoutFor(screen) {
	const def = screenCatalog.find((s) => s.key === screen);
	const pool = widgetsForScreen(screen);
	const defs = (() => {
		switch (screen) {
			case "dashboard": return [
				"sales_card",
				"profit_card",
				"inventory_card",
				"low_stock_card",
				"sales_chart",
				"recent_bills",
				"quick_actions",
				"pending_payments"
			];
			case "billing": return [
				"product_search",
				"barcode_scanner",
				"customer_selection",
				"product_list",
				"payment_section",
				"quantity_controls",
				"total_summary",
				"payment_buttons",
				"print_button"
			];
			case "reports": return [
				"kpi_row",
				"filter_bar",
				"sales_chart",
				"data_table"
			];
			case "analytics": return ["kpi_row", "sales_chart"];
			case "profile": return ["profile_card"];
			case "settings": return ["settings_group", "settings_group"];
			default: return [
				"kpi_row",
				"filter_bar",
				"add_button",
				"data_table"
			];
		}
	})().map((t) => pool.find((p) => p.type === t)).filter((x) => !!x);
	return {
		screen,
		columns: def.columns,
		rowHeight: 40,
		preset: "grid",
		widgets: place(defs, def.columns),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var KEY = "nexus.screenLayouts.v1";
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
function loadLayout(customerId, screen) {
	const existing = read()[customerId]?.[screen];
	if (existing) return {
		...defaultLayoutFor(screen),
		...existing,
		widgets: existing.widgets.map((w) => ({
			...w,
			style: {
				...defaultStyle(),
				...w.style
			}
		}))
	};
	return defaultLayoutFor(screen);
}
function saveLayout(customerId, layout) {
	const s = read();
	s[customerId] = s[customerId] ?? {};
	s[customerId][layout.screen] = {
		...layout,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	write(s);
}
function ScreenBuilderPage() {
	const { data: customers } = useCustomers();
	const [customerId, setCustomerId] = (0, import_react.useState)(customers[0]?.id ?? "");
	const [screen, setScreen] = (0, import_react.useState)("dashboard");
	const [layout, setLayout] = (0, import_react.useState)(() => loadLayout(customers[0]?.id ?? "", "dashboard"));
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [future, setFuture] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [showLive, setShowLive] = (0, import_react.useState)(true);
	const [liveDevice, setLiveDevice] = (0, import_react.useState)("mobile");
	const [showRealApp, setShowRealApp] = (0, import_react.useState)(false);
	const [realAppUrl, setRealAppUrl] = (0, import_react.useState)("/pos/index.html");
	const customer = customers.find((c) => c.id === customerId) ?? customers[0] ?? {
		id: "",
		businessName: "No Customer",
		ownerName: "",
		email: "",
		mobile: "",
		address: "",
		subscriptionType: "trial",
		status: "active"
	};
	(0, import_react.useEffect)(() => {
		if (!customerId && customers.length > 0) setCustomerId(customers[0].id);
	}, [customers, customerId]);
	(0, import_react.useEffect)(() => {
		setLayout(loadLayout(customerId || customers[0]?.id || "", screen));
		setHistory([]);
		setFuture([]);
		setSelectedId(null);
	}, [
		customerId,
		screen,
		customers
	]);
	(0, import_react.useEffect)(() => {
		if (!customerId) return;
		customersApi.getLayouts(customerId).then((backendLayouts) => {
			if (backendLayouts && Object.keys(backendLayouts).length > 0) {
				const KEY = "nexus.screenLayouts.v1";
				const currentStore = JSON.parse(localStorage.getItem(KEY) || "{}");
				currentStore[customerId] = {
					...currentStore[customerId] || {},
					...backendLayouts
				};
				localStorage.setItem(KEY, JSON.stringify(currentStore));
				setLayout(loadLayout(customerId, screen));
			}
		}).catch((err) => {
			console.warn("Failed to load layouts from backend, using local cache:", err);
		});
	}, [customerId]);
	(0, import_react.useEffect)(() => {
		if (!customerId) return;
		try {
			const customerLayouts = JSON.parse(localStorage.getItem("nexus.screenLayouts.v1") || "{}")[customerId] || {};
			localStorage.setItem("flutter.pos_screen_layouts", JSON.stringify(customerLayouts));
			localStorage.setItem(`flutter.pos_screen_layouts_user_${customerId}`, JSON.stringify(customerLayouts));
		} catch (e) {
			console.warn("Failed to sync layout to flutter localStorage:", e);
		}
	}, [layout, customerId]);
	const commit = (0, import_react.useCallback)((next) => {
		setHistory((h) => [...h.slice(-39), layout]);
		setFuture([]);
		setLayout(next);
	}, [layout]);
	const undo = () => {
		if (!history.length) return;
		const prev = history[history.length - 1];
		setHistory((h) => h.slice(0, -1));
		setFuture((f) => [layout, ...f]);
		setLayout(prev);
	};
	const redo = () => {
		if (!future.length) return;
		const [next, ...rest] = future;
		setFuture(rest);
		setHistory((h) => [...h, layout]);
		setLayout(next);
	};
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
				e.preventDefault();
				undo();
			} else if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "y" || e.shiftKey && e.key.toLowerCase() === "z")) {
				e.preventDefault();
				redo();
			} else if (e.key === "Delete" && selectedId) deleteWidget(selectedId);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		history,
		future,
		layout,
		selectedId
	]);
	const save = () => {
		saveLayout(customerId, layout);
		const customerLayouts = JSON.parse(localStorage.getItem("nexus.screenLayouts.v1") || "{}")[customerId] || {};
		try {
			localStorage.setItem("flutter.pos_screen_layouts", JSON.stringify(customerLayouts));
			localStorage.setItem(`flutter.pos_screen_layouts_user_${customerId}`, JSON.stringify(customerLayouts));
		} catch (e) {
			console.warn("Failed to update Flutter web localStorage:", e);
		}
		customersApi.saveLayouts(customerId, customerLayouts).catch((err) => {
			console.error("Failed to save layouts to backend:", err);
		});
		toast.success(`Saved ${screen} layout for ${customer?.businessName ?? ""}`);
	};
	const reset = () => {
		commit(defaultLayoutFor(screen));
		toast.info("Reset to default layout");
	};
	const updateWidget = (id, patch) => {
		commit({
			...layout,
			widgets: layout.widgets.map((w) => w.id === id ? {
				...w,
				...patch,
				style: patch.style ? {
					...w.style,
					...patch.style
				} : w.style
			} : w)
		});
	};
	const deleteWidget = (id) => {
		commit({
			...layout,
			widgets: layout.widgets.filter((w) => w.id !== id)
		});
		setSelectedId(null);
	};
	const duplicateWidget = (id) => {
		const w = layout.widgets.find((x) => x.id === id);
		if (!w) return;
		const copy = {
			...w,
			id: "w_" + Date.now().toString(36),
			x: Math.min(layout.columns - w.w, w.x + 1),
			y: w.y + 1
		};
		commit({
			...layout,
			widgets: [...layout.widgets, copy]
		});
		setSelectedId(copy.id);
	};
	const addWidget = (type) => {
		const def = widgetCatalog.find((d) => d.type === type);
		if (!def) return;
		const inst = makeWidget(def, 0, maxY(layout.widgets));
		commit({
			...layout,
			widgets: [...layout.widgets, inst]
		});
		setSelectedId(inst.id);
	};
	const applyPreset = (preset) => {
		const columns = preset === "list" ? 1 : preset === "two_col" ? 2 : preset === "three_col" ? 3 : 12;
		const compact = preset === "compact";
		const modern = preset === "modern";
		const classic = preset === "classic";
		const widgets = layout.widgets.map((w, i) => ({
			...w,
			x: columns <= 3 ? 0 : w.x,
			y: columns <= 3 ? i * Math.max(1, w.h) : w.y,
			w: columns <= 3 ? columns : Math.min(w.w, 12),
			style: {
				...w.style,
				paddingPx: compact ? 6 : classic ? 8 : 12,
				radiusPx: classic ? 4 : modern ? 18 : 12,
				elevation: classic ? 0 : modern ? 6 : 2,
				shadow: !classic
			}
		}));
		commit({
			...layout,
			preset,
			columns,
			widgets
		});
		toast.success(`Applied ${preset} layout`);
	};
	const selected = layout.widgets.find((w) => w.id === selectedId) ?? null;
	const paletteWidgets = (0, import_react.useMemo)(() => {
		const list = widgetsForScreen(screen);
		if (!query) return list;
		const q = query.toLowerCase();
		return list.filter((w) => w.name.toLowerCase().includes(q) || w.type.includes(q));
	}, [screen, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-2xl font-bold tracking-tight md:text-3xl",
						children: "Customer Screen Builder"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Design each customer's app screens visually. Drag, resize, style — save as JSON."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: undo,
							disabled: !history.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "mr-1 h-4 w-4" }), "Undo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: redo,
							disabled: !future.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, { className: "mr-1 h-4 w-4" }), "Redo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: reset,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 h-4 w-4" }), "Reset"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: showLive ? "default" : "outline",
							size: "sm",
							onClick: () => setShowLive((v) => !v),
							className: showLive ? "bg-gradient-primary text-primary-foreground" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "mr-1 h-4 w-4" }),
								showLive ? "Hide" : "Show",
								" live"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmulatorButton, {
							layout,
							customerName: customer.businessName,
							screenName: screenCatalog.find((s) => s.key === screen).name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonPreview, { layout }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: save,
							className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-4 w-4" }), "Save"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-3 p-4 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: customerId,
							onValueChange: setCustomerId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "max-h-[320px]",
								children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.businessName
								}, c.id))
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Screen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: screen,
							onValueChange: (v) => setScreen(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "max-h-[320px]",
								children: screenCatalog.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s.key,
									children: s.name
								}, s.key))
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Layout preset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: layout.preset,
							onValueChange: (v) => applyPreset(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: layoutPresets.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.key,
								children: p.name
							}, p.key)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "text-xs text-muted-foreground",
							children: [
								"Grid columns (",
								layout.columns,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 1,
								max: 12,
								step: 1,
								value: [layout.columns],
								onValueChange: (v) => commit({
									...layout,
									columns: v[0]
								})
							})
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 " + (showLive ? "lg:grid-cols-[220px_minmax(0,1fr)_280px_260px]" : "lg:grid-cols-[240px_minmax(0,1fr)_300px]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm",
								children: "Widgets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: "Drag onto canvas or click to add"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search...",
									className: "h-8 pl-8 text-xs"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-[560px] space-y-1 overflow-y-auto pr-1",
								children: paletteWidgets.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									draggable: true,
									onDragStart: (e) => {
										e.dataTransfer.setData("widget/type", w.type);
										e.dataTransfer.effectAllowed = "copy";
									},
									onClick: () => addWidget(w.type),
									className: "group flex cursor-grab items-center gap-2 rounded-lg border border-border bg-background/60 px-2 py-2 text-xs transition-colors hover:border-primary/50 hover:bg-primary/5 active:cursor-grabbing",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg",
											children: w.icon
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-medium",
												children: w.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate text-[10px] text-muted-foreground",
												children: [
													w.category,
													" · ",
													w.defaultW,
													"×",
													w.defaultH
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 opacity-0 group-hover:opacity-100" })
									]
								}, w.type))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-sm flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" }),
									" ",
									screenCatalog.find((s) => s.key === screen).name,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: [layout.widgets.length, " widgets"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
									" ",
									customer.businessName
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
							layout,
							selectedId,
							onSelect: setSelectedId,
							onChange: commit,
							onDropNew: (type, x, y) => {
								const def = widgetCatalog.find((d) => d.type === type);
								if (!def) return;
								const w = makeWidget(def, x, y);
								commit({
									...layout,
									widgets: [...layout.widgets, w]
								});
								setSelectedId(w.id);
							}
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm",
								children: "Properties"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: selected ? selected.label ?? selected.type : "Select a widget"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {
							w: selected,
							columns: layout.columns,
							onChange: (patch) => updateWidget(selected.id, patch),
							onDelete: () => deleteWidget(selected.id),
							onDuplicate: () => duplicateWidget(selected.id),
							onAlign: (a) => {
								const w = selected;
								const x = a === "left" ? 0 : a === "right" ? layout.columns - w.w : Math.max(0, Math.floor((layout.columns - w.w) / 2));
								updateWidget(w.id, { x });
							},
							onGroup: (action) => {
								if (action === "group") {
									const gid = "g_" + Date.now().toString(36);
									updateWidget(selected.id, { groupId: gid });
									toast.success("Grouped");
								} else {
									updateWidget(selected.id, { groupId: void 0 });
									toast.info("Ungrouped");
								}
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
							children: "Click a widget on the canvas to edit its properties."
						}) })]
					}),
					showLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-primary/30 bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-sm flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4 text-primary" }), " Live preview"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 mr-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													id: "show-real-app",
													checked: showRealApp,
													onCheckedChange: setShowRealApp,
													className: "scale-75"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "show-real-app",
													className: "text-[10px] cursor-pointer",
													children: "Real POS"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "inline-flex overflow-hidden rounded-md border border-border text-[10px]",
												children: [
													"mobile",
													"tablet",
													"desktop"
												].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setLiveDevice(k),
													className: "px-1.5 py-0.5 " + (liveDevice === k ? "bg-primary text-primary-foreground" : "hover:bg-muted"),
													title: k,
													children: k === "mobile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" }) : k === "tablet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tablet, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3 w-3" })
												}, k))
											})]
										})]
									}),
									showRealApp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[9px] text-muted-foreground shrink-0",
											children: "POS URL:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: realAppUrl,
											onChange: (e) => setRealAppUrl(e.target.value),
											className: "h-5 text-[9px] py-0 px-1.5"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-[10px]",
										children: showRealApp ? "Running live Flutter POS inside emulator" : "Updates as you edit"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "flex justify-center px-2 pb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDevice, {
								device: liveDevice,
								layout,
								screenName: screenCatalog.find((s) => s.key === screen).name,
								customerName: customer.businessName,
								showRealApp,
								realAppUrl
							})
						})]
					})
				]
			})
		]
	});
}
function maxY(widgets) {
	return widgets.reduce((m, w) => Math.max(m, w.y + w.h), 0);
}
function Canvas({ layout, selectedId, onSelect, onChange, onDropNew }) {
	const ref = (0, import_react.useRef)(null);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const [hover, setHover] = (0, import_react.useState)(null);
	const cellSize = () => {
		const el = ref.current;
		if (!el) return {
			cw: 40,
			ch: layout.rowHeight
		};
		return {
			cw: el.clientWidth / layout.columns,
			ch: layout.rowHeight
		};
	};
	const rows = Math.max(12, maxY(layout.widgets) + 4);
	const onPointerMove = (e) => {
		if (!drag) return;
		const { cw, ch } = cellSize();
		const dx = Math.round((e.clientX - drag.startX) / cw);
		const dy = Math.round((e.clientY - drag.startY) / ch);
		const widgets = layout.widgets.map((w) => {
			if (w.id !== drag.id) return w;
			if (drag.mode === "move") return {
				...w,
				x: clamp(drag.origX + dx, 0, layout.columns - w.w),
				y: Math.max(0, drag.origY + dy)
			};
			return {
				...w,
				w: clamp(drag.origW + dx, 1, layout.columns - w.x),
				h: Math.max(1, drag.origH + dy)
			};
		});
		onChange({
			...layout,
			widgets
		});
	};
	const onPointerUp = () => setDrag(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "relative overflow-hidden rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-background to-background/50 p-2",
		style: {
			backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)`,
			backgroundSize: `${100 / layout.columns}% ${layout.rowHeight}px`,
			minHeight: rows * layout.rowHeight + 16
		},
		onClick: (e) => {
			if (e.target === e.currentTarget) onSelect(null);
		},
		onPointerMove,
		onPointerUp,
		onPointerLeave: onPointerUp,
		onDragOver: (e) => {
			if (!e.dataTransfer.types.includes("widget/type")) return;
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
			const rect = e.currentTarget.getBoundingClientRect();
			const { cw, ch } = cellSize();
			setHover({
				x: Math.floor((e.clientX - rect.left) / cw),
				y: Math.floor((e.clientY - rect.top) / ch)
			});
		},
		onDragLeave: () => setHover(null),
		onDrop: (e) => {
			const type = e.dataTransfer.getData("widget/type");
			if (!type) return;
			const rect = e.currentTarget.getBoundingClientRect();
			const { cw, ch } = cellSize();
			const x = clamp(Math.floor((e.clientX - rect.left) / cw), 0, layout.columns - 1);
			const y = Math.max(0, Math.floor((e.clientY - rect.top) / ch));
			setHover(null);
			onDropNew(type, x, y);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			style: { height: rows * layout.rowHeight },
			children: [
				layout.widgets.map((w) => {
					const def = widgetCatalog.find((d) => d.type === w.type);
					const selected = selectedId === w.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: (e) => {
							e.stopPropagation();
							onSelect(w.id);
						},
						onPointerDown: (e) => {
							if (w.locked) return;
							if (e.target.dataset.resize) return;
							onSelect(w.id);
							e.currentTarget.setPointerCapture(e.pointerId);
							setDrag({
								id: w.id,
								mode: "move",
								startX: e.clientX,
								startY: e.clientY,
								origX: w.x,
								origY: w.y,
								origW: w.w,
								origH: w.h
							});
						},
						className: "absolute overflow-hidden border transition-shadow " + (selected ? "border-primary shadow-glow ring-2 ring-primary/40" : "border-border/70 hover:border-primary/40") + (w.locked ? " cursor-not-allowed" : " cursor-move"),
						style: {
							left: `${w.x / layout.columns * 100}%`,
							top: w.y * layout.rowHeight,
							width: `${w.w / layout.columns * 100}%`,
							height: w.h * layout.rowHeight,
							padding: w.style.paddingPx,
							margin: w.style.marginPx,
							borderRadius: w.style.radiusPx,
							background: w.style.bg,
							color: w.style.fg,
							fontSize: w.style.fontSize,
							fontWeight: w.style.fontWeight,
							opacity: w.visible ? w.style.opacity : .35,
							boxShadow: w.style.shadow ? `0 ${w.style.elevation}px ${w.style.elevation * 2}px rgba(0,0,0,0.25)` : "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-[10px] opacity-80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: w.icon ?? def?.icon }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-semibold",
										children: w.label ?? def?.name
									}),
									w.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "ml-auto h-3 w-3" }),
									!w.visible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "ml-auto h-3 w-3" }),
									w.groupId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "ml-auto text-[8px]",
										children: "grp"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-1 items-center justify-center text-center text-[10px] opacity-60",
								children: def?.category
							})]
						}), selected && !w.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-resize": "true",
							onPointerDown: (e) => {
								e.stopPropagation();
								e.currentTarget.setPointerCapture(e.pointerId);
								setDrag({
									id: w.id,
									mode: "resize",
									startX: e.clientX,
									startY: e.clientY,
									origX: w.x,
									origY: w.y,
									origW: w.w,
									origH: w.h
								});
							},
							className: "absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-tl-md bg-primary/70"
						})]
					}, w.id);
				}),
				hover && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute rounded-lg border-2 border-dashed border-primary/70 bg-primary/10",
					style: {
						left: `${hover.x / layout.columns * 100}%`,
						top: hover.y * layout.rowHeight,
						width: `${1 / layout.columns * 100}%`,
						height: layout.rowHeight
					}
				}),
				layout.widgets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full min-h-[300px] items-center justify-center text-sm text-muted-foreground",
					children: "Drag widgets from the left, or click one to add it."
				})
			]
		})
	});
}
function clamp(n, lo, hi) {
	return Math.max(lo, Math.min(hi, n));
}
function Inspector({ w, columns, onChange, onDelete, onDuplicate, onAlign, onGroup }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "layout",
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "grid w-full grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "layout",
						className: "text-xs",
						children: "Layout"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "style",
						className: "text-xs",
						children: "Style"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "rules",
						className: "text-xs",
						children: "Rules"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "layout",
				className: "mt-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Label"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: w.label ?? "",
						onChange: (e) => onChange({ label: e.target.value })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
								label: "X",
								value: w.x,
								min: 0,
								max: columns - 1,
								onChange: (v) => onChange({ x: clamp(v, 0, columns - w.w) }),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveHorizontal, { className: "h-3 w-3" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
								label: "Y",
								value: w.y,
								min: 0,
								onChange: (v) => onChange({ y: Math.max(0, v) }),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveVertical, { className: "h-3 w-3" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
								label: "Width",
								value: w.w,
								min: 1,
								max: columns,
								onChange: (v) => onChange({ w: clamp(v, 1, columns - w.x) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
								label: "Height",
								value: w.h,
								min: 1,
								onChange: (v) => onChange({ h: Math.max(1, v) })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => onAlign("left"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignStart, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => onAlign("center"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignCenter, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => onAlign("right"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignEnd, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }),
						label: "Show widget",
						checked: w.visible,
						onChange: (v) => onChange({ visible: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }),
						label: "Lock position",
						checked: w.locked,
						onChange: (v) => onChange({ locked: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: onDuplicate,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3.5 w-3.5" }), "Duplicate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: onDelete,
								className: "text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), "Delete"]
							}),
							w.groupId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "col-span-2",
								onClick: () => onGroup("ungroup"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ungroup, { className: "mr-1 h-3.5 w-3.5" }), "Ungroup"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "col-span-2",
								onClick: () => onGroup("group"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { className: "mr-1 h-3.5 w-3.5" }), "Group"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "style",
				className: "mt-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
						label: "Padding",
						value: w.style.paddingPx,
						min: 0,
						max: 48,
						onChange: (v) => onChange({ style: {
							...w.style,
							paddingPx: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
						label: "Margin",
						value: w.style.marginPx,
						min: 0,
						max: 48,
						onChange: (v) => onChange({ style: {
							...w.style,
							marginPx: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
						label: "Border radius",
						value: w.style.radiusPx,
						min: 0,
						max: 48,
						onChange: (v) => onChange({ style: {
							...w.style,
							radiusPx: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
						label: "Background",
						value: w.style.bg,
						onChange: (v) => onChange({ style: {
							...w.style,
							bg: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
						label: "Text color",
						value: w.style.fg,
						onChange: (v) => onChange({ style: {
							...w.style,
							fg: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumRow, {
						label: "Font size",
						value: w.style.fontSize,
						min: 8,
						max: 40,
						onChange: (v) => onChange({ style: {
							...w.style,
							fontSize: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs text-muted-foreground",
						children: "Font weight"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: String(w.style.fontWeight),
						onValueChange: (v) => onChange({ style: {
							...w.style,
							fontWeight: Number(v)
						} }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
							300,
							400,
							500,
							600,
							700,
							800
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(n),
							children: n
						}, n)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: "text-xs text-muted-foreground",
						children: [
							"Elevation (",
							w.style.elevation,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 0,
						max: 24,
						step: 1,
						value: [w.style.elevation],
						onValueChange: (v) => onChange({ style: {
							...w.style,
							elevation: v[0]
						} })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: "text-xs text-muted-foreground",
						children: [
							"Opacity (",
							Math.round(w.style.opacity * 100),
							"%)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 10,
						max: 100,
						step: 5,
						value: [w.style.opacity * 100],
						onValueChange: (v) => onChange({ style: {
							...w.style,
							opacity: v[0] / 100
						} })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Shadow",
						checked: w.style.shadow,
						onChange: (v) => onChange({ style: {
							...w.style,
							shadow: v
						} })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "rules",
				className: "mt-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Icon (emoji)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: w.icon ?? "",
						onChange: (e) => onChange({ icon: e.target.value }),
						placeholder: "e.g. 🔥"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Visibility rule"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: w.visibilityRule ?? "",
						onChange: (e) => onChange({ visibilityRule: e.target.value }),
						placeholder: "role:admin or plan:yearly"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-muted/30 p-2 text-[10px] text-muted-foreground",
						children: [
							"Rules are evaluated in the Flutter app at render time. Example values:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "role:cashier" }),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "feature:gst" }),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "plan:yearly" }),
							"."
						]
					})
				]
			})
		]
	});
}
function Row({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children
	});
}
function NumRow({ label, value, min, max, onChange, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "flex items-center gap-1 text-xs text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			className: "h-8 text-xs",
			min,
			max,
			value,
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
function ColorRow({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value: hexify(value),
				onChange: (e) => onChange(e.target.value),
				className: "h-8 w-10 cursor-pointer rounded-md border border-border bg-transparent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => onChange(e.target.value),
				className: "h-8 flex-1 text-xs"
			})]
		})]
	});
}
function ToggleRow({ icon, label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-md border border-border px-2 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "flex items-center gap-2 text-xs",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
function hexify(v) {
	if (v.startsWith("#")) return v.length === 4 ? "#" + v.slice(1).split("").map((c) => c + c).join("") : v.slice(0, 7);
	return "#ffffff";
}
function JsonPreview({ layout }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const json = JSON.stringify(layout, null, 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "mr-1 h-4 w-4" }), "JSON"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Screen layout JSON" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Delivered to the Flutter app and cached for offline use."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-[500px] overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px]",
					children: json
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => {
						navigator.clipboard?.writeText(json);
						toast.success("Copied");
					},
					children: "Copy JSON"
				})
			]
		})]
	});
}
var DEVICE_SPECS = {
	mobile: {
		w: 320,
		h: 640,
		label: "Mobile",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3.5 w-3.5" }),
		radius: 36
	},
	tablet: {
		w: 560,
		h: 760,
		label: "Tablet",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tablet, { className: "h-3.5 w-3.5" }),
		radius: 22
	},
	desktop: {
		w: 900,
		h: 600,
		label: "Desktop",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3.5 w-3.5" }),
		radius: 14
	}
};
function LiveDevice({ device, layout, screenName, customerName, showRealApp, realAppUrl }) {
	const spec = DEVICE_SPECS[device];
	const scale = Math.min(1, (device === "mobile" ? 220 : device === "tablet" ? 240 : 250) / spec.w);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative",
		style: {
			width: spec.w * scale,
			height: (spec.h + 40) * scale
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				width: spec.w,
				height: spec.h + 40
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceFrame, {
				device,
				layout,
				screenName,
				customerName,
				showRealApp,
				realAppUrl
			})
		})
	});
}
function EmulatorButton({ layout, customerName, screenName }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [device, setDevice] = (0, import_react.useState)("mobile");
	const [tick, setTick] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "border-primary/40 text-primary hover:bg-primary/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "mr-1 h-4 w-4" }), "Emulator"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-[min(1100px,95vw)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" }),
						" Live emulator",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px]",
							children: customerName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "text-[10px]",
							children: screenName
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex overflow-hidden rounded-lg border border-border",
							children: Object.keys(DEVICE_SPECS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDevice(k),
								className: "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors " + (device === k ? "bg-gradient-primary text-primary-foreground" : "hover:bg-muted"),
								children: [DEVICE_SPECS[k].icon, DEVICE_SPECS[k].label]
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								DEVICE_SPECS[device].w,
								" × ",
								DEVICE_SPECS[device].h
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setTick((t) => t + 1),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-3.5 w-3.5" }), "Reload"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex max-h-[70vh] items-start justify-center overflow-auto bg-gradient-to-br from-muted/30 to-background p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceFrame, {
						device,
						layout,
						screenName,
						customerName
					}, tick)
				})
			]
		})]
	});
}
function DeviceFrame({ device, layout, screenName, customerName, showRealApp = false, realAppUrl = "/pos/index.html" }) {
	const spec = DEVICE_SPECS[device];
	const bezel = device === "mobile" ? 10 : device === "tablet" ? 14 : 6;
	const screenW = spec.w;
	const screenH = spec.h;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative shrink-0 bg-neutral-950 shadow-2xl",
		style: {
			width: screenW + bezel * 2,
			height: screenH + bezel * 2 + (device !== "desktop" ? 18 : 24),
			borderRadius: spec.radius,
			padding: bezel,
			paddingTop: device === "desktop" ? 24 : bezel
		},
		children: [
			device === "desktop" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-3 top-2 flex gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-red-500" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-yellow-500" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-green-500" })
				]
			}),
			device === "mobile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-1.5 z-10 h-4 w-24 -translate-x-1/2 rounded-b-2xl bg-neutral-950" }),
			showRealApp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: realAppUrl,
				className: "bg-slate-950 border-0",
				style: {
					width: screenW,
					height: screenH,
					borderRadius: Math.max(6, spec.radius - bezel)
				},
				title: "Real POS App"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col overflow-hidden bg-slate-950",
				style: {
					width: screenW,
					height: screenH,
					borderRadius: Math.max(6, spec.radius - bezel)
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-6 shrink-0 items-center justify-between bg-slate-900/60 px-4 text-[10px] text-white/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "9:41" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signal, { className: "h-3 w-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3 w-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatteryFull, { className: "h-3.5 w-3.5" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-gradient-to-r from-indigo-600 to-violet-600 px-3 text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 opacity-80" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[11px] font-semibold",
									children: screenName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[9px] opacity-70",
									children: customerName
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 opacity-80" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-auto bg-slate-900 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderedScreen, {
							layout,
							availableWidth: screenW - 16
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 shrink-0 grid-cols-4 border-t border-white/10 bg-slate-900/80 text-white/80",
						children: [
							"🏠 Home",
							"🧾 Bill",
							"📦 Stock",
							"⋯ More"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center text-[9px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: t.split(" ")[0]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.split(" ")[1] })]
						}, t))
					})
				]
			})
		]
	});
}
function RenderedScreen({ layout, availableWidth }) {
	const visible = layout.widgets.filter((w) => w.visible);
	const cw = availableWidth / layout.columns;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full",
		style: { height: Math.max(...visible.map((w) => w.y + w.h), 8) * layout.rowHeight },
		children: [visible.map((w) => {
			const def = widgetCatalog.find((d) => d.type === w.type);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute overflow-hidden text-white/90",
				style: {
					left: w.x * cw,
					top: w.y * layout.rowHeight,
					width: w.w * cw,
					height: w.h * layout.rowHeight,
					padding: w.style.paddingPx,
					margin: w.style.marginPx,
					borderRadius: w.style.radiusPx,
					background: w.style.bg === "rgba(255,255,255,0.04)" ? "#1e293b" : w.style.bg,
					color: w.style.fg,
					fontSize: Math.min(w.style.fontSize, 12),
					fontWeight: w.style.fontWeight,
					opacity: w.style.opacity,
					boxShadow: w.style.shadow ? `0 ${w.style.elevation}px ${w.style.elevation * 2}px rgba(0,0,0,0.35)` : "none",
					border: "1px solid rgba(255,255,255,0.08)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockWidget, {
					type: w.type,
					label: w.label ?? def?.name ?? w.type,
					icon: w.icon ?? def?.icon ?? "•"
				})
			}, w.id);
		}), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full items-center justify-center text-center text-[10px] text-white/40",
			children: "No visible widgets — hidden or empty layout."
		})]
	});
}
function MockWidget({ type, label, icon }) {
	const kpi = (val, sub, colorClass = "text-indigo-400 bg-indigo-500/10") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-between p-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold text-slate-400 truncate max-w-[70%]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${colorClass}`,
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-base font-bold text-white mt-1 leading-none",
				children: val
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[8px] text-slate-400 opacity-80 truncate",
				children: sub
			})
		]
	});
	const list = (rows) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col p-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold text-slate-400 mb-2",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 space-y-1.5 overflow-hidden",
			children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/5 pb-1 text-[9px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium text-white truncate",
						children: r.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[7px] text-slate-400 truncate",
						children: r.subtitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `font-bold ml-2 ${r.rightColor}`,
					children: r.right
				})]
			}, i))
		})]
	});
	const chart = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col p-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold text-slate-400 mb-2",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative flex-1 w-full bg-slate-900/40 rounded border border-white/5 p-1 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "w-full h-full",
				viewBox: "0 0 100 60",
				preserveAspectRatio: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "chartGrad",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#6366f1",
							stopOpacity: "0.4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#6366f1",
							stopOpacity: "0"
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "15",
						x2: "100",
						y2: "15",
						stroke: "rgba(255,255,255,0.05)",
						strokeWidth: "0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "30",
						x2: "100",
						y2: "30",
						stroke: "rgba(255,255,255,0.05)",
						strokeWidth: "0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "45",
						x2: "100",
						y2: "45",
						stroke: "rgba(255,255,255,0.05)",
						strokeWidth: "0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 0 50 C 20 20, 40 45, 60 15 C 80 25, 90 10, 100 35 L 100 60 L 0 60 Z",
						fill: "url(#chartGrad)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 0 50 C 20 20, 40 45, 60 15 C 80 25, 90 10, 100 35",
						fill: "none",
						stroke: "#6366f1",
						strokeWidth: "2",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "0",
						cy: "50",
						r: "1.5",
						fill: "#6366f1",
						stroke: "white",
						strokeWidth: "0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "30",
						cy: "32",
						r: "1.5",
						fill: "#6366f1",
						stroke: "white",
						strokeWidth: "0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "15",
						r: "1.5",
						fill: "#6366f1",
						stroke: "white",
						strokeWidth: "0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "100",
						cy: "35",
						r: "1.5",
						fill: "#6366f1",
						stroke: "white",
						strokeWidth: "0.5"
					})
				]
			})
		})]
	});
	const action = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full items-center justify-center gap-1 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-[10px] font-semibold text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		})]
	});
	const input = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full items-center gap-2 rounded-md bg-white/10 px-2 text-[10px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "opacity-70",
			children: [label, "..."]
		})]
	});
	const section = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col rounded bg-white/5 p-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 text-[9px] font-semibold opacity-80",
			children: [
				icon,
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[9px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "₹1,240" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[9px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tax (18%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "₹223" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex justify-between border-t border-white/10 pt-1 text-[10px] font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "₹1,463" })]
				})
			]
		})]
	});
	switch (type) {
		case "sales_card": return kpi("₹42,850", "Today ↑ 12%", "text-indigo-400 bg-indigo-500/10");
		case "profit_card": return kpi("₹18,320", "Margin 28%", "text-blue-400 bg-blue-500/10");
		case "inventory_card": return kpi("1,284", "SKUs in stock", "text-teal-400 bg-teal-500/10");
		case "low_stock_card": return kpi("17", "Reorder soon", "text-amber-400 bg-amber-500/10");
		case "customer_count": return kpi("362", "Active", "text-orange-400 bg-orange-500/10");
		case "employee_count": return kpi("14", "On duty", "text-emerald-400 bg-emerald-500/10");
		case "pending_payments": return list([
			{
				title: "Sharma Traders",
				subtitle: "Invoice #9832",
				right: "₹450.0",
				rightColor: "text-amber-500"
			},
			{
				title: "Cafe Aroma",
				subtitle: "Invoice #9810",
				right: "₹280.0",
				rightColor: "text-amber-500"
			},
			{
				title: "Delhi Sweets",
				subtitle: "Invoice #9744",
				right: "₹190.0",
				rightColor: "text-amber-500"
			}
		]);
		case "recent_bills": return list([
			{
				title: "INV-2401",
				subtitle: "10:15 AM · 3 items",
				right: "₹1,240.0",
				rightColor: "text-emerald-500"
			},
			{
				title: "INV-2402",
				subtitle: "10:30 AM · 1 item",
				right: "₹450.0",
				rightColor: "text-emerald-500"
			},
			{
				title: "INV-2403",
				subtitle: "11:15 AM · 5 items",
				right: "₹2,890.0",
				rightColor: "text-emerald-500"
			},
			{
				title: "INV-2404",
				subtitle: "11:45 AM · 2 items",
				right: "₹760.0",
				rightColor: "text-emerald-500"
			}
		]);
		case "product_list": return list([
			{
				title: "Coca Cola 500ml",
				subtitle: "Soft Drinks",
				right: "₹40.0",
				rightColor: "text-emerald-500"
			},
			{
				title: "Basmati Rice 5kg",
				subtitle: "Grains",
				right: "₹450.0",
				rightColor: "text-emerald-500"
			},
			{
				title: "Sunfeast Biscuit",
				subtitle: "Snacks",
				right: "₹20.0",
				rightColor: "text-emerald-500"
			}
		]);
		case "sales_chart": return chart();
		case "quick_actions": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full flex-col p-1 justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-semibold text-slate-400 mb-1",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 flex-1 items-center justify-around",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[9px] shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🧾" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Bill" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium border border-white/10 text-[9px] shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "➕" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Product" })]
				})]
			})]
		});
		case "product_search": return input();
		case "barcode_scanner":
		case "discount_button":
		case "hold_bill":
		case "print_button":
		case "add_button":
		case "payment_buttons": return action();
		case "customer_selection":
		case "weight_input":
		case "quantity_controls":
		case "filter_bar": return input();
		case "payment_section":
		case "total_summary":
		case "tax_summary":
		case "settings_group":
		case "profile_card": return section();
		case "data_table": return list([{
			title: "Row A",
			subtitle: "Description A",
			right: "₹120.0",
			rightColor: "text-white"
		}, {
			title: "Row B",
			subtitle: "Description B",
			right: "₹340.0",
			rightColor: "text-white"
		}]);
		case "kpi_row": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-full grid-cols-4 gap-1 text-[9px]",
			children: [
				["Sales", "₹42k"],
				["Bills", "128"],
				["Cust", "362"],
				["Profit", "₹18k"]
			].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center rounded bg-white/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "opacity-60",
					children: l
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold",
					children: v
				})]
			}, l))
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full flex-col items-center justify-center text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xl",
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] opacity-80",
				children: label
			})]
		});
	}
}
//#endregion
export { ScreenBuilderPage as component };
