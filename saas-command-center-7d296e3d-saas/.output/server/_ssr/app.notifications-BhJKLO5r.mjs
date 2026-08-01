import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { Jt as BellRing, Mt as CircleX, R as RefreshCw, c as UserPlus, m as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useNotifications, f as useUpdateNotificationPrefs, s as useNotificationPrefs } from "./api-hooks-UCeWdNOc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.notifications-BhJKLO5r.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	expiry: {
		icon: TriangleAlert,
		color: "bg-warning/15 text-warning"
	},
	new: {
		icon: UserPlus,
		color: "bg-success/15 text-success"
	},
	renewal: {
		icon: RefreshCw,
		color: "bg-primary/15 text-primary"
	},
	failed: {
		icon: CircleX,
		color: "bg-destructive/15 text-destructive"
	}
};
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}
function NotificationsPage() {
	const { data: items } = useNotifications();
	const { data: prefs } = useNotificationPrefs();
	const updatePrefs = useUpdateNotificationPrefs();
	const togglePref = (key, enabled) => {
		const next = prefs.map((p) => p.key === key ? {
			...p,
			enabled
		} : p);
		updatePrefs.mutate(next, {
			onSuccess: () => toast.success("Preferences updated"),
			onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight md:text-3xl",
			children: "Notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Stay on top of subscriptions, renewals and new signups."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent notifications" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "No notifications yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: items.map((n) => {
						const meta = ICONS[n.type] ?? {
							icon: BellRing,
							color: "bg-muted text-muted-foreground"
						};
						const Icon = meta.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", meta.color),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: n.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm text-muted-foreground",
										children: n.desc
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "shrink-0 text-xs text-muted-foreground",
									children: timeAgo(n.time)
								})
							]
						}, n.id);
					})
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Preferences" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [prefs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 rounded-lg border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "font-medium",
								children: p.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: p.desc
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: p.enabled,
							onCheckedChange: (v) => togglePref(p.key, v),
							className: "shrink-0"
						})]
					}, p.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "mr-1 inline h-3 w-3" }), " Email & SMS channels use your configured settings."]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { NotificationsPage as component };
