import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as Image, r as Root, t as Fallback } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { $ as Megaphone, Bt as Check, E as SlidersHorizontal, Et as CreditCard, F as ScrollText, Gt as Building2, H as Plus, K as Palette, Lt as ChevronRight, P as Search, Q as Menu, Rt as ChevronLeft, S as Sun, X as Moon, a as Users, ct as LayoutDashboard, i as Wallet, j as Settings, ot as LayoutTemplate, qt as Bell, tt as LogOut, vt as FileChartColumnIncreasing, w as Sparkles } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.mjs";
import { r as signOut, t as getSession } from "./auth-BF7PoV3d.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-Bc5w7XSY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "nexus-theme";
function getInitialTheme() {
	if (typeof window === "undefined") return "dark";
	return window.localStorage.getItem(KEY) ?? "dark";
}
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle("dark", theme === "dark");
	window.localStorage.setItem(KEY, theme);
}
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		const t = getInitialTheme();
		setTheme(t);
		applyTheme(t);
	}, []);
	const toggle = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		applyTheme(next);
	};
	return {
		theme,
		toggle
	};
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Root.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = Image.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = Fallback.displayName;
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var nav = [
	{
		to: "/app",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/app/customers",
		label: "Customers & Tenants",
		icon: Users
	},
	{
		to: "/app/configuration",
		label: "Customer Config",
		icon: SlidersHorizontal
	},
	{
		to: "/app/screen-builder",
		label: "Screen Builder",
		icon: LayoutTemplate
	},
	{
		to: "/app/advertisements",
		label: "Advertisements",
		icon: Megaphone
	},
	{
		to: "/app/theme",
		label: "Festival Themes",
		icon: Palette
	},
	{
		to: "/app/subscriptions",
		label: "Subscriptions & Plans",
		icon: CreditCard
	},
	{
		to: "/app/payments",
		label: "Payment Ledger",
		icon: Wallet
	},
	{
		to: "/app/reports",
		label: "Reports & Analytics",
		icon: FileChartColumnIncreasing
	},
	{
		to: "/app/notifications",
		label: "Notifications & Alerts",
		icon: Bell
	},
	{
		to: "/app/audit-logs",
		label: "Audit Logs",
		icon: ScrollText
	},
	{
		to: "/app/settings",
		label: "System Settings",
		icon: Settings
	}
];
var mockStores = [
	{
		id: "all",
		name: "All Organizations (SaaS Global)",
		plan: "Super Admin"
	},
	{
		id: "CUS-1001",
		name: "Apex Bakery & Retail",
		plan: "Yearly Pro"
	},
	{
		id: "CUS-1002",
		name: "Star Supermarket",
		plan: "Monthly Standard"
	},
	{
		id: "CUS-1003",
		name: "Metro Digital Hub",
		plan: "Trial"
	}
];
function AppShell({ children }) {
	const { theme, toggle } = useTheme();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [collapsed, setCollapsed] = (0, import_react.useState)(() => {
		return localStorage.getItem("saas_sidebar_collapsed") === "true";
	});
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedOrg, setSelectedOrg] = (0, import_react.useState)("all");
	const [session, setSession] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const s = getSession();
		if (!s) {
			navigate({
				to: "/",
				replace: true
			});
			return;
		}
		setSession(s);
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [pathname]);
	const toggleCollapse = () => {
		setCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem("saas_sidebar_collapsed", String(next));
			return next;
		});
	};
	const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
	const handleSignOut = () => {
		signOut();
		navigate({
			to: "/",
			replace: true
		});
	};
	const displaySession = session ?? {
		email: "admin@nexus.io",
		name: "Super Admin",
		role: "super_admin",
		loginAt: ""
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen w-full bg-background text-foreground overflow-x-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out", "lg:static lg:translate-x-0", collapsed ? "w-20" : "w-64", mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-16 items-center justify-between border-b border-sidebar-border px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary-foreground" })
								}), (!collapsed || mobileOpen) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-bold tracking-tight text-sidebar-foreground",
										children: "Nexus Admin"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[11px] text-muted-foreground",
										children: "Super Admin Suite"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: toggleCollapse,
								className: "hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground",
								"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
								children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 space-y-1.5 overflow-y-auto p-3 custom-scrollbar",
							children: nav.map((item) => {
								const active = isActive(item.to, "exact" in item ? item.exact : false);
								const linkContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 min-h-[44px]", active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-5 w-5 shrink-0" }), (!collapsed || mobileOpen) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									})]
								}, item.to);
								if (collapsed && !mobileOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
									asChild: true,
									children: linkContent
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
									side: "right",
									className: "font-medium",
									children: item.label
								})] }, item.to);
								return linkContent;
							})
						}),
						!collapsed || mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-success animate-pulse" }), "System healthy"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] px-1.5 py-0.5",
										children: "99.98%"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 text-[11px] text-muted-foreground",
									children: "All cloud microservices active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[94%] rounded-full bg-gradient-primary" })
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-success ring-4 ring-success/20 animate-pulse" })
						})
					]
				}),
				mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Close drawer navigation",
					onClick: () => setMobileOpen(false),
					className: "fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden h-10 w-10 text-foreground",
								onClick: () => setMobileOpen((v) => !v),
								"aria-label": "Toggle Navigation Drawer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-9 gap-2 border-border text-xs font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "max-w-[140px] truncate md:max-w-[200px]",
											children: mockStores.find((s) => s.id === selectedOrg)?.name
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "start",
									className: "w-64",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
											className: "text-xs text-muted-foreground",
											children: "Filter Scope by Organization"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										mockStores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => setSelectedOrg(s.id),
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold truncate",
													children: s.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: s.plan
												})]
											}), selectedOrg === s.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary shrink-0" })]
										}, s.id))
									]
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative hidden md:block max-w-sm flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search customers, invoices, subscriptions... (⌘K)",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "pl-9 h-9 text-xs bg-card"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 md:hidden" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "hidden sm:flex gap-1.5 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick Action" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Platform Actions" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/app/customers" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 h-4 w-4" }), " Add New Customer"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/app/notifications" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mr-2 h-4 w-4" }), " Send Announcement"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/app/subscriptions" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 h-4 w-4 text-primary" }), " Create Plan"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/app/audit-logs" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "mr-2 h-4 w-4 text-info" }), " Export System Logs"]
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: toggle,
								"aria-label": "Toggle dark/light theme",
								className: "h-10 w-10 text-foreground",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-5 w-5 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-5 w-5 text-slate-700" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									className: "relative h-10 w-10 text-foreground",
									"aria-label": "View notifications",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background animate-pulse" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-80 p-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b border-border p-3 font-semibold text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notifications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px]",
											children: "3 New"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "max-h-64 overflow-y-auto divide-y divide-border text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 hover:bg-muted/50 cursor-pointer",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-foreground",
														children: "New Customer Registration"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground mt-0.5",
														children: "Apex Bakery signed up for Yearly Pro plan."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground mt-1",
														children: "2 mins ago"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 hover:bg-muted/50 cursor-pointer",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-foreground",
														children: "Subscription Renewal Alert"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground mt-0.5",
														children: "Star Supermarket renewed subscription successfully."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground mt-1",
														children: "15 mins ago"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 hover:bg-muted/50 cursor-pointer",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-foreground",
														children: "Cloud Sync Completed"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground mt-0.5",
														children: "All 14 customer databases synced with PostgreSQL cluster."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground mt-1",
														children: "1 hour ago"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-t border-border p-2 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											className: "w-full text-xs text-primary",
											onClick: () => navigate({ to: "/app/notifications" }),
											children: "View Notification Center"
										})
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-2 rounded-full pr-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "h-9 w-9 border border-border shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-gradient-primary text-primary-foreground font-bold",
											children: "SA"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden text-left md:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold leading-tight",
											children: displaySession.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: displaySession.email
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold",
											children: displaySession.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-normal text-muted-foreground",
											children: displaySession.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "mt-1 text-[10px] uppercase font-semibold text-primary",
											children: displaySession.role
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/app/settings" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }), " System Settings"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/app/audit-logs" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "mr-2 h-4 w-4" }), " Audit Activity"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: handleSignOut,
										className: "text-destructive focus:text-destructive",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Sign Out"]
									})
								]
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1 p-3 sm:p-4 md:p-6",
						children
					})]
				})
			]
		})
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
