import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { A as ShieldCheck, H as Plus, P as Search, St as Ellipsis, W as Pencil, _ as ToggleLeft, bt as EyeOff, g as Trash2, k as ShieldOff, lt as KeyRound, n as X, nt as LogIn, yt as Eye } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.mjs";
import { i as defaultFeaturesFor, o as fmtDate } from "./mock-data-EYXD9Fq3.mjs";
import { r as authApi } from "./api-D5gYHQcL.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { d as useUpdateCustomer, n as useCustomers, o as useDeleteCustomer, t as useCreateCustomer } from "./api-hooks-UCeWdNOc.mjs";
import { n as StatusBadge, t as PlanBadge } from "./status-badge-BNf7mQec.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.customers-CT3vaL4D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const { data: rows } = useCustomers();
	const createMut = useCreateCustomer();
	const updateMut = useUpdateCustomer();
	const deleteMut = useDeleteCustomer();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [plan, setPlan] = (0, import_react.useState)("all");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [editingCustomer, setEditingCustomer] = (0, import_react.useState)(null);
	const [featuresFor, setFeaturesFor] = (0, import_react.useState)(null);
	const [passwordResetCustomer, setPasswordResetCustomer] = (0, import_react.useState)(null);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		return rows.filter((c) => {
			const matches = !q || c.businessName.toLowerCase().includes(q.toLowerCase()) || c.ownerName.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()) || c.mobile.includes(q);
			const okStatus = status === "all" || c.status === status;
			const okPlan = plan === "all" || c.subscriptionType === plan;
			return matches && okStatus && okPlan;
		});
	}, [
		rows,
		q,
		status,
		plan
	]);
	const update = (id, patch) => {
		const existing = rows.find((c) => c.id === id);
		if (!existing) return;
		updateMut.mutate({
			...existing,
			patch
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-2xl font-bold tracking-tight md:text-3xl",
						children: "Customers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Manage all tenants on your platform."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: addOpen,
					onOpenChange: setAddOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "shrink-0 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add Customer"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCustomerDialog, { onCreate: (c) => {
						createMut.mutate(c, {
							onSuccess: () => {
								setAddOpen(false);
								toast.success("Customer created");
							},
							onError: (e) => toast.error(e instanceof Error ? e.message : "Create failed")
						});
					} })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search by business, owner, email or mobile...",
									value: q,
									onChange: (e) => setQ(e.target.value),
									className: "pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: status,
								onValueChange: (v) => setStatus(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "trial",
										children: "Trial"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "expired",
										children: "Expired"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "suspended",
										children: "Suspended"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: plan,
								onValueChange: (v) => setPlan(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Plan" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All plans"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "yearly",
										children: "Yearly"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "monthly",
										children: "Monthly"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "trial",
										children: "Trial"
									})
								] })]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "hover:bg-transparent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Business" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "hidden md:table-cell",
									children: "Owner"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "hidden lg:table-cell",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plan" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "hidden md:table-cell",
									children: "Expires"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-10" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: c.businessName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: c.id
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "hidden md:table-cell",
								children: c.ownerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "hidden lg:table-cell",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: c.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: c.mobile
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { plan: c.subscriptionType }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "hidden md:table-cell whitespace-nowrap text-sm",
								children: fmtDate(c.expiryDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-48",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setViewing(c),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setEditingCustomer(c),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setPasswordResetCustomer(c),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-2 h-4 w-4" }), " Set password"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											const promise = authApi.impersonate(c.id).then((res) => {
												localStorage.setItem("flutter.pos_user", JSON.stringify({
													id: String(res.user.id),
													email: res.user.email,
													businessName: res.user.name,
													token: res.access_token
												}));
												localStorage.removeItem("flutter.pos_categories");
												localStorage.removeItem("flutter.pos_products");
												localStorage.removeItem("flutter.pos_stock_history");
												localStorage.removeItem("flutter.pos_invoices");
												localStorage.removeItem("flutter.pos_customer_config");
												localStorage.removeItem("flutter.pos_screen_layouts");
												localStorage.removeItem(`flutter.pos_categories_user_${c.id}`);
												localStorage.removeItem(`flutter.pos_products_user_${c.id}`);
												localStorage.removeItem(`flutter.pos_stock_history_user_${c.id}`);
												localStorage.removeItem(`flutter.pos_invoices_user_${c.id}`);
												localStorage.removeItem(`flutter.pos_customer_config_user_${c.id}`);
												localStorage.removeItem(`flutter.pos_screen_layouts_user_${c.id}`);
												window.open("/pos/index.html", "_blank");
												return res.user.name;
											});
											toast.promise(promise, {
												loading: "Generating customer session...",
												success: (name) => `Logged in as ${name} (Support Mode)`,
												error: (err) => `Impersonation failed: ${err instanceof Error ? err.message : String(err)}`
											});
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-2 h-4 w-4" }), " Login as customer"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setFeaturesFor(c),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "mr-2 h-4 w-4" }), " Manage features"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									c.status !== "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											update(c.id, { status: "suspended" });
											toast.warning("Customer suspended");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-2 h-4 w-4" }), " Suspend"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											update(c.id, { status: "active" });
											toast.success("Customer activated");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 h-4 w-4" }), " Activate"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											deleteMut.mutate(c.id, {
												onSuccess: () => toast.success("Customer deleted"),
												onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed")
											});
										},
										className: "text-destructive focus:text-destructive",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete"]
									})
								]
							})] }) })
						] }, c.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 7,
							className: "py-10 text-center text-sm text-muted-foreground",
							children: "No customers match your filters."
						}) })] })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"Showing ",
							filtered.length,
							" of ",
							rows.length,
							" customers"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								disabled: true,
								children: "Previous"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								disabled: true,
								children: "Next"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewing,
				onOpenChange: (o) => !o && setViewing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-lg",
					children: viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: viewing.businessName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Customer ID: ", viewing.id] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Owner",
									value: viewing.ownerName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Status",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: viewing.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Email",
									value: viewing.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Mobile",
									value: viewing.mobile
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Plan",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { plan: viewing.subscriptionType })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Expires",
									value: fmtDate(viewing.expiryDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Address",
									value: viewing.address,
									className: "col-span-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Bills generated",
									value: viewing.bills.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Products",
									value: viewing.products.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Created",
									value: fmtDate(viewing.createdAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Last login",
									value: fmtDate(viewing.lastLogin)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Enabled features"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-1.5",
										children: [viewing.features.filter((f) => f.enabled).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "font-normal",
											children: f.name
										}, f.key)), viewing.features.filter((f) => f.enabled).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "None enabled"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								setFeaturesFor(viewing);
								setViewing(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "mr-2 h-4 w-4" }), " Manage features"]
						}) })
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturesDialog, {
				customer: featuresFor,
				onOpenChange: (o) => !o && setFeaturesFor(null),
				onSave: (features) => {
					if (!featuresFor) return;
					update(featuresFor.id, { features });
					toast.success(`Features updated for ${featuresFor.businessName}`);
					setFeaturesFor(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!passwordResetCustomer,
				onOpenChange: (o) => !o && setPasswordResetCustomer(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Set Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Set a login password for ",
							passwordResetCustomer?.businessName,
							"."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "New Password",
								type: "password",
								value: newPassword,
								onChange: (v) => setNewPassword(v)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setPasswordResetCustomer(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!passwordResetCustomer) return;
								if (newPassword.length < 6) {
									toast.error("Password must be at least 6 characters");
									return;
								}
								update(passwordResetCustomer.id, { password: newPassword });
								toast.success("Password updated successfully");
								setPasswordResetCustomer(null);
								setNewPassword("");
							},
							className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
							children: "Save Password"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditCustomerDialog, {
				customer: editingCustomer,
				onOpenChange: (o) => !o && setEditingCustomer(null),
				onSave: (id, patch) => {
					update(id, patch);
					toast.success("Customer profile updated successfully");
				}
			})
		]
	});
}
function EditCustomerDialog({ customer, onOpenChange, onSave }) {
	const [form, setForm] = (0, import_react.useState)({
		businessName: "",
		ownerName: "",
		email: "",
		mobile: "",
		subscriptionType: "trial",
		password: ""
	});
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (customer) setForm({
			businessName: customer.businessName || "",
			ownerName: customer.ownerName || "",
			email: customer.email || "",
			mobile: customer.mobile || "",
			subscriptionType: customer.subscriptionType || "trial",
			password: ""
		});
	}, [customer]);
	if (!customer) return null;
	const handleSave = () => {
		if (!form.businessName.trim() || !form.email.trim()) {
			toast.error("Store Name and Email Address are required");
			return;
		}
		const days = form.subscriptionType === "yearly" ? 365 : form.subscriptionType === "monthly" ? 30 : 14;
		const patch = {
			businessName: form.businessName.trim(),
			ownerName: form.ownerName.trim(),
			email: form.email.trim().toLowerCase(),
			mobile: form.mobile.trim(),
			subscriptionType: form.subscriptionType,
			expiryDate: new Date(Date.now() + days * 864e5).toISOString()
		};
		if (form.password.trim()) patch.password = form.password.trim();
		onSave(customer.id, patch);
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!customer,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Customer & Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Update store name, owner name, email, subscription plan, or set a new password for",
					" ",
					customer.businessName,
					"."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Store Name (Business Name)",
							value: form.businessName,
							onChange: (v) => setForm({
								...form,
								businessName: v
							}),
							placeholder: "e.g. Apex Bakery Store"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Owner Name",
							value: form.ownerName,
							onChange: (v) => setForm({
								...form,
								ownerName: v
							}),
							placeholder: "e.g. John Doe"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email Address",
							type: "email",
							value: form.email,
							onChange: (v) => setForm({
								...form,
								email: v
							}),
							placeholder: "e.g. store@example.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mobile Number",
							value: form.mobile,
							onChange: (v) => setForm({
								...form,
								mobile: v
							}),
							placeholder: "e.g. +1 555-0199"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Subscription Plan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.subscriptionType,
								onValueChange: (v) => setForm({
									...form,
									subscriptionType: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Subscription Type" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "trial",
										children: "Free Trial (7 days)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "monthly",
										children: "Monthly Plan (30 days)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "yearly",
										children: "Yearly Plan (365 days)"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 md:col-span-2 rounded-lg border border-border/80 bg-muted/20 p-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs font-semibold flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Features Unlocked (",
									defaultFeaturesFor(form.subscriptionType).filter((f) => f.enabled).length,
									" Enabled)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] uppercase",
									children: form.subscriptionType
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1 pt-1 max-h-[100px] overflow-y-auto",
								children: defaultFeaturesFor(form.subscriptionType).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: f.enabled ? "default" : "outline",
									className: `text-[10px] px-2 py-0.5 ${f.enabled ? "bg-primary/20 text-primary border-primary/30 font-medium" : "opacity-40 line-through"}`,
									children: f.name
								}, f.key))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "New Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: showPassword ? "text" : "password",
									value: form.password,
									onChange: (e) => setForm({
										...form,
										password: e.target.value
									}),
									placeholder: "Leave blank to keep existing password",
									className: "pr-10"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPassword(!showPassword),
									className: "absolute right-3 text-muted-foreground hover:text-foreground",
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleSave,
					className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
					children: "Save Changes"
				})] })
			]
		})
	});
}
function Info({ label, value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-medium",
			children: value
		})]
	});
}
function AddCustomerDialog({ onCreate }) {
	const [form, setForm] = (0, import_react.useState)({
		businessName: "",
		ownerName: "",
		email: "",
		mobile: "",
		address: "",
		password: "",
		subscriptionType: "trial"
	});
	const submit = () => {
		if (!form.businessName || !form.ownerName || !form.email || !form.password) {
			toast.error("Business, owner, email and password are required");
			return;
		}
		if (form.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		const days = form.subscriptionType === "yearly" ? 365 : form.subscriptionType === "monthly" ? 30 : 7;
		onCreate({
			id: `CUS-${Math.floor(Math.random() * 9e3 + 1e3)}`,
			...form,
			status: form.subscriptionType === "trial" ? "trial" : "active",
			expiryDate: new Date(now.getTime() + days * 864e5).toISOString(),
			createdAt: now.toISOString(),
			lastLogin: now.toISOString(),
			bills: 0,
			products: 0,
			features: defaultFeaturesFor(form.subscriptionType)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add customer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create a new tenant on the platform." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Business Name",
						value: form.businessName,
						onChange: (v) => setForm({
							...form,
							businessName: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Owner Name",
						value: form.ownerName,
						onChange: (v) => setForm({
							...form,
							ownerName: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						type: "email",
						value: form.email,
						onChange: (v) => setForm({
							...form,
							email: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mobile",
						value: form.mobile,
						onChange: (v) => setForm({
							...form,
							mobile: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Password",
							type: "password",
							value: form.password,
							onChange: (v) => setForm({
								...form,
								password: v
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							value: form.address,
							onChange: (v) => setForm({
								...form,
								address: v
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subscription Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.subscriptionType,
							onValueChange: (v) => setForm({
								...form,
								subscriptionType: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "trial",
									children: "Free Trial (7 days)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "monthly",
									children: "Monthly (30 days)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "yearly",
									children: "Yearly (365 days)"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "text-xs font-semibold flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Features Unlocked (",
								defaultFeaturesFor(form.subscriptionType).filter((f) => f.enabled).length,
								" Enabled)"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] uppercase",
								children: form.subscriptionType
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 pt-1 max-h-[120px] overflow-y-auto",
							children: defaultFeaturesFor(form.subscriptionType).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: f.enabled ? "default" : "outline",
								className: `text-[10px] px-2 py-0.5 ${f.enabled ? "bg-primary/20 text-primary border-primary/30 font-medium" : "opacity-40 line-through"}`,
								children: f.name
							}, f.key))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
				children: "Create customer"
			}) })
		]
	});
}
function Field({ label, value, onChange, type = "text", placeholder }) {
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
				placeholder,
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
function FeaturesDialog({ customer, onOpenChange, onSave }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newDesc, setNewDesc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setItems(customer ? customer.features.map((f) => ({ ...f })) : []);
		setNewName("");
		setNewDesc("");
	}, [customer]);
	const toggle = (key, enabled) => setItems((arr) => arr.map((f) => f.key === key ? {
		...f,
		enabled
	} : f));
	const addCustom = () => {
		const name = newName.trim();
		if (!name) {
			toast.error("Feature name is required");
			return;
		}
		const key = `custom_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${Date.now().toString(36)}`;
		setItems((arr) => [...arr, {
			key,
			name,
			description: newDesc.trim() || "Custom feature",
			category: "Custom",
			enabled: true,
			custom: true
		}]);
		setNewName("");
		setNewDesc("");
		toast.success(`Added "${name}"`);
	};
	const removeCustom = (key) => setItems((arr) => arr.filter((f) => f.key !== key));
	const grouped = (0, import_react.useMemo)(() => {
		const g = {};
		items.forEach((f) => {
			(g[f.category] ||= []).push(f);
		});
		return g;
	}, [items]);
	const enabledCount = items.filter((f) => f.enabled).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!customer,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-2xl max-h-[85vh] overflow-y-auto",
			children: customer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Features · ", customer.businessName] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Enable or disable features for this tenant. ",
					enabledCount,
					" of ",
					items.length,
					" ",
					"enabled."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [Object.entries(grouped).map(([cat, feats]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: cat
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border rounded-lg border border-border",
							children: feats.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: f.name
										}), f.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "h-4 px-1.5 text-[10px]",
											children: "custom"
										})]
									}), f.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: f.description
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: f.enabled,
										onCheckedChange: (v) => toggle(f.key, v)
									}), f.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7",
										onClick: () => removeCustom(f.key),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})]
								})]
							}, f.key))
						})]
					}, cat)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-lg border border-dashed border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Add custom feature"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Feature name (e.g. Kitchen Display)",
										value: newName,
										onChange: (e) => setNewName(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Short description (optional)",
										value: newDesc,
										onChange: (e) => setNewDesc(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: addCustom,
										className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Add any feature the customer requested. It will appear in their Flutter app if enabled."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => onSave(items),
						className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90",
						children: "Save changes"
					})]
				})
			] })
		})
	});
}
//#endregion
export { CustomersPage as component };
