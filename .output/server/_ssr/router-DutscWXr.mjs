import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DutscWXr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles--9dpc57i.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "bg-gradient-primary bg-clip-text text-7xl font-black text-transparent",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					className: "mt-6 inline-flex items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition-opacity hover:opacity-90",
					children: "Go to Dashboard"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try again or head home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Nexus Admin — SaaS Super Admin Panel" },
			{
				name: "description",
				content: "Manage customers, subscriptions, revenue and reports for your Inventory & Billing SaaS platform from one centralized dashboard."
			},
			{
				property: "og:title",
				content: "Nexus Admin — SaaS Super Admin Panel"
			},
			{
				property: "og:description",
				content: "Multi-tenant super admin dashboard for Inventory & Billing SaaS."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `try{var t=localStorage.getItem('nexus-theme')||'dark';if(t==='light')document.documentElement.classList.remove('dark');else document.documentElement.classList.add('dark');}catch(e){}` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$14 = () => import("./forgot-password-PPqv42th.mjs");
var Route$14 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — Nexus Admin" }, {
		name: "description",
		content: "Reset your Nexus Admin password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./app-Bc5w7XSY.mjs");
var Route$13 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./routes-C5wdYhvd.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Sign in — Nexus Admin" }, {
		name: "description",
		content: "Sign in to the Nexus Admin super admin panel."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./app.index-BbTTMDwd.mjs");
var Route$11 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./app.theme-B4YZYY2v.mjs");
var Route$10 = createFileRoute("/app/theme")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./app.subscriptions-BpMrN_jq.mjs");
var Route$9 = createFileRoute("/app/subscriptions")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./app.settings-amco7BJH.mjs");
var Route$8 = createFileRoute("/app/settings")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./app.screen-builder-BW2fdId9.mjs");
var Route$7 = createFileRoute("/app/screen-builder")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./app.reports-BIdsScSm.mjs");
var Route$6 = createFileRoute("/app/reports")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./app.payments-aM6jISRJ.mjs");
var Route$5 = createFileRoute("/app/payments")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./app.notifications-BhJKLO5r.mjs");
var Route$4 = createFileRoute("/app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./app.customers-CT3vaL4D.mjs");
var Route$3 = createFileRoute("/app/customers")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./app.configuration-BjgAGqRt.mjs");
var Route$2 = createFileRoute("/app/configuration")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./app.audit-logs-pCiZ4YSm.mjs");
var Route$1 = createFileRoute("/app/audit-logs")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./app.advertisements-Bsn6z8Yw.mjs");
var Route = createFileRoute("/app/advertisements")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var ForgotPasswordRoute = Route$14.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$15
});
var AppRoute = Route$13.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$15
});
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var AppIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppThemeRoute = Route$10.update({
	id: "/theme",
	path: "/theme",
	getParentRoute: () => AppRoute
});
var AppSubscriptionsRoute = Route$9.update({
	id: "/subscriptions",
	path: "/subscriptions",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppScreenBuilderRoute = Route$7.update({
	id: "/screen-builder",
	path: "/screen-builder",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$6.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppPaymentsRoute = Route$5.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AppRoute
});
var AppNotificationsRoute = Route$4.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRoute
});
var AppCustomersRoute = Route$3.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AppRoute
});
var AppConfigurationRoute = Route$2.update({
	id: "/configuration",
	path: "/configuration",
	getParentRoute: () => AppRoute
});
var AppAuditLogsRoute = Route$1.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppAdvertisementsRoute: Route.update({
		id: "/advertisements",
		path: "/advertisements",
		getParentRoute: () => AppRoute
	}),
	AppAuditLogsRoute,
	AppConfigurationRoute,
	AppCustomersRoute,
	AppNotificationsRoute,
	AppPaymentsRoute,
	AppReportsRoute,
	AppScreenBuilderRoute,
	AppSettingsRoute,
	AppSubscriptionsRoute,
	AppThemeRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	ForgotPasswordRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
function PendingRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[40vh] w-full items-center justify-center p-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" }), "Loading…"]
		})
	});
}
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultPendingComponent: PendingRoute,
		defaultPendingMs: 0,
		defaultPendingMinMs: 0
	});
};
//#endregion
export { getRouter };
