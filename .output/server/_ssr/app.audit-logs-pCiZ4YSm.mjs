import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { A as ShieldCheck, Ct as Download, Ft as CircleAlert, Mt as CircleX, Nt as CircleCheck, Ot as Copy, P as Search, Qt as ArrowRightLeft, U as Pin, V as Printer, Z as Monitor, at as ListFilter, ft as History, gt as Globe, m as TriangleAlert, n as X, o as User, yt as Eye } from "../_libs/lucide-react.mjs";
import { a as Portal, i as Overlay, n as Content, o as Root, r as Description, s as Title, t as Close } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { o as fmtDate } from "./mock-data-EYXD9Fq3.mjs";
import { i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.audit-logs-pCiZ4YSm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Root;
var SheetPortal = Portal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = Title.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = Description.displayName;
var statusBadgeStyle = {
	SUCCESS: {
		style: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
		icon: CircleCheck
	},
	FAILED: {
		style: "bg-destructive/15 text-destructive border-destructive/30",
		icon: CircleX
	},
	WARNING: {
		style: "bg-amber-500/15 text-amber-500 border-amber-500/30",
		icon: CircleAlert
	}
};
function AuditLogsPage() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [moduleFilter, setModuleFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("table");
	const [selectedLog, setSelectedLog] = (0, import_react.useState)(null);
	const [isDrawerOpen, setIsDrawerOpen] = (0, import_react.useState)(false);
	const fetchLogs = async () => {
		setLoading(true);
		try {
			const queryParams = new URLSearchParams();
			if (search) queryParams.set("search", search);
			if (moduleFilter !== "all") queryParams.set("module", moduleFilter);
			if (statusFilter !== "all") queryParams.set("status", statusFilter);
			const res = await fetch(`/api/audit_logs?${queryParams.toString()}`);
			if (res.ok) setLogs(await res.json());
			else setLogs(getDefaultSampleLogs());
		} catch {
			setLogs(getDefaultSampleLogs());
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchLogs();
	}, [
		search,
		moduleFilter,
		statusFilter
	]);
	const handleTogglePin = async (log) => {
		try {
			await fetch(`/api/audit_logs/${log.id}/pin`, { method: "POST" });
			setLogs((prev) => prev.map((l) => l.id === log.id ? {
				...l,
				is_pinned: !l.is_pinned
			} : l));
			if (selectedLog && selectedLog.id === log.id) setSelectedLog({
				...selectedLog,
				is_pinned: !selectedLog.is_pinned
			});
			toast.success(log.is_pinned ? "Unpinned audit log" : "Pinned audit log to top!");
		} catch {
			toast.error("Failed to update pin status.");
		}
	};
	const handleToggleSuspicious = async (log) => {
		try {
			await fetch(`/api/audit_logs/${log.id}/suspicious`, { method: "POST" });
			setLogs((prev) => prev.map((l) => l.id === log.id ? {
				...l,
				is_suspicious: !l.is_suspicious
			} : l));
			if (selectedLog && selectedLog.id === log.id) setSelectedLog({
				...selectedLog,
				is_suspicious: !selectedLog.is_suspicious
			});
			toast.success(log.is_suspicious ? "Unmarked suspicious event" : "Marked event as Suspicious Security Risk!");
		} catch {
			toast.error("Failed to update security flag.");
		}
	};
	const handleExportCSV = () => {
		const headers = "Log ID,Timestamp,User,Email,Role,Organization,Module,Action,Status,IP,Device,Details\n";
		const rows = logs.map((l) => `"${l.id}","${l.timestamp || l.created_at}","${l.user_name}","${l.user_email}","${l.user_role}","${l.organization}","${l.module_name}","${l.action}","${l.status}","${l.ip_address}","${l.device_info}","${l.details.replace(/"/g, "\"\"")}"`).join("\n");
		const blob = new Blob([headers + rows], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `Enterprise_Audit_Logs_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		toast.success("Exported audit logs as CSV!");
	};
	const handleExportPDF = () => {
		window.print();
		toast.success("Opened print dialog for audit logs!");
	};
	const handleCopyLogJSON = (log) => {
		navigator.clipboard.writeText(JSON.stringify(log, null, 2));
		toast.success("Copied full Audit Log JSON to clipboard!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-7 w-7 text-primary animate-pulse" }), "Enterprise Audit Logs"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Immutable, append-only security log trail capturing every platform event, authentication, payment, and system change."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleExportCSV,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), " Export CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleExportPDF,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1.5 h-4 w-4" }), " Print / PDF"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-emerald-500/30 bg-emerald-500/5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-xl bg-emerald-500/10 text-emerald-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm text-emerald-600 dark:text-emerald-400",
							children: "Cryptographically Immutable Audit Trail Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "All logs are append-only. No user (including Super Admin) can modify or delete audit entries."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-emerald-500 text-emerald-500 font-bold text-xs",
						children: "APPEND-ONLY"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-[240px] flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Search user, action, IP, organization...",
										value: search,
										onChange: (e) => setSearch(e.target.value),
										className: "pl-8 h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: moduleFilter,
									onValueChange: setModuleFilter,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[170px] h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Module" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Modules"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Authentication",
											children: "Authentication"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Customer Management",
											children: "Customer Management"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Payments & Billing",
											children: "Payments & Billing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Advertisements",
											children: "Advertisements"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Festival Themes",
											children: "Festival Themes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Security Events",
											children: "Security Events"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Products & Inventory",
											children: "Products & Inventory"
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: statusFilter,
									onValueChange: setStatusFilter,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[130px] h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SUCCESS",
											children: "SUCCESS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "WARNING",
											children: "WARNING"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "FAILED",
											children: "FAILED"
										})
									] })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: viewMode === "table" ? "default" : "outline",
								size: "sm",
								className: "h-9 text-xs",
								onClick: () => setViewMode("table"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, { className: "mr-1.5 h-3.5 w-3.5" }), " Table View"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: viewMode === "timeline" ? "default" : "outline",
								size: "sm",
								className: "h-9 text-xs",
								onClick: () => setViewMode("timeline"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "mr-1.5 h-3.5 w-3.5" }), " Timeline View"]
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: viewMode === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "hover:bg-transparent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-[80px]",
									children: "Log ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "User / Organization" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Module & Action" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Description" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "IP & Device" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Timestamp" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Inspect"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [logs.map((log) => {
							const statusInfo = statusBadgeStyle[log.status] || statusBadgeStyle.SUCCESS;
							const StatusIcon = statusInfo.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: cn("cursor-pointer hover:bg-muted/40 transition-colors", log.is_pinned && "bg-primary/5 border-l-4 border-l-primary", log.is_suspicious && "bg-destructive/10 border-l-4 border-l-destructive"),
								onClick: () => {
									setSelectedLog(log);
									setIsDrawerOpen(true);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-mono text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												log.is_pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3 text-primary fill-primary" }),
												log.is_suspicious && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 text-destructive animate-pulse" }),
												"#",
												log.id
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-xs",
										children: log.user_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: log.organization
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-xs text-primary",
										children: log.module_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] font-mono mt-0.5",
										children: log.action
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "max-w-[280px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs truncate",
											title: log.details,
											children: log.details
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-xs",
										children: log.ip_address
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: log.device_info
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: cn("text-[10px] flex items-center gap-1 w-fit", statusInfo.style),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: "h-3 w-3" }), log.status]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-xs text-muted-foreground whitespace-nowrap",
										children: fmtDate(log.timestamp || log.created_at || "")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-7 w-7 p-0",
											onClick: (e) => {
												e.stopPropagation();
												setSelectedLog(log);
												setIsDrawerOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-muted-foreground hover:text-primary" })
										})
									})
								]
							}, log.id);
						}), logs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 8,
							className: "py-12 text-center text-sm text-muted-foreground",
							children: "No audit logs match your search criteria."
						}) })] })] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 space-y-6 relative before:absolute before:left-8 before:top-6 before:bottom-6 before:w-0.5 before:bg-border",
						children: logs.map((log) => {
							(statusBadgeStyle[log.status] || statusBadgeStyle.SUCCESS).icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative pl-10 cursor-pointer group",
								onClick: () => {
									setSelectedLog(log);
									setIsDrawerOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-6 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background bg-primary shadow-sm group-hover:scale-125 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] font-bold",
													children: log.module_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs font-bold text-foreground",
													children: log.action
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground font-mono",
												children: fmtDate(log.timestamp || log.created_at || "")
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: log.details
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-foreground",
												children: [
													"Actor: ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: log.user_name }),
													" (",
													log.organization,
													")"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-muted-foreground",
												children: ["IP: ", log.ip_address]
											})]
										})
									]
								})]
							}, log.id);
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: isDrawerOpen,
				onOpenChange: setIsDrawerOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "w-full sm:max-w-xl overflow-y-auto space-y-6",
					children: selectedLog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "pb-4 border-b border-border/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "font-mono text-xs",
									children: ["LOG ID #", selectedLog.id]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: selectedLog.is_pinned ? "default" : "outline",
										className: "h-8 text-xs",
										onClick: () => handleTogglePin(selectedLog),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "mr-1 h-3.5 w-3.5" }), selectedLog.is_pinned ? "Pinned" : "Pin"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: selectedLog.is_suspicious ? "destructive" : "outline",
										className: "h-8 text-xs",
										onClick: () => handleToggleSuspicious(selectedLog),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1 h-3.5 w-3.5" }), selectedLog.is_suspicious ? "Suspicious" : "Mark Suspicious"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "text-lg font-bold flex items-center gap-2 pt-2",
								children: selectedLog.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
								className: "text-xs",
								children: ["Logged on ", fmtDate(selectedLog.timestamp || selectedLog.created_at || "")]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-muted/40 border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground text-sm",
									children: "Event Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: selectedLog.details
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg border border-border bg-card space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-muted-foreground text-[11px] flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary" }), " Actor Info"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-foreground",
											children: selectedLog.user_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: selectedLog.user_email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-primary font-semibold",
											children: ["Role: ", selectedLog.user_role]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-lg border border-border bg-card space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-muted-foreground text-[11px] flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5 text-primary" }), " Organization & Network"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-foreground",
											children: selectedLog.organization
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono text-[11px]",
											children: ["IP: ", selectedLog.ip_address]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground",
											children: ["Location: ", selectedLog.geo_location]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg border border-border bg-card space-y-2 font-mono text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold text-foreground text-xs flex items-center gap-1 font-sans",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3.5 w-3.5 text-primary" }), " Technical Request Diagnostics"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "HTTP Method & URL:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-primary",
											children: [
												selectedLog.http_method,
												" ",
												selectedLog.request_url
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Device & OS:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											selectedLog.device_info,
											" (",
											selectedLog.operating_system,
											")"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Browser:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedLog.browser })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Execution Latency:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-500 font-bold",
											children: [selectedLog.execution_time, " ms"]
										})]
									})
								]
							}),
							(selectedLog.before_value || selectedLog.after_value) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-4 w-4 text-amber-500" }), "State Change (Before vs After Diff)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-3",
									children: [selectedLog.before_value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px] font-bold text-destructive",
											children: "Before State"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "p-3 rounded-lg bg-destructive/10 border border-destructive/30 font-mono text-[10px] text-destructive overflow-x-auto",
											children: formatJsonString(selectedLog.before_value)
										})]
									}), selectedLog.after_value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px] font-bold text-emerald-500",
											children: "After State"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-500 overflow-x-auto",
											children: formatJsonString(selectedLog.after_value)
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2 pt-4 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1 text-xs",
									onClick: () => handleCopyLogJSON(selectedLog),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-3.5 w-3.5" }), " Copy JSON"]
								})
							})
						]
					})] })
				})
			})
		]
	});
}
function formatJsonString(val) {
	try {
		return JSON.stringify(JSON.parse(val), null, 2);
	} catch {
		return val;
	}
}
function getDefaultSampleLogs() {
	return [
		{
			id: 1001,
			action: "USER_LOGIN_SUCCESS",
			entity_type: "UserSession",
			entity_id: "sess_881",
			user_id: "1",
			user_email: "admin@nexus.io",
			user_name: "Super Admin",
			user_role: "Super Admin",
			organization: "Nexus SaaS Global",
			module_name: "Authentication",
			action_type: "AUTHENTICATION",
			details: "Super Admin authenticated successfully via Multi-Factor Authentication.",
			before_value: null,
			after_value: "{\"mfa_verified\": true, \"session_active\": true}",
			status: "SUCCESS",
			ip_address: "157.48.12.90",
			device_info: "MacBook Pro M3 Max",
			browser: "Chrome 126.0",
			operating_system: "macOS Sonoma",
			request_url: "/api/auth/login",
			http_method: "POST",
			session_id: "sess_881",
			geo_location: "Bengaluru, India",
			execution_time: 14.2,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		},
		{
			id: 1002,
			action: "AUTO_SUSPEND_EXPIRED_ACCOUNT",
			entity_type: "Customer",
			entity_id: "cust_3",
			user_id: "SYSTEM",
			user_email: "system@nexus.io",
			user_name: "Automated Expiry Scheduler",
			user_role: "System Daemon",
			organization: "Supermarket Deluxe (ID: cust_3)",
			module_name: "Customer Management",
			action_type: "SUSPEND",
			details: "Subscription expired. Account automatically suspended to freeze POS billing while preserving 100% store inventory data.",
			before_value: "{\"status\": \"active\", \"subscriptionType\": \"Free Trial\"}",
			after_value: "{\"status\": \"suspended\", \"subscriptionType\": \"Expired Trial\"}",
			status: "WARNING",
			ip_address: "10.0.0.1",
			device_info: "AWS ECS Worker",
			browser: "System Service",
			operating_system: "Linux Kernel 6.1",
			request_url: "/api/customers/cust_3/sync",
			http_method: "POST",
			session_id: "sys_cron_99",
			geo_location: "us-east-1",
			execution_time: 28.6,
			timestamp: (/* @__PURE__ */ new Date(Date.now() - 15e5)).toISOString()
		},
		{
			id: 1003,
			action: "CREATE_ADVERTISEMENT",
			entity_type: "Advertisement",
			entity_id: "ad_889",
			user_id: "1",
			user_email: "admin@nexus.io",
			user_name: "Super Admin",
			user_role: "Super Admin",
			organization: "Nexus SaaS Global",
			module_name: "Advertisements",
			action_type: "CREATE",
			details: "Created global banner advertisement for Ugadi Festival offer.",
			before_value: null,
			after_value: "{\"title\": \"Ugadi Super Sale 20%\", \"badge\": \"FESTIVAL OFFER\", \"active\": true}",
			status: "SUCCESS",
			ip_address: "157.48.12.90",
			device_info: "Windows Workstation",
			browser: "Edge 126.0",
			operating_system: "Windows 11",
			request_url: "/api/advertisements",
			http_method: "POST",
			session_id: "sess_102",
			geo_location: "India",
			execution_time: 18.1,
			timestamp: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString()
		}
	];
}
//#endregion
export { AuditLogsPage as component };
