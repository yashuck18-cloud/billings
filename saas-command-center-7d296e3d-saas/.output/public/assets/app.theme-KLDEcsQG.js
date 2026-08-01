import { a as e, n as t, t as n } from "./jsx-runtime-C27Mmbu5.js";
import { n as r } from "./api-hooks-C4TwWEcD.js";
import { t as i } from "./index-3XhaPVcd.js";
import { c as a } from "./dist-DEZS4aoA.js";
import { a as o, i as s, n as c, r as l, t as u } from "./select-DSxH11I4.js";
import { t as d } from "./globe-DeAVJRA9.js";
import { n as f, t as p } from "./upload-ZhyEogqM.js";
import { t as m } from "./rotate-ccw-Bf85o5ga.js";
import { t as h } from "./sparkles-CFemFaie.js";
import { t as g } from "./trash-2-J8L2GSzN.js";
import { a as _, i as v, n as y, r as b, t as x } from "./card-CZHw3pFe.js";
import { t as S } from "./button-BnY2mVfF.js";
import { t as C } from "./input-B5hAaV97.js";
import { t as w } from "./label-88fOckeu.js";
import { t as T } from "./switch-0rCYyMZg.js";
import { t as E } from "./badge-DhPwNmMz.js";
import { a as D, n as O, ft } from "./api-Kju_d4QL.js";

var k = a("party-popper", [
  ["path", { d: "M5.8 11.3 2 22l10.7-3.79", key: "gwxi1d" }],
  ["path", { d: "M4 3h.01", key: "1vcuye" }],
  ["path", { d: "M22 8h.01", key: "1mrtc2" }],
  ["path", { d: "M15 2h.01", key: "1cjtqr" }],
  ["path", { d: "M22 20h.01", key: "1mrys2" }],
  [
    "path",
    {
      d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
      key: "hbicv8",
    },
  ],
  [
    "path",
    {
      d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",
      key: "1i94pl",
    },
  ],
  [
    "path",
    {
      d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",
      key: "1cofks",
    },
  ],
  [
    "path",
    {
      d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
      key: "4kbmks",
    },
  ],
]);

var A = e(t()),
  j = n();

var M = [
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
    description: "Default sleek dark indigo theme designed for high-efficiency daily retail operations.",
    isDefault: true,
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
    description: "Vibrant traditional theme with mango leaves, marigold gold accents and festive greetings.",
    isDefault: true,
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
    description: "Rich maroon background with golden rangoli sparkles, warm diya lighting and festive discounts.",
    isDefault: true,
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
    description: "Playful high-energy neon color splash theme celebrating the festival of colors.",
    isDefault: true,
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
    description: "Cozy winter night background with snow sparkles, pine green and holiday gift styling.",
    isDefault: true,
  },
];

