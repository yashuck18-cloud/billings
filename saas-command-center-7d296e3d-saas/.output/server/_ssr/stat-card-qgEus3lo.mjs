import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-card-qgEus3lo.js
var import_jsx_runtime = require_jsx_runtime();
var accentMap = {
	primary: "from-primary/25 to-primary/0 text-primary",
	success: "from-success/25 to-success/0 text-success",
	warning: "from-warning/25 to-warning/0 text-warning",
	info: "from-info/25 to-info/0 text-info",
	destructive: "from-destructive/25 to-destructive/0 text-destructive"
};
function StatCard({ label, value, icon, trend, accent = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-70 blur-2xl", accentMap[accent]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "relative p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-2xl font-bold tracking-tight md:text-3xl",
							children: value
						}),
						trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("mt-1.5 text-xs font-medium", trend.positive ? "text-success" : "text-destructive"),
							children: [
								trend.positive ? "▲" : "▼",
								" ",
								trend.value
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary", accentMap[accent].split(" ").pop()),
					children: icon
				})]
			})
		})]
	});
}
//#endregion
export { StatCard as t };
