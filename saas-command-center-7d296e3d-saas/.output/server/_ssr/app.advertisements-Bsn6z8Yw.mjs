import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { $ as Megaphone, C as SquarePen, H as Plus, P as Search, Z as Monitor, d as Upload, dt as Image, g as Trash2, xt as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as advertisementsApi } from "./api-D5gYHQcL.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.advertisements-Bsn6z8Yw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_PRESET_IMAGES = [
	{
		name: "SaaS Pro Upgrade",
		url: "https://images.unsplash.com/photo-1556742049-0a67d5192464?w=600&q=80"
	},
	{
		name: "Thermal Printer Hardware",
		url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80"
	},
	{
		name: "Cloud Data Backup",
		url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80"
	},
	{
		name: "WhatsApp Billing & GST",
		url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80"
	}
];
var LOCAL_STORAGE_KEY = "flutter.pos_advertisements";
function syncToLocalStorage(ads) {
	try {
		const activeAds = ads.filter((a) => a.active);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeAds));
	} catch (e) {
		console.warn("Failed to sync advertisements to localStorage:", e);
	}
}
function AdvertisementsPage() {
	const [ads, setAds] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [editingAd, setEditingAd] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [subtitle, setSubtitle] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [badge, setBadge] = (0, import_react.useState)("PROMO");
	const [ctaText, setCtaText] = (0, import_react.useState)("Learn More");
	const [ctaLink, setCtaLink] = (0, import_react.useState)("");
	const [targetAudience, setTargetAudience] = (0, import_react.useState)("all");
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(true);
	const handleFileUpload = async (file) => {
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file (PNG, JPG, WEBP)");
			return;
		}
		setIsUploading(true);
		try {
			setImageUrl((await advertisementsApi.uploadImage(file)).imageUrl);
			toast.success("Image uploaded to server successfully!");
		} catch (err) {
			console.warn("Server upload failed, fallback to local reader:", err);
			const reader = new FileReader();
			reader.onload = (e) => setImageUrl(e.target?.result);
			reader.readAsDataURL(file);
			toast.success("Image loaded locally!");
		} finally {
			setIsUploading(false);
		}
	};
	const fetchAds = async () => {
		setLoading(true);
		try {
			const data = await advertisementsApi.list();
			setAds(data);
			syncToLocalStorage(data);
		} catch (err) {
			console.warn("Failed to fetch ads from API, using cached or fallback:", err);
			try {
				const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
				if (raw) setAds(JSON.parse(raw));
			} catch (_) {}
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchAds();
	}, []);
	const handleOpenAddModal = () => {
		setEditingAd(null);
		setTitle("");
		setSubtitle("");
		setImageUrl(DEFAULT_PRESET_IMAGES[0].url);
		setBadge("HOT OFFER");
		setCtaText("Explore Now");
		setCtaLink("");
		setTargetAudience("all");
		setActive(true);
		setIsDialogOpen(true);
	};
	const handleOpenEditModal = (ad) => {
		setEditingAd(ad);
		setTitle(ad.title);
		setSubtitle(ad.subtitle);
		setImageUrl(ad.imageUrl);
		setBadge(ad.badge);
		setCtaText(ad.ctaText);
		setCtaLink(ad.ctaLink || "");
		setTargetAudience(ad.targetAudience);
		setActive(ad.active);
		setIsDialogOpen(true);
	};
	const handleSave = async () => {
		if (!title.trim()) {
			toast.error("Advertisement Headline/Title is required");
			return;
		}
		const payload = {
			title: title.trim(),
			subtitle: subtitle.trim(),
			imageUrl: imageUrl.trim() || DEFAULT_PRESET_IMAGES[0].url,
			badge: badge.trim() || "PROMO",
			ctaText: ctaText.trim() || "Learn More",
			ctaLink: ctaLink.trim(),
			targetAudience,
			active
		};
		try {
			if (editingAd) {
				const updated = await advertisementsApi.update(editingAd.id, payload);
				const nextList = ads.map((a) => a.id === editingAd.id ? updated : a);
				setAds(nextList);
				syncToLocalStorage(nextList);
				toast.success("Advertisement updated successfully");
			} else {
				const nextList = [await advertisementsApi.create(payload), ...ads];
				setAds(nextList);
				syncToLocalStorage(nextList);
				toast.success("New advertisement published to POS Dashboard!");
			}
			setIsDialogOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save advertisement");
		}
	};
	const handleToggleActive = async (ad) => {
		try {
			const nextActive = !ad.active;
			const updated = await advertisementsApi.update(ad.id, { active: nextActive });
			const nextList = ads.map((a) => a.id === ad.id ? updated : a);
			setAds(nextList);
			syncToLocalStorage(nextList);
			toast.info(`Advertisement "${ad.title}" ${nextActive ? "activated" : "hidden"}`);
		} catch (err) {
			toast.error("Failed to toggle advertisement status");
		}
	};
	const handleDelete = async (id, adTitle) => {
		if (!confirm(`Are you sure you want to delete advertisement "${adTitle}"?`)) return;
		try {
			await advertisementsApi.remove(id);
			const nextList = ads.filter((a) => a.id !== id);
			setAds(nextList);
			syncToLocalStorage(nextList);
			toast.success("Advertisement deleted");
		} catch (err) {
			toast.error("Failed to delete advertisement");
		}
	};
	const filteredAds = ads.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.subtitle.toLowerCase().includes(search.toLowerCase()) || a.badge.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight md:text-3xl",
						children: "Advertisements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs bg-primary/10 text-primary border-primary/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "mr-1 h-3 w-3" }), " Live POS Carousel"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs sm:text-sm text-muted-foreground",
					children: "Manage banner advertisements and promotional announcements displayed in the POS app dashboard carousel."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenAddModal,
					className: "bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add Advertisement"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-sm font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4 text-primary" }), " Live POS Top Banner Carousel Preview"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "text-[10px]",
							children: [ads.filter((a) => a.active).length, " Active Banners"]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: ads.filter((a) => a.active).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
					children: "No active advertisements right now. Click \"Add Advertisement\" above to publish your first banner!"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: ads.filter((a) => a.active).slice(0, 3).map((ad) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground tracking-wider uppercase",
									children: ad.badge || "PROMO"
								}), ad.targetAudience !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[9px] text-white/70 capitalize bg-white/10 px-2 py-0.5 rounded",
									children: ["Target: ", ad.targetAudience]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-sm font-bold truncate",
								children: ad.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-white/80 line-clamp-2",
								children: ad.subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3",
									children: ad.ctaText || "Learn More"
								}), ad.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: ad.imageUrl,
									alt: "",
									className: "h-8 w-12 rounded object-cover border border-white/20"
								})]
							})
						]
					}, ad.id))
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base",
							children: [
								"All Advertisements (",
								ads.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search ads...",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "h-8 pl-8 text-xs"
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "Loading advertisements..."
					}) : filteredAds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "No advertisements found."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: filteredAds.map((ad) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 min-w-0 flex-1",
								children: [ad.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: ad.imageUrl,
									alt: "",
									className: "h-12 w-16 shrink-0 rounded-lg object-cover border border-border"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-12 w-16 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-sm truncate text-foreground",
													children: ad.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] uppercase font-bold shrink-0",
													children: ad.badge
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: ad.active ? "default" : "secondary",
													className: ad.active ? "bg-success text-success-foreground text-[10px]" : "text-[10px]",
													children: ad.active ? "Active" : "Disabled"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground line-clamp-1",
											children: ad.subtitle
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CTA: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: ad.ctaText
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Audience: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "capitalize text-foreground",
													children: ad.targetAudience
												})] }),
												ad.ctaLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 text-primary max-w-[220px] truncate",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: ad.ctaLink.startsWith("http") ? ad.ctaLink : `https://${ad.ctaLink}`,
														target: "_blank",
														rel: "noreferrer",
														className: "hover:underline truncate",
														children: ad.ctaLink
													})]
												})
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0 self-end sm:self-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 mr-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: ad.active,
											onCheckedChange: () => handleToggleActive(ad)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: ad.active ? "Visible" : "Hidden"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => handleOpenEditModal(ad),
										className: "h-8 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-1 h-3.5 w-3.5" }), " Edit"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => handleDelete(ad.id, ad.title),
										className: "h-8 text-xs text-destructive hover:bg-destructive/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						}, ad.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col p-4 sm:p-6 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "shrink-0 pb-2 border-b border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingAd ? "Edit Advertisement" : "Create New Advertisement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs",
								children: "Configure banner title, body text, image, badge, and CTA button to display on all users' POS dashboard top carousel."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-3 overflow-y-auto pr-1 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Headline / Title *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. 50% Off Summer Bakery Special!",
										value: title,
										onChange: (e) => setTitle(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Subtext / Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "e.g. Upgrade your plan today to unlock multi-branch stock management and GST invoicing.",
										value: subtitle,
										onChange: (e) => setSubtitle(e.target.value),
										rows: 3
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Badge Tag"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "e.g. HOT OFFER, PROMO, NEW",
											value: badge,
											onChange: (e) => setBadge(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "CTA Button Text"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "e.g. Upgrade Now, Learn More",
											value: ctaText,
											onChange: (e) => setCtaText(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-xs font-semibold flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Target Website / Offer Link URL (Opens on Click)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-normal text-muted-foreground",
											children: "(e.g. https://website.com)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. https://yourwebsite.com/offer or https://google.com",
										value: ctaLink,
										onChange: (e) => setCtaLink(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Target Audience"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: targetAudience,
										onValueChange: (v) => setTargetAudience(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All POS Users"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "active",
												children: "Active Plan Subscribers Only"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "trial",
												children: "Trial Users Only"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Banner Image (Upload or Pick Preset)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 text-center hover:bg-primary/10 transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-primary mb-1" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold text-primary",
														children: isUploading ? "Uploading & Optimizing..." : "Click to Upload Image File from Device"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-muted-foreground mt-0.5",
														children: "Supports PNG, JPG, WEBP (auto-compressed for instant POS sync)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: "image/*",
														className: "hidden",
														disabled: isUploading,
														onChange: (e) => {
															const file = e.target.files?.[0];
															if (file) handleFileUpload(file);
														}
													})
												]
											}),
											imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: imageUrl,
														alt: "Banner Preview",
														className: "h-12 w-20 rounded-md object-cover border border-border shrink-0"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-1 text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-semibold truncate",
															children: imageUrl.startsWith("data:image") ? "Uploaded Image File (Base64)" : "Selected Banner Image"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-[10px] text-muted-foreground truncate",
															children: [imageUrl.slice(0, 50), "..."]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														size: "sm",
														variant: "ghost",
														className: "h-7 text-xs text-destructive hover:bg-destructive/10",
														onClick: () => setImageUrl(""),
														children: "Remove"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1 pt-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] font-medium text-muted-foreground",
														children: "Or select preset image / enter image URL:"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "https://images.unsplash.com/...",
														value: imageUrl,
														onChange: (e) => setImageUrl(e.target.value),
														className: "h-8 text-xs"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex flex-wrap gap-1.5 pt-1",
														children: DEFAULT_PRESET_IMAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setImageUrl(p.url),
															className: "text-[10px] px-2 py-1 rounded-md border transition-colors " + (imageUrl === p.url ? "bg-primary text-primary-foreground border-primary font-bold" : "border-border hover:bg-muted"),
															children: p.name
														}, p.name))
													})
												]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg border border-border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Enable & Publish Banner"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "Active banners will immediately display in POS dashboard carousels."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: active,
										onCheckedChange: setActive
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "shrink-0 pt-3 border-t border-border/40 gap-2 flex-row justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setIsDialogOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSave,
								className: "bg-gradient-primary text-primary-foreground shadow-elegant",
								children: editingAd ? "Save Changes" : "Publish Advertisement"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdvertisementsPage as component };
