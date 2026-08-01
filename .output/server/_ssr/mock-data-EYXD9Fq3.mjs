//#region node_modules/.nitro/vite/services/ssr/assets/mock-data-EYXD9Fq3.js
var featureCatalog = [
	{
		key: "gst_billing",
		name: "GST Billing",
		description: "Generate GST-compliant invoices",
		category: "Billing"
	},
	{
		key: "thermal_print",
		name: "Thermal Printer",
		description: "58mm / 80mm receipt printing",
		category: "Billing"
	},
	{
		key: "multi_counter",
		name: "Multi Counter POS",
		description: "Run multiple billing counters",
		category: "Billing"
	},
	{
		key: "barcode",
		name: "Barcode Scanner",
		description: "Scan & generate product barcodes",
		category: "Inventory"
	},
	{
		key: "low_stock_alert",
		name: "Low Stock Alerts",
		description: "Notify when stock is low",
		category: "Inventory"
	},
	{
		key: "multi_warehouse",
		name: "Multi Warehouse",
		description: "Manage multiple stock locations",
		category: "Inventory"
	},
	{
		key: "sales_report",
		name: "Sales Reports",
		description: "Daily / monthly sales analytics",
		category: "Reports"
	},
	{
		key: "profit_report",
		name: "Profit & Loss",
		description: "P&L and margin reports",
		category: "Reports"
	},
	{
		key: "whatsapp",
		name: "WhatsApp Invoices",
		description: "Send bills over WhatsApp",
		category: "Integrations"
	},
	{
		key: "sms_alerts",
		name: "SMS Alerts",
		description: "Transactional SMS to customers",
		category: "Integrations"
	},
	{
		key: "tally_export",
		name: "Tally Export",
		description: "Export data to Tally",
		category: "Integrations"
	},
	{
		key: "online_orders",
		name: "Online Orders",
		description: "Accept orders via storefront link",
		category: "Advanced"
	},
	{
		key: "loyalty",
		name: "Loyalty Program",
		description: "Customer points & rewards",
		category: "Advanced"
	},
	{
		key: "ai_insights",
		name: "AI Insights",
		description: "AI-powered sales suggestions",
		category: "Advanced"
	}
];
var defaultFeaturesFor = (plan) => {
	const enabledKeys = plan === "yearly" ? featureCatalog.map((f) => f.key) : plan === "monthly" ? [
		"gst_billing",
		"thermal_print",
		"barcode",
		"low_stock_alert",
		"sales_report",
		"whatsapp",
		"sms_alerts"
	] : [
		"gst_billing",
		"barcode",
		"sales_report"
	];
	return featureCatalog.map((f) => ({
		key: f.key,
		name: f.name,
		description: f.description,
		category: f.category,
		enabled: enabledKeys.includes(f.key)
	}));
};
var customers = [{
	id: "1",
	businessName: "Apex Bakery & Retail",
	ownerName: "Rajesh Kumar",
	mobile: "+91 98765 43210",
	email: "apex@bakery.com",
	address: "MG Road, Bangalore",
	subscriptionType: "yearly",
	expiryDate: new Date(Date.now() + 365 * 864e5).toISOString(),
	status: "active",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
	bills: 142,
	products: 38,
	features: defaultFeaturesFor("yearly")
}, {
	id: "2",
	businessName: "Star Supermarket",
	ownerName: "Anil Sharma",
	mobile: "+91 91234 56789",
	email: "star@supermarket.com",
	address: "Indiranagar, Bangalore",
	subscriptionType: "monthly",
	expiryDate: new Date(Date.now() + 30 * 864e5).toISOString(),
	status: "active",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
	bills: 89,
	products: 65,
	features: defaultFeaturesFor("monthly")
}];
var stats = {
	totalCustomers: 0,
	activeCustomers: 0,
	expiredCustomers: 0,
	trialCustomers: 0,
	suspendedCustomers: 0,
	monthlyRevenue: 0,
	yearlyRevenue: 0,
	totalBills: 0,
	totalProducts: 0,
	activeSubscriptions: 0
};
var customerGrowth = [];
var monthlyRevenue = [];
var subscriptionGrowth = [];
var dailyRegistrations = [];
var subscriptionMix = [];
var recentActivity = [];
var fmtCurrency = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
var fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
	day: "2-digit",
	month: "short",
	year: "numeric"
});
//#endregion
export { fmtCurrency as a, recentActivity as c, subscriptionMix as d, defaultFeaturesFor as i, stats as l, customers as n, fmtDate as o, dailyRegistrations as r, monthlyRevenue as s, customerGrowth as t, subscriptionGrowth as u };
