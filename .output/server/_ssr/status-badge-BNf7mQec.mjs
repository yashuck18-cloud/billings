import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BNf7mQec.js
var import_jsx_runtime = require_jsx_runtime();
var statusMap = {
	active: "bg-success/15 text-success border-success/30",
	trial: "bg-info/15 text-info border-info/30",
	expired: "bg-destructive/15 text-destructive border-destructive/30",
	suspended: "bg-warning/15 text-warning border-warning/30"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: cn("capitalize font-medium", statusMap[status]),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" }), status]
	});
}
var planMap = {
	yearly: "bg-primary/15 text-primary border-primary/30",
	monthly: "bg-accent/15 text-accent border-accent/30",
	trial: "bg-muted text-muted-foreground border-border"
};
function PlanBadge({ plan }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: cn("capitalize font-medium", planMap[plan]),
		children: plan
	});
}
//#endregion
export { StatusBadge as n, PlanBadge as t };
