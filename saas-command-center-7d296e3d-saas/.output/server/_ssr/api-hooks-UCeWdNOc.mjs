import { c as recentActivity, d as subscriptionMix, l as stats, n as customers, r as dailyRegistrations, s as monthlyRevenue, t as customerGrowth, u as subscriptionGrowth } from "./mock-data-EYXD9Fq3.mjs";
import { a as customersApi, c as paymentsApi, o as dashboardApi, s as notificationsApi, u as settingsApi } from "./api-D5gYHQcL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-hooks-UCeWdNOc.js
var KEYS = {
	customers: ["customers"],
	payments: ["payments"],
	audit: ["audit-logs"],
	stats: ["dashboard", "stats"],
	charts: ["dashboard", "charts"],
	activity: ["dashboard", "activity"],
	features: ["features", "catalog"]
};
function useCustomers() {
	return useQuery({
		queryKey: KEYS.customers,
		queryFn: customersApi.list,
		initialData: customers
	});
}
function usePayments() {
	return useQuery({
		queryKey: KEYS.payments,
		queryFn: paymentsApi.list,
		initialData: []
	});
}
function useDashboardStats() {
	return useQuery({
		queryKey: KEYS.stats,
		queryFn: dashboardApi.stats,
		initialData: stats
	});
}
function useDashboardCharts() {
	return useQuery({
		queryKey: KEYS.charts,
		queryFn: dashboardApi.charts,
		initialData: {
			customerGrowth,
			monthlyRevenue,
			subscriptionGrowth,
			dailyRegistrations,
			subscriptionMix
		}
	});
}
function useDashboardActivity() {
	return useQuery({
		queryKey: KEYS.activity,
		queryFn: dashboardApi.activity,
		initialData: recentActivity.map((r) => ({
			...r,
			id: String(r.id),
			time: r.time
		}))
	});
}
function useUpdateCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input) => customersApi.update(input.id, input.patch ?? input),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.customers });
		}
	});
}
function useDeleteCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id) => customersApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.customers });
		}
	});
}
function useCreateCustomer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input) => customersApi.create(input),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.customers });
		}
	});
}
var SEED_NOTIFICATIONS = [];
var SEED_PREFS = [
	{
		key: "expiry",
		label: "Subscription expiry alerts",
		desc: "7, 3 and 1 day before expiry",
		enabled: true
	},
	{
		key: "renewal",
		label: "Renewal reminders",
		desc: "Auto-send email + SMS to customers",
		enabled: true
	},
	{
		key: "signup",
		label: "New customer registrations",
		desc: "Notify me when a tenant signs up",
		enabled: true
	},
	{
		key: "failed",
		label: "Failed payments",
		desc: "Alert on payment failures",
		enabled: true
	}
];
function useNotifications() {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: notificationsApi.list,
		initialData: SEED_NOTIFICATIONS
	});
}
function useNotificationPrefs() {
	return useQuery({
		queryKey: ["notification-prefs"],
		queryFn: notificationsApi.prefs,
		initialData: SEED_PREFS
	});
}
function useUpdateNotificationPrefs() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (items) => notificationsApi.updatePrefs(items),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notification-prefs"] });
		}
	});
}
var SEED_SETTINGS = {
	company: {
		name: "My SaaS Platform",
		email: "admin@mysaas.com",
		phone: "",
		website: "",
		address: ""
	},
	email: {
		host: "",
		port: "587",
		username: "",
		password: "",
		from_name: "SaaS Admin",
		from_email: "no-reply@mysaas.com"
	},
	backup: {
		schedule: "Daily",
		retention: "30 days",
		storage: "",
		last_backup: "Never"
	},
	security: {
		enforce_2fa: "false",
		auto_lock: "true",
		ip_allowlist: "false",
		audit_immutable: "true"
	},
	api: {
		base_url: "",
		jwt_expiry: "60",
		rate_limit: "120",
		webhook_secret: ""
	}
};
function useSettings() {
	return useQuery({
		queryKey: ["settings"],
		queryFn: settingsApi.all,
		initialData: SEED_SETTINGS
	});
}
function useUpdateSettingsSection() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (v) => settingsApi.updateSection(v.section, v.values),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["settings"] });
		}
	});
}
//#endregion
export { useDashboardStats as a, useNotifications as c, useUpdateCustomer as d, useUpdateNotificationPrefs as f, useDashboardCharts as i, usePayments as l, useCustomers as n, useDeleteCustomer as o, useUpdateSettingsSection as p, useDashboardActivity as r, useNotificationPrefs as s, useCreateCustomer as t, useSettings as u };
