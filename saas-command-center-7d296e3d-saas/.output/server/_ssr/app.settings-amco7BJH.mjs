import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { Gt as Building2, I as Save, O as Shield, Tt as DatabaseBackup, bt as EyeOff, et as Mail, lt as KeyRound, qt as Bell, yt as Eye } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { p as useUpdateSettingsSection, u as useSettings } from "./api-hooks-UCeWdNOc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.settings-amco7BJH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [tab, setTab] = (0, import_react.useState)("company");
	const { data: settings } = useSettings();
	const updateSection = useUpdateSettingsSection();
	const save = (section, values) => {
		updateSection.mutate({
			section,
			values
		}, {
			onSuccess: () => toast.success("Settings saved"),
			onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight md:text-3xl",
			children: "Settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Company, email, notifications, backups, security and API."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: tab,
			onValueChange: setTab,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "company",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mr-1 h-4 w-4" }), "Company"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "email",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mr-1 h-4 w-4" }), "Email"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "notifications",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mr-1 h-4 w-4" }), "Notifications"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "backup",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatabaseBackup, { className: "mr-1 h-4 w-4" }), "Backup"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "security",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mr-1 h-4 w-4" }), "Security"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "api",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-1 h-4 w-4" }), "API"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "company",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionForm, {
						title: "Company information",
						fields: [
							["name", "Company name"],
							["email", "Contact email"],
							["phone", "Support phone"],
							["website", "Website"],
							[
								"address",
								"Address",
								2
							]
						],
						values: settings.company ?? {},
						onSave: (v) => save("company", v)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionForm, {
						title: "SMTP settings",
						fields: [
							["host", "SMTP host"],
							["port", "SMTP port"],
							["username", "Username"],
							[
								"password",
								"Password",
								1,
								"password"
							],
							["from_name", "From name"],
							["from_email", "From email"]
						],
						values: settings.email ?? {},
						onSave: (v) => save("email", v)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "notifications",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsSettingsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "backup",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionForm, {
						title: "Backup & restore",
						fields: [
							["schedule", "Automatic backups"],
							["retention", "Retention"],
							["storage", "Storage"],
							["last_backup", "Last backup"]
						],
						values: settings.backup ?? {},
						onSave: (v) => save("backup", v),
						extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => toast.success("Backup started"),
								children: "Run backup now"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => toast.info("Restore wizard opened"),
								children: "Restore"
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "security",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityForm, {
						values: settings.security ?? {},
						onSave: (v) => save("security", v)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "api",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionForm, {
						title: "API settings",
						fields: [
							["base_url", "Base URL"],
							["jwt_expiry", "JWT expiry (minutes)"],
							["rate_limit", "Rate limit (req/min)"],
							[
								"webhook_secret",
								"Webhook secret",
								1,
								"password"
							]
						],
						values: settings.api ?? {},
						onSave: (v) => save("api", v)
					})
				})
			]
		})]
	});
}
function FormInputItem({ label, type = "text", value, onChange }) {
	const [show, setShow] = (0, import_react.useState)(false);
	const isPassword = type === "password";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: isPassword ? show ? "text" : "password" : type,
				value,
				onChange: (e) => onChange(e.target.value),
				className: isPassword ? "pr-10" : ""
			}), isPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setShow(!show),
				className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none",
				title: show ? "Hide password" : "Show password",
				children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
			})]
		})]
	});
}
function SectionForm({ title, fields, values, onSave, extra }) {
	const [form, setForm] = (0, import_react.useState)(values);
	(0, import_react.useEffect)(() => setForm(values), [values]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => onSave(form),
				className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-4 w-4" }), " Save"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: fields.map(([key, label, span = 1, type = "text"]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn2(span === 2 && "md:col-span-2"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormInputItem, {
						label,
						type,
						value: form[key] ?? "",
						onChange: (val) => setForm((f) => ({
							...f,
							[key]: val
						}))
					})
				}, key))
			}), extra]
		})]
	});
}
function SecurityForm({ values, onSave }) {
	const [form, setForm] = (0, import_react.useState)(values);
	(0, import_react.useEffect)(() => setForm(values), [values]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Security" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => onSave(form),
				className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-4 w-4" }), " Save"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-3",
			children: [
				[
					"enforce_2fa",
					"Enforce 2FA for all admins",
					"Require TOTP for every admin login"
				],
				[
					"auto_lock",
					"Auto-lock expired accounts",
					"Lock tenant on subscription expiry"
				],
				[
					"ip_allowlist",
					"IP allow list",
					"Restrict admin access to allowed IPs"
				],
				[
					"audit_immutable",
					"Audit log immutability",
					"Prevent deletion of audit records"
				]
			].map(([key, label, desc]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 rounded-lg border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: desc
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: form[key] === "true",
					onCheckedChange: (v) => setForm((f) => ({
						...f,
						[key]: v ? "true" : "false"
					}))
				})]
			}, key))
		})]
	});
}
function NotificationsSettingsTab() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Notification channels" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4 text-sm text-muted-foreground",
			children: [
				"Configure per-event notification preferences on the",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/app/notifications",
					className: "text-primary hover:underline",
					children: "Notifications page"
				}),
				"."
			]
		})]
	});
}
function cn2(...args) {
	return args.filter(Boolean).join(" ");
}
//#endregion
export { SettingsPage as component };