function N() {
  let { data: customers } = r();
  let [targetUser, setTargetUser] = (0, A.useState)("all");
  let [activeThemeId, setActiveThemeId] = (0, A.useState)("standard");
  let [broadcastAll, setBroadcastAll] = (0, A.useState)(true);
  let [isSaving, setIsSaving] = (0, A.useState)(false);
  let [bannerUrlInput, setBannerUrlInput] = (0, A.useState)("");
  let [carouselPhotos, setCarouselPhotos] = (0, A.useState)([]);
  let [isDragging, setIsDragging] = (0, A.useState)(false);
  let [dragImage, setDragImage] = (0, A.useState)("");
  let fileInputRef = (0, A.useRef)(null);

  // Theme CRUD states
  let [themes, setThemes] = (0, A.useState)(M);
  let [showModal, setShowModal] = (0, A.useState)(false);
  let [editingTheme, setEditingTheme] = (0, A.useState)(null);
  let [formState, setFormState] = (0, A.useState)({
    id: "",
    name: "",
    tagline: "",
    greeting: "",
    icon: "🎉",
    badge: "FESTIVAL",
    badgeBg: "#F59E0B",
    gradient: "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
    accent: "#4F46E5",
    description: "",
  });

  const loadThemesFromBackend = async () => {
    try {
      const data = await ft.list();
      if (Array.isArray(data) && data.length > 0) {
        setThemes(data);
      }
    } catch (e) {
      console.warn("Using local themes fallback:", e);
    }
  };

  (0, A.useEffect)(() => {
    loadThemesFromBackend();
  }, []);

  (0, A.useEffect)(() => {
    if (targetUser === "all") {
      let savedTheme = localStorage.getItem("pos_global_festival_theme") || "standard";
      let savedBanner = localStorage.getItem("pos_global_festival_banner") || "";
      let savedPhotosRaw = localStorage.getItem("pos_global_festival_photos") || "[]";
      let photos = [];
      try {
        photos = JSON.parse(savedPhotosRaw);
      } catch {
        photos = [];
      }
      setActiveThemeId(savedTheme);
      setBannerUrlInput(savedBanner);
      setCarouselPhotos(photos);
    } else {
      D.getConfig(targetUser)
        .then((cfg) => {
          if (cfg?.festivalTheme) setActiveThemeId(cfg.festivalTheme);
          else if (cfg?.appTheme) setActiveThemeId(cfg.appTheme);
          else setActiveThemeId("standard");

          setBannerUrlInput(cfg?.festivalBannerUrl || "");
          let photos = [];
          if (cfg?.festivalBannerImages) {
            try {
              photos = JSON.parse(cfg.festivalBannerImages);
            } catch {
              photos = [];
            }
          }
          setCarouselPhotos(photos);
        })
        .catch(() => setActiveThemeId("standard"));
    }
  }, [targetUser]);

  const saveThemeConfig = async (newThemeId, bannerUrl, photos) => {
    setActiveThemeId(newThemeId);
    setIsSaving(true);
    let finalBanner = bannerUrl === undefined ? bannerUrlInput : bannerUrl;
    let finalPhotosStr = JSON.stringify(photos === undefined ? carouselPhotos : photos);

    try {
      if (targetUser === "all" || broadcastAll) {
        localStorage.setItem("pos_global_festival_theme", newThemeId);
        localStorage.setItem("pos_global_festival_banner", finalBanner);
        localStorage.setItem("pos_global_festival_photos", finalPhotosStr);

        await Promise.all([
          D.saveConfig("all", {
            festivalTheme: newThemeId,
            appTheme: newThemeId,
            festivalBannerUrl: finalBanner,
            festivalBannerImages: finalPhotosStr,
          }).catch(() => null),
          ...(customers || []).map((c) =>
            D.saveConfig(c.id, {
              festivalTheme: newThemeId,
              appTheme: newThemeId,
              festivalBannerUrl: finalBanner,
              festivalBannerImages: finalPhotosStr,
            }).catch(() => null)
          ),
        ]);

        const currentThemeObj = themes.find((t) => t.id === newThemeId);
        if (newThemeId === "standard") {
          i.success("Reset theme to Default POS UI globally!", {
            description: "All POS app users will return to default theme on their next sync.",
          });
        } else {
          i.success(`Applied ${currentThemeObj?.name || newThemeId} globally!`, {
            description: "All POS app users will receive this festival UI theme on next sync.",
          });
        }
      } else {
        await D.saveConfig(targetUser, {
          festivalTheme: newThemeId,
          appTheme: newThemeId,
          festivalBannerUrl: finalBanner,
          festivalBannerImages: finalPhotosStr,
        });
        const customer = (customers || []).find((c) => c.id === targetUser);
        if (newThemeId === "standard") {
          i.success(`Reset theme to Default for ${customer?.businessName ?? "Selected User"}!`);
        } else {
          i.success(`Theme updated for ${customer?.businessName ?? "Selected User"}!`);
        }
      }
    } catch (err) {
      console.error("Theme save error:", err);
      i.error("Failed to save theme setting to cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      i.error("Please select a valid image file (JPG, PNG, WebP)!");
      return;
    }
    setIsSaving(true);
    let uploadedUrl = "";
    try {
      uploadedUrl = (await O.uploadImage(file)).imageUrl;
    } catch {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          let dataUrl = e.target.result;
          let newPhotos = [...carouselPhotos, dataUrl];
          setCarouselPhotos(newPhotos);
          saveThemeConfig(activeThemeId, dataUrl, newPhotos);
          i.success("Festival banner photo uploaded and broadcasted to POS app!");
        }
      };
      reader.readAsDataURL(file);
      setIsSaving(false);
      return;
    }

    if (uploadedUrl) {
      let newPhotos = [...carouselPhotos, uploadedUrl];
      setCarouselPhotos(newPhotos);
      saveThemeConfig(activeThemeId, uploadedUrl, newPhotos);
      i.success("Festival banner photo uploaded and broadcasted to POS app!");
    }
    setIsSaving(false);
  };

  const handleAddPhoto = () => {
    let url = dragImage || bannerUrlInput.trim();
    if (!url) {
      i.error("Please drag & drop an image, select a file, or enter an image URL!");
      return;
    }
    let newPhotos = [...carouselPhotos, url];
    setCarouselPhotos(newPhotos);
    setDragImage("");
    setBannerUrlInput("");
    saveThemeConfig(activeThemeId, url, newPhotos);
    i.success("Uploaded festival photo! Displaying on POS dashboard carousel.");
  };

  const handleDeletePhoto = (index) => {
    let newPhotos = carouselPhotos.filter((_, idx) => idx !== index);
    setCarouselPhotos(newPhotos);
    let nextBanner = newPhotos.length > 0 ? newPhotos[0] : "";
    setBannerUrlInput("");
    saveThemeConfig(activeThemeId, nextBanner, newPhotos);
    i.success("Deleted festival banner photo!");
  };

  const handleResetToDefault = () => {
    setBannerUrlInput("");
    setCarouselPhotos([]);
    saveThemeConfig("standard", "", []);
  };

  // CRUD Handler Functions
  const openCreateModal = () => {
    setEditingTheme(null);
    setFormState({
      id: "",
      name: "",
      tagline: "Special Festival Edition",
      greeting: "🎉 Happy Festival! Wishing you great sales and happiness.",
      icon: "🌾",
      badge: "LIMITED OFFER",
      badgeBg: "#F59E0B",
      gradient: "from-[#0F172A] via-[#047857] to-[#D97706]",
      accent: "#10B981",
      description: "Custom celebratory festival theme.",
    });
    setShowModal(true);
  };

  const openEditModal = (theme) => {
    setEditingTheme(theme);
    setFormState({
      id: theme.id,
      name: theme.name || "",
      tagline: theme.tagline || "",
      greeting: theme.greeting || "",
      icon: theme.icon || "🎉",
      badge: theme.badge || "SPECIAL",
      badgeBg: theme.badgeBg || theme.badge_bg || "#F59E0B",
      gradient: theme.gradient || "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
      accent: theme.accent || "#4F46E5",
      description: theme.description || "",
    });
    setShowModal(true);
  };

  const handleSaveTheme = async (e) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      i.error("Please enter a Theme Name!");
      return;
    }

    try {
      if (editingTheme) {
        await ft.update(editingTheme.id, formState);
        i.success(`Theme "${formState.name}" updated successfully!`);
      } else {
        await ft.create(formState);
        i.success(`Custom Theme "${formState.name}" created successfully!`);
      }
      setShowModal(false);
      loadThemesFromBackend();
    } catch (err) {
      console.error(err);
      i.error(err.message || "Failed to save festival theme.");
    }
  };

  const handleDeleteTheme = async (theme) => {
    if (theme.isDefault || theme.id === "standard") {
      i.error("Default system themes cannot be deleted.");
      return;
    }
    if (!confirm(`Are you sure you want to delete "${theme.name}"?`)) return;

    try {
      await ft.remove(theme.id);
      i.success(`Deleted theme "${theme.name}"`);
      if (activeThemeId === theme.id) {
        saveThemeConfig("standard", bannerUrlInput, carouselPhotos);
      }
      loadThemesFromBackend();
    } catch (err) {
      console.error(err);
      i.error(err.message || "Failed to delete theme.");
    }
  };

  const activeThemeObj = themes.find((t) => t.id === activeThemeId) || themes[0] || M[0];

  return (
    (0, j.jsxs)("div", {
      className: "space-y-6",
      children: [
        // Top Header
        (0, j.jsxs)("div", {
          className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
          children: [
            (0, j.jsxs)("div", {
              children: [
                (0, j.jsxs)("h1", {
                  className: "text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2",
                  children: [
                    (0, j.jsx)(h, { className: "h-7 w-7 text-primary animate-pulse" }),
                    "Festival & App UI Themes",
                  ],
                }),
                (0, j.jsx)("p", {
                  className: "mt-1 text-sm text-muted-foreground",
                  children:
                    "Create custom festival themes, edit existing themes, and change POS greetings, banner carousels, and accent colors.",
                }),
              ],
            }),
            (0, j.jsxs)("div", {
              className: "flex flex-wrap items-center gap-2",
              children: [
                (0, j.jsxs)(S, {
                  size: "sm",
                  onClick: openCreateModal,
                  className: "h-9 text-xs bg-primary text-primary-foreground font-bold shadow-sm hover:opacity-90 self-end",
                  children: ["+ Create New Theme"],
                }),
                (0, j.jsxs)("div", {
                  className: "min-w-[200px]",
                  children: [
                    (0, j.jsx)(w, {
                      className: "text-xs text-muted-foreground mb-1 block",
                      children: "Apply Theme To",
                    }),
                    (0, j.jsxs)(u, {
                      value: targetUser,
                      onValueChange: setTargetUser,
                      children: [
                        (0, j.jsx)(s, { className: "h-9 text-xs", children: (0, j.jsx)(o, {}) }),
                        (0, j.jsxs)(c, {
                          className: "max-h-[300px]",
                          children: [
                            (0, j.jsx)(l, { value: "all", children: "🌐 All POS Users (Global Storewide)" }),
                            (customers || []).map((c) =>
                              (0, j.jsxs)(l, {
                                value: c.id,
                                children: ["🏪 ", c.businessName, " (", c.subscriptionType, ")"],
                              }, c.id)
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, j.jsxs)(S, {
                  variant: "outline",
                  size: "sm",
                  onClick: handleResetToDefault,
                  disabled: isSaving,
                  className:
                    "h-9 text-xs border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 self-end",
                  children: [(0,j.jsx)(m, { className: "mr-1.5 h-3.5 w-3.5" }), "Reset to Default UI"],
                }),
              ],
            }),
          ],
        }),

        // Notice Bar
        (0, j.jsx)(x, {
          className: "border-primary/30 bg-primary/5 shadow-sm",
          children: (0, j.jsxs)(y, {
            className: "p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
            children: [
              (0, j.jsxs)("div", {
                className: "flex items-center gap-3",
                children: [
                  (0, j.jsx)("div", {
                    className: "p-2.5 rounded-xl bg-primary/10 text-primary",
                    children: (0, j.jsx)(d, { className: "h-5 w-5" }),
                  }),
                  (0, j.jsxs)("div", {
                    children: [
                      (0, j.jsx)("div", {
                        className: "font-semibold text-sm",
                        children: "Instant Cloud Sync for Festival UI",
                      }),
                      (0, j.jsx)("div", {
                        className: "text-xs text-muted-foreground",
                        children:
                          "When you select or create a festival theme, connected POS devices receive the updated colors, greetings, and banners automatically.",
                      }),
                    ],
                  }),
                ],
              }),
              (0, j.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [
                  (0, j.jsx)(w, {
                    className: "text-xs font-semibold whitespace-nowrap",
                    children: "Broadcast to All Users",
                  }),
                  (0, j.jsx)(T, { checked: broadcastAll, onCheckedChange: setBroadcastAll }),
                ],
              }),
            ],
          }),
        }),



        // Live Header Preview
        (0, j.jsxs)(x, {
          className: "border-border bg-card shadow-sm overflow-hidden",
          children: [
            (0, j.jsxs)(v, {
              className: "pb-3 border-b border-border/40",
              children: [
                (0, j.jsxs)(_, {
                  className: "text-base flex items-center gap-2",
                  children: [(0, j.jsx)(k, { className: "h-4 w-4 text-amber-500" }), "Active POS App Theme Live Preview"],
                }),
                (0, j.jsx)(b, {
                  className: "text-xs",
                  children: "This is how the POS Dashboard header will appear on connected devices.",
                }),
              ],
            }),
            (0, j.jsx)(y, {
              className: "p-6",
              children: (0, j.jsxs)("div", {
                className: "max-w-2xl mx-auto space-y-4",
                children: [
                  (0, j.jsx)("div", {
                    className: `p-4 rounded-xl bg-gradient-to-r ${activeThemeObj.gradient} text-white shadow-lg space-y-2`,
                    children: (0, j.jsxs)("div", {
                      className: "flex items-center justify-between",
                      children: [
                        (0, j.jsxs)("div", {
                          className: "flex items-center gap-2",
                          children: [
                            (0, j.jsx)("span", { className: "text-2xl", children: activeThemeObj.icon || "🎉" }),
                            (0, j.jsxs)("div", {
                              children: [
                                (0, j.jsx)("div", { className: "font-bold text-sm", children: activeThemeObj.name }),
                                (0, j.jsx)("div", { className: "text-xs text-white/80", children: activeThemeObj.greeting }),
                              ],
                            }),
                          ],
                        }),
                        (0, j.jsx)(E, {
                          className: "bg-amber-400 text-black font-extrabold text-[10px] tracking-wider px-2 py-0.5",
                          children: activeThemeObj.badge || "SPECIAL",
                        }),
                      ],
                    }),
                  }),
                  (0, j.jsxs)("div", {
                    className:
                      "flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/20 text-xs",
                    children: [
                      (0, j.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                          (0, j.jsx)("span", {
                            className: "w-3 h-3 rounded-full",
                            style: { backgroundColor: activeThemeObj.accent || "#4F46E5" },
                          }),
                          (0, j.jsxs)("span", {
                            children: [
                              "Primary Accent: ",
                              (0, j.jsx)("strong", {
                                style: { color: activeThemeObj.accent || "#4F46E5" },
                                children: activeThemeObj.accent || "#4F46E5",
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, j.jsx)("div", {
                        className: "flex items-center gap-2",
                        children: (0, j.jsxs)("span", {
                          children: [
                            "Theme Status: ",
                            (0, j.jsx)(E, {
                              variant: "outline",
                              className: "text-[10px] border-primary text-primary font-bold",
                              children: "Active in POS",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),

        // Banner Photo Carousel Upload
        (0, j.jsxs)(x, {
          className: "border-border bg-card shadow-sm",
          children: [
            (0, j.jsxs)(v, {
              className: "pb-3 border-b border-border/40",
              children: [
                (0, j.jsxs)(_, {
                  className: "text-base flex items-center gap-2",
                  children: [
                    (0, j.jsx)(p, { className: "h-5 w-5 text-primary animate-bounce" }),
                    "Drag & Drop Festival Banner Photo Upload",
                  ],
                }),
                (0, j.jsx)(b, {
                  className: "text-xs",
                  children:
                    "Drag & drop festival photos or paste an artwork URL to show as a sliding carousel on POS dashboards.",
                }),
              ],
            }),
            (0, j.jsxs)(y, {
              className: "p-6 space-y-6",
              children: [
                (0, j.jsxs)("div", {
                  onDragOver: (e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  },
                  onDragLeave: () => setIsDragging(false),
                  onDrop: (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  },
                  onClick: () => fileInputRef.current?.click(),
                  className: `cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-border/80 hover:border-primary/60 hover:bg-muted/30 bg-muted/10"
                  }`,
                  children: [
                    (0, j.jsx)("input", {
                      ref: fileInputRef,
                      type: "file",
                      accept: "image/*",
                      className: "hidden",
                      onChange: (e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      },
                    }),
                    (0, j.jsx)("div", {
                      className: "p-4 rounded-full bg-primary/10 text-primary shadow-inner",
                      children: (0, j.jsx)(f, { className: "h-8 w-8" }),
                    }),
                    (0, j.jsxs)("div", {
                      children: [
                        (0, j.jsxs)("p", {
                          className: "text-sm font-semibold",
                          children: [
                            "Drag & Drop Festival Banner Photo Here, or ",
                            (0, j.jsx)("span", { className: "text-primary underline", children: "Browse Files" }),
                          ],
                        }),
                        (0, j.jsx)("p", {
                          className: "text-xs text-muted-foreground mt-1",
                          children: "Supports PNG, JPG, WebP images (Ugadi, Diwali, Holi, Seasonal Banners)",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, j.jsxs)("div", {
                  className: "flex flex-col md:flex-row gap-3 items-end pt-2 border-t border-border/40",
                  children: [
                    (0, j.jsxs)("div", {
                      className: "flex-1 space-y-1",
                      children: [
                        (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Or Paste Festival Photo Image URL" }),
                        (0, j.jsx)(C, {
                          placeholder: "Paste festival banner image URL...",
                          value: bannerUrlInput,
                          onChange: (e) => setBannerUrlInput(e.target.value),
                          className: "h-10 text-xs",
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "flex flex-wrap gap-2",
                      children: [
                        (0, j.jsxs)(S, {
                          size: "sm",
                          className: "bg-primary text-primary-foreground font-bold text-xs h-10 px-6 shadow-md hover:opacity-90",
                          disabled: isSaving || (!bannerUrlInput.trim() && !dragImage),
                          onClick: handleAddPhoto,
                          children: [(0, j.jsx)(p, { className: "mr-2 h-4 w-4" }), " Upload Photo"],
                        }),
                        (0, j.jsx)(S, {
                          size: "sm",
                          variant: "outline",
                          className: "text-xs h-10",
                          onClick: () => {
                            setBannerUrlInput(
                              "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
                            );
                          },
                          children: "Sample Ugadi Photo",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, j.jsxs)("div", {
                  className: "space-y-3 pt-4 border-t border-border/40",
                  children: [
                    (0, j.jsxs)("div", {
                      className: "flex items-center justify-between",
                      children: [
                        (0, j.jsxs)(w, {
                          className: "text-sm font-bold flex items-center gap-2",
                          children: [
                            (0, j.jsx)(h, { className: "h-4 w-4 text-amber-500" }),
                            `Active POS Dashboard Carousel Photos (${carouselPhotos.length})`,
                          ],
                        }),
                        (0, j.jsx)("span", {
                          className: "text-xs text-muted-foreground",
                          children: "Auto-syncs to all active POS user devices",
                        }),
                      ],
                    }),
                    carouselPhotos.length === 0
                      ? (0, j.jsxs)("div", {
                          className:
                            "rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground space-y-2",
                          children: [
                            (0, j.jsx)("p", { className: "font-semibold text-foreground", children: "No photos in carousel yet." }),
                            (0, j.jsxs)("p", {
                              children: [
                                "Drag & drop or paste an image URL above and click ",
                                (0, j.jsx)("strong", { children: '"Upload Photo"' }),
                                " to activate.",
                              ],
                            }),
                          ],
                        })
                      : (0, j.jsx)("div", {
                          className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
                          children: carouselPhotos.map((url, index) =>
                            (0, j.jsxs)(
                              "div",
                              {
                                className:
                                  "group relative rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all",
                                children: [
                                  (0, j.jsx)("img", {
                                    src: url,
                                    alt: `Festival Photo ${index + 1}`,
                                    className: "h-32 w-full object-cover",
                                    onError: (e) => {
                                      e.target.src =
                                        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80";
                                    },
                                  }),
                                  (0, j.jsx)("div", {
                                    className: "absolute top-2 right-2",
                                    children: (0, j.jsx)(S, {
                                      size: "icon",
                                      variant: "destructive",
                                      className: "h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform",
                                      onClick: () => handleDeletePhoto(index),
                                      title: "Delete photo from carousel",
                                      children: (0, j.jsx)(g, { className: "h-4 w-4" }),
                                    }),
                                  }),
                                  (0, j.jsxs)("div", {
                                    className:
                                      "p-2.5 text-xs text-muted-foreground flex items-center justify-between font-mono bg-card border-t border-border/40",
                                    children: [
                                      (0, j.jsxs)("span", {
                                        className: "font-bold text-foreground",
                                        children: ["Photo #", index + 1],
                                      }),
                                      (0, j.jsx)(E, {
                                        variant: "outline",
                                        className: "text-[10px]",
                                        children: "Active Carousel",
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              index
                            )
                          ),
                        }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Create / Edit Theme Modal Dialog
        showModal &&
          (0, j.jsx)("div", {
            className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto",
            children: (0, j.jsxs)("div", {
              className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8",
              children: [
                (0, j.jsxs)("div", {
                  className: "p-5 border-b border-border/40 flex items-center justify-between bg-muted/20",
                  children: [
                    (0, j.jsxs)("h3", {
                      className: "font-bold text-lg flex items-center gap-2",
                      children: [
                        (0, j.jsx)(k, { className: "h-5 w-5 text-amber-500" }),
                        editingTheme ? "Edit Festival Theme" : "Create New Festival Theme",
                      ],
                    }),
                    (0, j.jsx)("button", {
                      onClick: () => setShowModal(false),
                      className: "text-muted-foreground hover:text-foreground p-1 rounded-lg text-sm font-bold",
                      children: "✕",
                    }),
                  ],
                }),
                (0, j.jsxs)("form", {
                  onSubmit: handleSaveTheme,
                  className: "p-6 space-y-4 max-h-[80vh] overflow-y-auto",
                  children: [
                    (0, j.jsxs)("div", {
                      className: "space-y-1.5",
                      children: [
                        (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Theme Name *" }),
                        (0, j.jsx)(C, {
                          placeholder: "e.g. Ugadi Special, Pongal Harvest, Onam Festive...",
                          value: formState.name,
                          onChange: (e) => setFormState({ ...formState, name: e.target.value }),
                          className: "h-10 text-xs",
                          required: true,
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "grid grid-cols-2 gap-3",
                      children: [
                        (0, j.jsxs)("div", {
                          className: "space-y-1.5",
                          children: [
                            (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Emoji / Icon" }),
                            (0, j.jsx)(C, {
                              placeholder: "e.g. 🌿, 🪔, 🎨, ❄️, 🌾",
                              value: formState.icon,
                              onChange: (e) => setFormState({ ...formState, icon: e.target.value }),
                              className: "h-10 text-xs",
                            }),
                          ],
                        }),
                        (0, j.jsxs)("div", {
                          className: "space-y-1.5",
                          children: [
                            (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Badge Text" }),
                            (0, j.jsx)(C, {
                              placeholder: "e.g. FESTIVAL OFFER",
                              value: formState.badge,
                              onChange: (e) => setFormState({ ...formState, badge: e.target.value }),
                              className: "h-10 text-xs",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "space-y-1.5",
                      children: [
                        (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Festive Greeting Message" }),
                        (0, j.jsx)(C, {
                          placeholder: "e.g. 🌿 Happy Ugadi! Wishing you peace & prosperity...",
                          value: formState.greeting,
                          onChange: (e) => setFormState({ ...formState, greeting: e.target.value }),
                          className: "h-10 text-xs",
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "space-y-1.5",
                      children: [
                        (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Tagline / Subtitle" }),
                        (0, j.jsx)(C, {
                          placeholder: "e.g. Fresh Mango Green & Gold",
                          value: formState.tagline,
                          onChange: (e) => setFormState({ ...formState, tagline: e.target.value }),
                          className: "h-10 text-xs",
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "grid grid-cols-2 gap-3",
                      children: [
                        (0, j.jsxs)("div", {
                          className: "space-y-1.5",
                          children: [
                            (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Primary Accent Color" }),
                            (0, j.jsxs)("div", {
                              className: "flex gap-2 items-center",
                              children: [
                                (0, j.jsx)("input", {
                                  type: "color",
                                  value: formState.accent || "#4F46E5",
                                  onChange: (e) => setFormState({ ...formState, accent: e.target.value }),
                                  className: "h-9 w-10 cursor-pointer rounded border p-0.5",
                                }),
                                (0, j.jsx)(C, {
                                  value: formState.accent,
                                  onChange: (e) => setFormState({ ...formState, accent: e.target.value }),
                                  className: "h-10 text-xs flex-1",
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, j.jsxs)("div", {
                          className: "space-y-1.5",
                          children: [
                            (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Badge BG Color" }),
                            (0, j.jsxs)("div", {
                              className: "flex gap-2 items-center",
                              children: [
                                (0, j.jsx)("input", {
                                  type: "color",
                                  value: formState.badgeBg || "#F59E0B",
                                  onChange: (e) => setFormState({ ...formState, badgeBg: e.target.value }),
                                  className: "h-9 w-10 cursor-pointer rounded border p-0.5",
                                }),
                                (0, j.jsx)(C, {
                                  value: formState.badgeBg,
                                  onChange: (e) => setFormState({ ...formState, badgeBg: e.target.value }),
                                  className: "h-10 text-xs flex-1",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "space-y-1.5",
                      children: [
                        (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Gradient Tailwind Classes" }),
                        (0, j.jsx)(C, {
                          placeholder: "from-[#064E3B] via-[#047857] to-[#D97706]",
                          value: formState.gradient,
                          onChange: (e) => setFormState({ ...formState, gradient: e.target.value }),
                          className: "h-10 text-xs font-mono",
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "space-y-1.5",
                      children: [
                        (0, j.jsx)(w, { className: "text-xs font-semibold", children: "Theme Description" }),
                        (0, j.jsx)(C, {
                          placeholder: "Description of this theme for admin reference...",
                          value: formState.description,
                          onChange: (e) => setFormState({ ...formState, description: e.target.value }),
                          className: "h-10 text-xs",
                        }),
                      ],
                    }),
                    (0, j.jsxs)("div", {
                      className: "flex items-center justify-end gap-2 pt-4 border-t border-border/40",
                      children: [
                        (0, j.jsx)(S, {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          onClick: () => setShowModal(false),
                          className: "h-9 text-xs",
                          children: "Cancel",
                        }),
                        (0, j.jsx)(S, {
                          type: "submit",
                          size: "sm",
                          className: "h-9 text-xs bg-primary text-primary-foreground font-bold px-5",
                          children: editingTheme ? "Update Theme" : "Save Custom Theme",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
      ],
    })
  );
}

export { N as component };