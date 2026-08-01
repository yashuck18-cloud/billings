import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { G as PartyPopper, L as RotateCcw, d as Upload, dt as Image, g as Trash2, gt as Globe, w as Sparkles } from "../_libs/lucide-react.mjs";
import { a as customersApi, n as advertisementsApi } from "./api-D5gYHQcL.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCustomers } from "./api-hooks-UCeWdNOc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.theme-B4YZYY2v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FESTIVAL_PRESETS = [
	{
		id: "standard",
		name: "Standard Apex Indigo",
		tagline: "Modern Sleek Professional",
		greeting: "Welcome back to your POS Dashboard",
		icon: "⚡",
		badge: "PROMO",
		gradient: "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
		accent: "#4F46E5",
		badgeBg: "#F59E0B",
		description: "Default sleek dark indigo theme designed for high-efficiency daily retail operations."
	},
	{
		id: "ugadi",
		name: "Ugadi Festival Theme 🌿",
		tagline: "Fresh Mango Green & Gold",
		greeting: "🌿 Happy Ugadi! May this New Year bring joy, health & prosperity.",
		icon: "🌿",
		badge: "UGADI SPECIAL",
		gradient: "from-[#064E3B] via-[#047857] to-[#D97706]",
		accent: "#10B981",
		badgeBg: "#F59E0B",
		description: "Vibrant traditional theme with mango leaves, marigold gold accents and festive greetings."
	},
	{
		id: "diwali",
		name: "Diwali Festival Theme 🪔",
		tagline: "Golden Diya & Deep Maroon",
		greeting: "🪔 Happy Diwali! May the festival of lights bring success & warmth.",
		icon: "🪔",
		badge: "DIWALI OFFER",
		gradient: "from-[#4C0519] via-[#881337] to-[#D97706]",
		accent: "#F43F5E",
		badgeBg: "#FBBF24",
		description: "Rich maroon background with golden rangoli sparkles, warm diya lighting and festive discounts."
	},
	{
		id: "holi",
		name: "Holi Festival Colors 🎨",
		tagline: "Neon Splash & Magenta",
		greeting: "🎨 Happy Holi! Spread colors of happiness & prosperity across your store.",
		icon: "🎨",
		badge: "HOLI COLORS",
		gradient: "from-[#581C87] via-[#C026D3] to-[#06B6D4]",
		accent: "#EC4899",
		badgeBg: "#22C55E",
		description: "Playful high-energy neon color splash theme celebrating the festival of colors."
	},
	{
		id: "christmas",
		name: "Christmas & New Year ❄️",
		tagline: "Crimson Red & Winter Snow",
		greeting: "❄️ Merry Christmas & Happy New Year! Season's greetings to all your customers.",
		icon: "❄️",
		badge: "HOLIDAY DEAL",
		gradient: "from-[#0F172A] via-[#1E3A8A] to-[#991B1B]",
		accent: "#EF4444",
		badgeBg: "#F59E0B",
		description: "Cozy winter night background with snow sparkles, pine green and holiday gift styling."
	}
];
function ThemeManagementPage() {
	const { data: customers } = useCustomers();
	const [selectedCustomerId, setSelectedCustomerId] = (0, import_react.useState)("all");
	const [activeTheme, setActiveTheme] = (0, import_react.useState)("standard");
	const [applyGlobal, setApplyGlobal] = (0, import_react.useState)(true);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [customBannerUrl, setCustomBannerUrl] = (0, import_react.useState)("");
	const [bannerPhotos, setBannerPhotos] = (0, import_react.useState)([]);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [pendingImage, setPendingImage] = (0, import_react.useState)("");
	const fileInputRef = (0, import_react.useRef)(null);
	const handleFileProcess = async (file) => {
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file (JPG, PNG, WebP)!");
			return;
		}
		setIsSaving(true);
		let photoUrl = "";
		try {
			photoUrl = (await advertisementsApi.uploadImage(file)).imageUrl;
		} catch (e) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				if (ev.target?.result) {
					const dataUrl = ev.target.result;
					const nextPhotos = [...bannerPhotos, dataUrl];
					setBannerPhotos(nextPhotos);
					handleApplyTheme(activeTheme, dataUrl, nextPhotos);
					toast.success("Festival banner photo uploaded and broadcasted to POS app!");
				}
			};
			reader.readAsDataURL(file);
			setIsSaving(false);
			return;
		}
		if (photoUrl) {
			const nextPhotos = [...bannerPhotos, photoUrl];
			setBannerPhotos(nextPhotos);
			handleApplyTheme(activeTheme, photoUrl, nextPhotos);
			toast.success("Festival banner photo uploaded and broadcasted to POS app!");
		}
		setIsSaving(false);
	};
	const handleUploadPhotoClick = () => {
		const photoToUpload = pendingImage || customBannerUrl.trim();
		if (!photoToUpload) {
			toast.error("Please drag & drop an image, select a file, or enter an image URL!");
			return;
		}
		const nextPhotos = [...bannerPhotos, photoToUpload];
		setBannerPhotos(nextPhotos);
		setPendingImage("");
		setCustomBannerUrl("");
		handleApplyTheme(activeTheme, photoToUpload, nextPhotos);
		toast.success("Uploaded festival photo! Displaying on POS dashboard carousel.");
	};
	const handleDeletePhoto = (index) => {
		const nextPhotos = bannerPhotos.filter((_, i) => i !== index);
		setBannerPhotos(nextPhotos);
		const nextBanner = nextPhotos.length > 0 ? nextPhotos[0] : "";
		setCustomBannerUrl("");
		handleApplyTheme(activeTheme, nextBanner, nextPhotos);
		toast.success("Deleted festival banner photo!");
	};
	(0, import_react.useEffect)(() => {
		if (selectedCustomerId === "all") {
			const savedTheme = localStorage.getItem("pos_global_festival_theme") || "standard";
			const savedBanner = localStorage.getItem("pos_global_festival_banner") || "";
			const savedPhotosRaw = localStorage.getItem("pos_global_festival_photos") || "[]";
			let photos = [];
			try {
				photos = JSON.parse(savedPhotosRaw);
			} catch {
				photos = [];
			}
			setActiveTheme(savedTheme);
			setCustomBannerUrl(savedBanner);
			setBannerPhotos(photos);
		} else customersApi.getConfig(selectedCustomerId).then((cfg) => {
			if (cfg?.festivalTheme) setActiveTheme(cfg.festivalTheme);
			else if (cfg?.appTheme) setActiveTheme(cfg.appTheme);
			else setActiveTheme("standard");
			setCustomBannerUrl(cfg?.festivalBannerUrl || "");
			let photos = [];
			if (cfg?.festivalBannerImages) try {
				photos = JSON.parse(cfg.festivalBannerImages);
			} catch {
				photos = [];
			}
			setBannerPhotos(photos);
		}).catch(() => setActiveTheme("standard"));
	}, [selectedCustomerId]);
	const handleApplyTheme = async (themeId, bannerUrlOverride, photosOverride) => {
		setActiveTheme(themeId);
		setIsSaving(true);
		const bannerToSave = bannerUrlOverride !== void 0 ? bannerUrlOverride : customBannerUrl;
		const photosJson = JSON.stringify(photosOverride !== void 0 ? photosOverride : bannerPhotos);
		try {
			if (selectedCustomerId === "all" || applyGlobal) {
				localStorage.setItem("pos_global_festival_theme", themeId);
				localStorage.setItem("pos_global_festival_banner", bannerToSave);
				localStorage.setItem("pos_global_festival_photos", photosJson);
				await Promise.all([
					customersApi.saveConfig("all", {
						festivalTheme: themeId,
						appTheme: themeId,
						festivalBannerUrl: bannerToSave,
						festivalBannerImages: photosJson
					}).catch(() => null),
					...(customers || []).map((c) => customersApi.saveConfig(c.id, {
						festivalTheme: themeId,
						appTheme: themeId,
						festivalBannerUrl: bannerToSave,
						festivalBannerImages: photosJson
					}).catch(() => null))
				]);
				if (themeId === "standard") toast.success("Reset theme to Default POS UI globally!", { description: "All POS app users will return to default theme on their next sync." });
				else toast.success(`Applied ${FESTIVAL_PRESETS.find((p) => p.id === themeId)?.name} globally!`, { description: "All POS app users will receive this festival UI theme & banner carousel on next sync." });
			} else {
				await customersApi.saveConfig(selectedCustomerId, {
					festivalTheme: themeId,
					appTheme: themeId,
					festivalBannerUrl: bannerToSave,
					festivalBannerImages: photosJson
				});
				const targetCust = (customers || []).find((c) => c.id === selectedCustomerId);
				if (themeId === "standard") toast.success(`Reset theme to Default for ${targetCust?.businessName ?? "Selected User"}!`);
				else toast.success(`Theme updated for ${targetCust?.businessName ?? "Selected User"}!`);
			}
		} catch (err) {
			console.error("Theme save error:", err);
			toast.error("Failed to save theme setting to cloud.");
		} finally {
			setIsSaving(false);
		}
	};
	const handleResetTheme = () => {
		setCustomBannerUrl("");
		setBannerPhotos([]);
		handleApplyTheme("standard", "", []);
	};
	const currentPreset = FESTIVAL_PRESETS.find((p) => p.id === activeTheme) || FESTIVAL_PRESETS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7 text-primary animate-pulse" }), "Festival & App UI Themes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Change the POS application's visual theme, festive greetings, banners, and accent colors for Ugadi, Diwali, Holi, and seasonal events."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground mb-1 block",
							children: "Apply Theme To"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedCustomerId,
							onValueChange: setSelectedCustomerId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "max-h-[300px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "🌐 All POS Users (Global Storewide)"
								}), customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [
										"🏪 ",
										c.businessName,
										" (",
										c.subscriptionType,
										")"
									]
								}, c.id))]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleResetTheme,
						disabled: isSaving,
						className: "h-9 text-xs border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 self-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), "Reset to Default UI"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-primary/30 bg-primary/5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2.5 rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: "Instant Cloud Sync for Festival UI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "When you switch a festival theme, connected POS devices update their colors, headers, and greetings automatically every 5 seconds."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold whitespace-nowrap",
							children: "Broadcast to All Users"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: applyGlobal,
							onCheckedChange: setApplyGlobal
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-3 border-b border-border/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "h-4 w-4 text-amber-500" }), "Active POS App Theme Live Preview"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: "This is how the POS Dashboard header and promotion cards will look on users' devices."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl mx-auto space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `p-4 rounded-xl bg-gradient-to-r ${currentPreset.gradient} text-white shadow-lg space-y-2`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: currentPreset.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-sm",
										children: currentPreset.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-white/80",
										children: currentPreset.greeting
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-amber-400 text-black font-extrabold text-[10px] tracking-wider px-2 py-0.5",
									children: currentPreset.badge
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/20 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-3 h-3 rounded-full",
									style: { backgroundColor: currentPreset.accent }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Primary Accent: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { color: currentPreset.accent },
									children: currentPreset.accent
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Theme Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] border-primary text-primary font-bold",
									children: "Active in POS"
								})] })
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-3 border-b border-border/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-primary animate-bounce" }), "Drag & Drop Festival Banner Photo Upload"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: "Drag & drop festival photos or click browse to upload artwork. When uploaded, images display automatically at the top of the POS App Dashboard for all users as a carousel."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-6 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onDragOver: (e) => {
								e.preventDefault();
								setIsDragging(true);
							},
							onDragLeave: () => setIsDragging(false),
							onDrop: (e) => {
								e.preventDefault();
								setIsDragging(false);
								if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileProcess(e.dataTransfer.files[0]);
							},
							onClick: () => fileInputRef.current?.click(),
							className: `cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${isDragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-border/80 hover:border-primary/60 hover:bg-muted/30 bg-muted/10"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										if (e.target.files && e.target.files[0]) handleFileProcess(e.target.files[0]);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 rounded-full bg-primary/10 text-primary shadow-inner",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-8 w-8" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold",
									children: [
										"Drag & Drop Festival Banner Photo Here, or",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary underline",
											children: "Browse Files"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Supports High Resolution PNG, JPG, WebP images (Ugadi, Diwali, Holi, Festive Banners)"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row gap-3 items-end pt-2 border-t border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Or Paste Festival Photo Image URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Paste festival banner image URL (e.g. https://example.com/ugadi.png)...",
									value: customBannerUrl,
									onChange: (e) => setCustomBannerUrl(e.target.value),
									className: "h-10 text-xs"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "bg-primary text-primary-foreground font-bold text-xs h-10 px-6 shadow-md hover:opacity-90",
									disabled: isSaving || !customBannerUrl.trim() && !pendingImage,
									onClick: handleUploadPhotoClick,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload Photo"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "text-xs h-10",
									onClick: () => {
										setCustomBannerUrl("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80");
									},
									children: "Sample Ugadi Photo"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-4 border-t border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-bold flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-amber-500" }),
										"Active POS Dashboard Carousel Photos (",
										bannerPhotos.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Auto-syncs to all active POS user devices"
								})]
							}), bannerPhotos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground",
									children: "No photos in carousel yet."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Drag & drop or paste an image URL above and click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Upload Photo\"" }),
									" to activate."
								] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
								children: bannerPhotos.map((photoUrl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: photoUrl,
											alt: `Festival Carousel Photo ${idx + 1}`,
											className: "h-32 w-full object-cover",
											onError: (e) => {
												e.target.src = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80";
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-2 right-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "destructive",
												className: "h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform",
												onClick: () => handleDeletePhoto(idx),
												title: "Delete this festival photo from carousel",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 text-xs text-muted-foreground flex items-center justify-between font-mono bg-card border-t border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-foreground",
												children: ["Photo #", idx + 1]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px]",
												children: "Active Carousel"
											})]
										})
									]
								}, idx))
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ThemeManagementPage as component };
