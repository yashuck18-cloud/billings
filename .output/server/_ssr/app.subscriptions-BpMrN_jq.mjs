import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { A as ShieldCheck, H as Plus, Jt as BellRing, Mt as CircleX, N as Send, R as RefreshCw, Ut as Calendar, Wt as CalendarClock, k as ShieldOff } from "../_libs/lucide-react.mjs";
import { o as fmtDate } from "./mock-data-EYXD9Fq3.mjs";
import { s as notificationsApi } from "./api-D5gYHQcL.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { d as useUpdateCustomer, n as useCustomers } from "./api-hooks-UCeWdNOc.mjs";
import { n as StatusBadge, t as PlanBadge } from "./status-badge-BNf7mQec.mjs";
import { t as StatCard } from "./stat-card-qgEus3lo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.subscriptions-BpMrN_jq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REMINDER_TIMINGS = [
	"30 days before expiry (optional)",
	"15 days before expiry",
	"7 days before expiry",
	"3 days before expiry",
	"1 day before expiry",
	"On the expiry date",
	"1 day after expiry",
	"3 days after expiry",
	"7 days after expiry",
	"Before account suspension"
];
function SubscriptionsPage() {
	const [tab, setTab] = (0, import_react.useState)("all");
	const { data: customers } = useCustomers();
	const updateMut = useUpdateCustomer();
	const [extendingCustomer, setExtendingCustomer] = (0, import_react.useState)(null);
	const [remindingCustomer, setRemindingCustomer] = (0, import_react.useState)(null);
	const now = Date.now();
	const day = 864e5;
	const buckets = (0, import_react.useMemo)(() => ({
		all: customers,
		active: customers.filter((c) => c.status === "active"),
		trial: customers.filter((c) => c.status === "trial"),
		expiring: customers.filter((c) => {
			const d = (new Date(c.expiryDate).getTime() - now) / day;
			return d >= 0 && d <= 14 && c.status !== "expired" && c.status !== "suspended";
		}),
		expired: customers.filter((c) => c.status === "expired" || c.status === "suspended")
	}), [
		customers,
		now,
		day
	]);
	const rows = buckets[tab];
	const handleRenew = (c) => {
		const daysToAdd = c.subscriptionType === "yearly" ? 365 : c.subscriptionType === "monthly" ? 30 : 7;
		const currentExpiry = new Date(c.expiryDate).getTime();
		const newExpiry = new Date((currentExpiry > now ? currentExpiry : now) + daysToAdd * day).toISOString();
		const newPurchasedDate = (/* @__PURE__ */ new Date()).toISOString();
		const newStatus = c.subscriptionType === "trial" ? "trial" : "active";
		updateMut.mutate({
			...c,
			expiryDate: newExpiry,
			createdAt: newPurchasedDate,
			status: newStatus
		}, {
			onSuccess: () => {
				toast.success(`Renewed ${c.businessName} (${c.subscriptionType})!`, { description: `New Expiry: ${fmtDate(newExpiry)}` });
			},
			onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to renew")
		});
	};
	const handleToggleSuspend = (c) => {
		const isSuspended = c.status === "suspended";
		const nextStatus = isSuspended ? c.subscriptionType === "trial" ? "trial" : "active" : "suspended";
		updateMut.mutate({
			...c,
			status: nextStatus
		}, {
			onSuccess: () => {
				if (isSuspended) toast.success(`Reactivated subscription for ${c.businessName}!`, { description: "Full access has been restored on POS devices." });
				else toast.warning(`Suspended subscription for ${c.businessName}`, { description: "Account & data preserved, but access is restricted on POS app until reactivated." });
			},
			onError: (err) => toast.error(err instanceof Error ? err.message : "Status update failed")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight md:text-3xl",
				children: "Subscriptions & Plans"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Renew, extend, remind, or suspend customer subscriptions. Suspended accounts preserve data while restricting POS access."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active",
						value: buckets.active.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5" }),
						accent: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Trial",
						value: buckets.trial.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-5 w-5" }),
						accent: "info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Expiring in 14d",
						value: buckets.expiring.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5" }),
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Expired / Suspended",
						value: buckets.expired.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" }),
						accent: "destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Subscription list" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: tab,
						onValueChange: setTab,
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border px-4 pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "bg-transparent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "all",
										children: "All"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "trial",
										children: "Trial"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "expiring",
										children: "Expiring"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "expired",
										children: "Expired / Suspended"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: tab,
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "hover:bg-transparent",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plan" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Purchased On" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Expires" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Actions"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((c) => {
									const days = Math.round((new Date(c.expiryDate).getTime() - now) / day);
									const purchasedDate = c.createdAt || c.expiryDate;
									const isSuspended = c.status === "suspended";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: isSuspended ? "opacity-75 bg-muted/10" : "",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: c.businessName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: c.ownerName
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { plan: c.subscriptionType }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: fmtDate(purchasedDate)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: "Purchased / Started"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: fmtDate(c.expiryDate)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-semibold " + (isSuspended ? "text-amber-500" : days < 0 ? "text-destructive" : days <= 7 ? "text-warning" : "text-muted-foreground"),
												children: isSuspended ? "Suspended" : days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "today" : `in ${days}d`
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap justify-end gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															className: "h-8 text-xs hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400",
															onClick: () => handleRenew(c),
															title: `Renew same plan (${c.subscriptionType})`,
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-3 w-3 text-emerald-500" }), " Renew"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															className: "h-8 text-xs hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400",
															onClick: () => setExtendingCustomer(c),
															title: "Extend subscription by custom days/months",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3 w-3 text-blue-500" }), " Extend"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															className: "h-8 text-xs hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400",
															onClick: () => setRemindingCustomer(c),
															title: "Send expiration reminder notification",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "mr-1 h-3 w-3 text-amber-500" }), " Remind"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: isSuspended ? "default" : "outline",
															className: `h-8 text-xs ${isSuspended ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-destructive/40 text-destructive hover:bg-destructive/10"}`,
															onClick: () => handleToggleSuspend(c),
															title: isSuspended ? "Reactivate customer access" : "Temporarily suspend customer access",
															children: isSuspended ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 h-3 w-3" }), " Reactivate"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-1 h-3 w-3" }), " Suspend"] })
														})
													]
												})
											})
										]
									}, c.id);
								}), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 6,
									className: "py-10 text-center text-sm text-muted-foreground",
									children: "Nothing to show."
								}) })] })] })
							})
						})]
					})
				})]
			}),
			extendingCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtendSubscriptionDialog, {
				customer: extendingCustomer,
				onClose: () => setExtendingCustomer(null),
				onExtend: (newExpiry) => {
					updateMut.mutate({
						...extendingCustomer,
						expiryDate: newExpiry,
						status: extendingCustomer.status === "expired" ? "active" : extendingCustomer.status
					}, {
						onSuccess: () => {
							toast.success(`Extended subscription for ${extendingCustomer.businessName}!`, { description: `New Expiry: ${fmtDate(newExpiry)}` });
							setExtendingCustomer(null);
						},
						onError: (err) => toast.error(err instanceof Error ? err.message : "Extension failed")
					});
				}
			}),
			remindingCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemindSubscriptionDialog, {
				customer: remindingCustomer,
				onClose: () => setRemindingCustomer(null),
				onSend: async (timing, message) => {
					try {
						await notificationsApi.create({
							customer_id: remindingCustomer.id,
							title: `Subscription Reminder (${timing})`,
							message,
							type: "reminder"
						});
						toast.success(`Sent reminder notification to ${remindingCustomer.businessName}!`, { description: `Timing: ${timing}` });
						setRemindingCustomer(null);
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Failed to send reminder");
					}
				}
			})
		]
	});
}
function ExtendSubscriptionDialog({ customer, onClose, onExtend }) {
	const [daysToAdd, setDaysToAdd] = (0, import_react.useState)(30);
	const [customDays, setCustomDays] = (0, import_react.useState)("30");
	const currentExpiryMs = new Date(customer.expiryDate).getTime();
	const calculatedExpiry = new Date((currentExpiryMs > Date.now() ? currentExpiryMs : Date.now()) + daysToAdd * 864e5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: () => onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-primary" }),
						"Extend Subscription — ",
						customer.businessName
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs",
					children: "Choose the number of days or months to extend the current plan."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Current Expiry:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: fmtDate(customer.expiryDate)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-primary font-bold pt-1 border-t border-border/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Calculated Expiry:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(calculatedExpiry.toISOString()) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Quick Extension Presets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									{
										label: "+7 Days",
										days: 7
									},
									{
										label: "+14 Days",
										days: 14
									},
									{
										label: "+30 Days (1 Month)",
										days: 30
									},
									{
										label: "+90 Days (3 Months)",
										days: 90
									},
									{
										label: "+365 Days (1 Year)",
										days: 365
									}
								].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: daysToAdd === p.days ? "default" : "outline",
									className: "text-xs h-9",
									onClick: () => {
										setDaysToAdd(p.days);
										setCustomDays(p.days.toString());
									},
									children: p.label
								}, p.days))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold",
								children: "Or Enter Custom Days"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "1",
								max: "1000",
								value: customDays,
								onChange: (e) => {
									const val = parseInt(e.target.value, 10) || 0;
									setCustomDays(e.target.value);
									if (val > 0) setDaysToAdd(val);
								},
								className: "h-9 text-xs"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-primary text-primary-foreground font-bold",
						onClick: () => onExtend(calculatedExpiry.toISOString()),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), " Confirm Extension"]
					})]
				})
			]
		})
	});
}
function RemindSubscriptionDialog({ customer, onClose, onSend }) {
	const [selectedTiming, setSelectedTiming] = (0, import_react.useState)(REMINDER_TIMINGS[2]);
	const [message, setMessage] = (0, import_react.useState)(`Dear ${customer.ownerName},\n\nYour ${customer.subscriptionType.toUpperCase()} subscription for ${customer.businessName} is scheduled to expire on ${fmtDate(customer.expiryDate)}.\n\nPlease renew your subscription to maintain uninterrupted POS access and features.`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: () => onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5 text-amber-500" }), "Send Subscription Expiry Reminder"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs",
					children: [
						"Broadcast a reminder notification directly to ",
						customer.businessName,
						"'s POS dashboard."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold",
							children: "When Should Reminders Be Sent?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedTiming,
							onValueChange: setSelectedTiming,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "max-h-[250px]",
								children: REMINDER_TIMINGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: t,
									className: "text-xs",
									children: ["🔔 ", t]
								}, t))
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold",
							children: "Reminder Message Text"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 5,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							className: "text-xs font-sans leading-relaxed"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-amber-500 hover:bg-amber-600 text-white font-bold",
						disabled: !message.trim(),
						onClick: () => onSend(selectedTiming, message.trim()),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-3.5 w-3.5" }), " Send Reminder Notice"]
					})]
				})
			]
		})
	});
}
//#endregion
export { SubscriptionsPage as component };
