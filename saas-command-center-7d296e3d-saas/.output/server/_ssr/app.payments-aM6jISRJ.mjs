import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { At as Clock, Ct as Download, Et as CreditCard, H as Plus, Mt as CircleX, P as Search, Pt as CircleCheckBig, V as Printer, _t as FileText, i as Wallet } from "../_libs/lucide-react.mjs";
import { a as fmtCurrency, o as fmtDate } from "./mock-data-EYXD9Fq3.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { l as usePayments, n as useCustomers } from "./api-hooks-UCeWdNOc.mjs";
import { t as PlanBadge } from "./status-badge-BNf7mQec.mjs";
import { t as StatCard } from "./stat-card-qgEus3lo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.payments-aM6jISRJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusStyle = {
	paid: "bg-success/15 text-success border-success/30",
	pending: "bg-warning/15 text-warning border-warning/30",
	failed: "bg-destructive/15 text-destructive border-destructive/30"
};
function PaymentsPage() {
	const [tab, setTab] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [methodFilter, setMethodFilter] = (0, import_react.useState)("all");
	const [isRecordModalOpen, setIsRecordModalOpen] = (0, import_react.useState)(false);
	const { data: payments } = usePayments();
	const { data: customers } = useCustomers();
	const [selectedCustomerId, setSelectedCustomerId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("Bank Transfer");
	const [notes, setNotes] = (0, import_react.useState)("");
	const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
	const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
	const failed = payments.filter((p) => p.status === "failed").length;
	const filteredPayments = payments.filter((p) => {
		const matchesTab = tab === "all" || p.status === tab;
		const matchesMethod = methodFilter === "all" || p.method.toLowerCase().includes(methodFilter.toLowerCase());
		const bName = p.businessName || p.customer || "";
		const invId = p.invoiceId || p.id || "";
		const matchesSearch = bName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || invId.toLowerCase().includes(search.toLowerCase());
		return matchesTab && matchesMethod && matchesSearch;
	});
	const handleExportCSV = () => {
		const headers = "Transaction ID,Invoice ID,Customer,Amount,Plan,Method,Date,Status\n";
		const rows = filteredPayments.map((p) => `"${p.id}","${p.invoiceId || p.id}","${p.businessName || p.customer}",${p.amount},"${p.subscriptionType || p.plan}","${p.method}","${p.date}","${p.status}"`).join("\n");
		const blob = new Blob([headers + rows], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "SaaS_Payment_Ledger.csv";
		a.click();
		toast.success("Payment Ledger exported as CSV!");
	};
	const handleExportPDF = () => {
		window.print();
		toast.success("PDF Print dialog opened!");
	};
	const handleRecordPayment = () => {
		if (!selectedCustomerId || !amount || parseFloat(amount) <= 0) {
			toast.error("Please select a customer and enter a valid payment amount!");
			return;
		}
		const cust = customers.find((c) => c.id === selectedCustomerId);
		toast.success(`Recorded manual payment of ${fmtCurrency(parseFloat(amount))} for ${cust?.businessName || "Customer"}!`, { description: `Method: ${method} | Note: ${notes || "Subscription Payment"}` });
		setIsRecordModalOpen(false);
		setSelectedCustomerId("");
		setAmount("");
		setNotes("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight md:text-3xl",
					children: "Payment Ledger & Revenue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Complete transaction history, bank wire collections, manual receipts and subscription payments."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportCSV,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), " Export CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportPDF,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1.5 h-4 w-4" }), " Print PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
							onClick: () => setIsRecordModalOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Record Payment"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Collected",
						value: fmtCurrency(totalPaid),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" }),
						accent: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Collections",
						value: fmtCurrency(pending),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" }),
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Failed Payments",
						value: failed,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" }),
						accent: "destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Transactions Ledger" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search customer, invoice ID...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "pl-8 h-9 text-xs"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: methodFilter,
								onValueChange: setMethodFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[140px] h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Payment Method" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Methods"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "card",
										children: "Credit Card"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "upi",
										children: "UPI / GPay"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "bank",
										children: "Bank Transfer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cash",
										children: "Cash"
									})
								] })]
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: tab,
						onValueChange: setTab,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border px-4 pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "bg-transparent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "all",
										children: [
											"All (",
											payments.length,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "paid",
										children: "Paid"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "failed",
										children: "Failed"
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
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice ID" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer / Tenant" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plan" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Amount" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Actions"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredPayments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-mono text-xs font-semibold",
										children: p.invoiceId || p.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.businessName || p.customer
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: ["ID: ", p.id]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { plan: p.subscriptionType || p.plan }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5 text-muted-foreground" }), p.method]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-xs text-muted-foreground",
										children: fmtDate(p.date)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-bold text-sm",
										children: fmtCurrency(p.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: cn("capitalize text-[11px]", statusStyle[p.status]),
										children: p.status
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-8 text-xs",
											onClick: () => toast.info(`Receipt for ${p.invoiceId || p.id}`, { description: `${p.businessName || p.customer} paid ${fmtCurrency(p.amount)} via ${p.method} on ${fmtDate(p.date)}` }),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-1 h-3.5 w-3.5" }), " View Receipt"]
										})
									})
								] }, p.id)), filteredPayments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 8,
									className: "py-10 text-center text-sm text-muted-foreground",
									children: "No transaction records matching your filters."
								}) })] })] })
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isRecordModalOpen,
				onOpenChange: setIsRecordModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-5 w-5 text-emerald-500" }), "Record Manual Payment / Collection"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Log bank wire transfers, offline cash, or cheque payments for subscription renewals."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Select Customer / Tenant"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedCustomerId,
										onValueChange: setSelectedCustomerId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Customer" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "max-h-[250px]",
											children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: c.id,
												className: "text-xs",
												children: [
													"🏪 ",
													c.businessName,
													" (",
													c.ownerName,
													")"
												]
											}, c.id))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Amount (₹)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "e.g. 2999",
											value: amount,
											onChange: (e) => setAmount(e.target.value),
											className: "h-9 text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Payment Method"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: method,
											onValueChange: setMethod,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Bank Transfer",
													children: "Bank Wire Transfer"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "UPI / GPay",
													children: "UPI / GPay / PhonePe"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Cash Collection",
													children: "Cash Collection"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Cheque",
													children: "Bank Cheque"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Credit Card",
													children: "Credit Card"
												})
											] })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Notes / Transaction Reference"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Bank Ref UTR#9821839219",
										value: notes,
										onChange: (e) => setNotes(e.target.value),
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
								onClick: () => setIsRecordModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold",
								onClick: handleRecordPayment,
								children: "Record Transaction"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PaymentsPage as component };
