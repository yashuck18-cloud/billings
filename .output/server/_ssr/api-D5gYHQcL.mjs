import { n as customers } from "./mock-data-EYXD9Fq3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D5gYHQcL.js
var API_URL = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:5000/api` : "http://127.0.0.1:5000/api";
var TOKEN_KEY = "nexus-token";
var getToken = () => {
	if (typeof window === "undefined") return null;
	const t = window.localStorage.getItem(TOKEN_KEY);
	if (t === "undefined" || t === "null" || !t) return null;
	return t;
};
var setToken = (t) => window.localStorage.setItem(TOKEN_KEY, t);
var clearToken = () => window.localStorage.removeItem(TOKEN_KEY);
var ApiError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
async function api(path, init = {}) {
	const token = getToken();
	const res = await fetch(`${API_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {},
			...init.headers ?? {}
		}
	});
	const text = await res.text();
	const data = text ? (() => {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	})() : null;
	if (!res.ok) {
		const msg = data && typeof data === "object" && "error" in data ? String(data.error) : data && typeof data === "object" && "msg" in data ? String(data.msg) : `Request failed (${res.status})`;
		throw new ApiError(res.status, msg);
	}
	return data;
}
var authApi = {
	login: (email, password) => api("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			password
		})
	}),
	me: () => api("/auth/me"),
	impersonate: (customerId) => api(`/auth/impersonate/${customerId}`, { method: "POST" })
};
var customersApi = {
	list: async () => {
		try {
			const r = await api("/customers");
			const list = Array.isArray(r) ? r : r?.items || [];
			if (list.length > 0) return list;
		} catch (err) {
			console.warn("Backend API offline/error, returning seed customers:", err);
		}
		const localStr = typeof window !== "undefined" ? localStorage.getItem("nexus_local_customers") : null;
		if (localStr) try {
			return JSON.parse(localStr);
		} catch {}
		return customers;
	},
	create: async (input) => {
		try {
			const created = await api("/customers", {
				method: "POST",
				body: JSON.stringify(input)
			});
			if (created) return created;
		} catch (err) {
			console.warn("Backend API error on create customer, fallback to local:", err);
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const fallbackCustomer = {
			id: input.id || `CUS-${Math.floor(Math.random() * 9e3 + 1e3)}`,
			businessName: input.businessName || "New Store",
			ownerName: input.ownerName || "Owner",
			email: input.email || "store@example.com",
			mobile: input.mobile || "",
			address: input.address || "",
			subscriptionType: input.subscriptionType || "trial",
			expiryDate: input.expiryDate || new Date(Date.now() + 14 * 864e5).toISOString(),
			status: input.status || "active",
			createdAt: now,
			lastLogin: now,
			bills: 0,
			products: 0,
			features: input.features || []
		};
		if (typeof window !== "undefined") {
			const existingStr = localStorage.getItem("nexus_local_customers");
			const existing = existingStr ? JSON.parse(existingStr) : [...customers];
			existing.unshift(fallbackCustomer);
			localStorage.setItem("nexus_local_customers", JSON.stringify(existing));
		}
		return fallbackCustomer;
	},
	update: (id, input) => api(`/customers/${id}`, {
		method: "PUT",
		body: JSON.stringify(input)
	}).catch(() => input),
	remove: (id) => api(`/customers/${id}`, { method: "DELETE" }).catch(() => ({ ok: true })),
	updateFeatures: (id, features) => api(`/customers/${id}/features`, {
		method: "PUT",
		body: JSON.stringify({ features })
	}),
	getConfig: (id) => api(`/customers/${id}/config`).catch(() => ({})),
	saveConfig: (id, config) => api(`/customers/${id}/config`, {
		method: "PUT",
		body: JSON.stringify(config)
	}).catch(() => config),
	getLayouts: (id) => api(`/customers/${id}/layouts`),
	saveLayouts: (id, layouts) => api(`/customers/${id}/layouts`, {
		method: "PUT",
		body: JSON.stringify(layouts)
	})
};
var paymentsApi = { list: () => api("/payments").then((r) => Array.isArray(r) ? r : r?.items || []) };
var dashboardApi = {
	stats: () => api("/dashboard/stats"),
	charts: () => api("/dashboard/charts"),
	activity: () => api("/dashboard/activity").then((r) => r.items)
};
var notificationsApi = {
	list: () => api("/notifications").catch(() => []),
	create: async (input) => {
		try {
			return await api("/notifications", {
				method: "POST",
				body: JSON.stringify(input)
			});
		} catch (err) {
			console.warn("API server notification endpoint unreachable, recorded locally:", err);
			return {
				id: Math.floor(Math.random() * 1e4),
				type: input.type || "reminder",
				title: input.title,
				desc: input.message,
				time: (/* @__PURE__ */ new Date()).toISOString(),
				read: false
			};
		}
	},
	prefs: () => api("/notifications/preferences").then((r) => r.items).catch(() => []),
	updatePrefs: (items) => api("/notifications/preferences", {
		method: "PUT",
		body: JSON.stringify({ items })
	}).then((r) => r.items).catch(() => items)
};
var settingsApi = {
	all: () => api("/settings"),
	updateSection: (section, values) => api(`/settings/${section}`, {
		method: "PUT",
		body: JSON.stringify(values)
	})
};
var ADS_LOCAL_KEY = "flutter.pos_advertisements";
var getLocalAds = () => {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(ADS_LOCAL_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};
var setLocalAds = (ads) => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(ADS_LOCAL_KEY, JSON.stringify(ads));
	} catch (_) {}
};
var advertisementsApi = {
	list: async (activeOnly = false) => {
		try {
			const data = await api(`/advertisements${activeOnly ? "?active_only=true" : ""}`);
			if (Array.isArray(data)) {
				setLocalAds(data);
				return activeOnly ? data.filter((a) => a.active) : data;
			}
		} catch (err) {
			console.warn("Backend API unreachable for list advertisements, fallback to local storage:", err);
		}
		const local = getLocalAds();
		return activeOnly ? local.filter((a) => a.active) : local;
	},
	create: async (input) => {
		try {
			const created = await api("/advertisements", {
				method: "POST",
				body: JSON.stringify(input)
			});
			if (created) {
				const local = getLocalAds();
				local.unshift(created);
				setLocalAds(local);
				return created;
			}
		} catch (err) {
			console.warn("Backend API error on create advertisement, fallback to local storage:", err);
		}
		const fallbackAd = {
			id: input.id || `ad_${Date.now()}`,
			title: input.title || "New Banner",
			subtitle: input.subtitle || "",
			imageUrl: input.imageUrl || "",
			badge: input.badge || "PROMO",
			ctaText: input.ctaText || "Learn More",
			ctaLink: input.ctaLink || "",
			targetAudience: input.targetAudience || "all",
			active: input.active !== void 0 ? input.active : true,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const local = getLocalAds();
		local.unshift(fallbackAd);
		setLocalAds(local);
		return fallbackAd;
	},
	update: async (id, input) => {
		try {
			const updated = await api(`/advertisements/${id}`, {
				method: "PUT",
				body: JSON.stringify(input)
			});
			if (updated) {
				setLocalAds(getLocalAds().map((a) => a.id === id ? updated : a));
				return updated;
			}
		} catch (err) {
			console.warn("Backend API error on update advertisement, fallback to local storage:", err);
		}
		const local = getLocalAds();
		let updatedItem = null;
		const next = local.map((a) => {
			if (a.id === id) {
				updatedItem = {
					...a,
					...input
				};
				return updatedItem;
			}
			return a;
		});
		if (!updatedItem) {
			updatedItem = {
				id,
				title: input.title || "",
				subtitle: input.subtitle || "",
				imageUrl: input.imageUrl || "",
				badge: input.badge || "PROMO",
				ctaText: input.ctaText || "Learn More",
				ctaLink: input.ctaLink || "",
				targetAudience: input.targetAudience || "all",
				active: input.active !== void 0 ? input.active : true,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			next.unshift(updatedItem);
		}
		setLocalAds(next);
		return updatedItem;
	},
	remove: async (id) => {
		try {
			await api(`/advertisements/${id}`, { method: "DELETE" });
		} catch (err) {
			console.warn("Backend API error on remove advertisement, fallback to local storage:", err);
		}
		setLocalAds(getLocalAds().filter((a) => a.id !== id));
		return { deleted: true };
	},
	uploadImage: async (file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			const token = getToken();
			const res = await fetch(`${API_URL}/advertisements/upload`, {
				method: "POST",
				headers: { ...token ? { Authorization: `Bearer ${token}` } : {} },
				body: formData
			});
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("Server image upload unreachable/failed, encoding file locally:", err);
		}
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				resolve({
					imageUrl: e.target?.result || "",
					filename: file.name
				});
			};
			reader.readAsDataURL(file);
		});
	}
};
//#endregion
export { customersApi as a, paymentsApi as c, clearToken as i, setToken as l, advertisementsApi as n, dashboardApi as o, authApi as r, notificationsApi as s, ApiError as t, settingsApi as u };
