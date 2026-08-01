import { t as e, a as ReactPkg, n as ReactHooks } from "./jsx-runtime-C27Mmbu5.js";
import { n as useCustomers, f as useUpdatePrefs, s as usePrefs } from "./api-hooks-C4TwWEcD.js";
import { t as toast } from "./index-3XhaPVcd.js";
import { o as cn } from "./dist-DEZS4aoA.js";
import { t as BellIcon } from "./bell-ring-BvkkmKQN.js";
import { t as CircleXIcon } from "./circle-x-Dl7Ydo0c.js";
import { t as RefreshIcon } from "./refresh-cw-bZzMCMVs.js";
import { t as TriangleAlertIcon } from "./triangle-alert-CCMIwTOO.js";
import { t as UserPlusIcon } from "./user-plus-jvQ0jxQs.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CZHw3pFe.js";
import { t as Label } from "./label-88fOckeu.js";
import { t as Switch } from "./switch-0rCYyMZg.js";
import { t as Button } from "./button-BnY2mVfF.js";
import { t as Input } from "./input-B5hAaV97.js";
import { t as Badge } from "./badge-DhPwNmMz.js";
import { t as TrashIcon } from "./trash-2-J8L2GSzN.js";
import { a as o, i as s, n as c, r as l, t as u } from "./select-DSxH11I4.js";
import { s as notifApi, a as customerApi } from "./api-Kju_d4QL.js";

var jsx = e();
var useState = ReactHooks().useState;
var useEffect = ReactHooks().useEffect;

var typeConfigs = {
  expiry: { icon: TriangleAlertIcon, color: "bg-warning/15 text-warning" },
  warning: { icon: TriangleAlertIcon, color: "bg-amber-500/15 text-amber-600" },
  new: { icon: UserPlusIcon, color: "bg-success/15 text-success" },
  success: { icon: UserPlusIcon, color: "bg-emerald-500/15 text-emerald-600" },
  renewal: { icon: RefreshIcon, color: "bg-primary/15 text-primary" },
  reminder: { icon: BellIcon, color: "bg-blue-500/15 text-blue-600" },
  info: { icon: BellIcon, color: "bg-primary/15 text-primary" },
  failed: { icon: CircleXIcon, color: "bg-destructive/15 text-destructive" },
};

function formatTimeAgo(timestamp) {
  if (!timestamp) return "just now";
  let diff = Date.now() - new Date(timestamp).getTime();
  let mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  let hours = Math.floor(mins / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}

function NotificationsComponent() {
  let { data: customers = [] } = useCustomers();
  let [notificationsList, setNotificationsList] = useState([]);
  let [loading, setLoading] = useState(false);

  // Form states for sending notification
  let [showSendModal, setShowSendModal] = useState(false);
  let [selectedCustomer, setSelectedCustomer] = useState("all");
  let [notifTitle, setNotifTitle] = useState("Important Notice from Admin");
  let [notifType, setNotifType] = useState("info");
  let [notifMessage, setNotifMessage] = useState("");
  let [isSending, setIsSending] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notifApi.list();
      if (Array.isArray(res)) {
        setNotificationsList(res);
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifMessage.trim()) {
      toast.error("Please type a message before sending!");
      return;
    }

    setIsSending(true);
    try {
      let payload = {
        title: notifTitle.trim() || "Admin Notification",
        message: notifMessage.trim(),
        type: notifType,
        customer_id: selectedCustomer === "all" ? null : selectedCustomer,
        user_id: selectedCustomer === "all" ? null : selectedCustomer,
        target: selectedCustomer === "all" ? "all" : "user",
      };

      await notifApi.create(payload);

      let targetText = "All POS Users";
      if (selectedCustomer !== "all") {
        const custObj = (customers || []).find((c) => String(c.id) === String(selectedCustomer));
        targetText = custObj?.businessName || `User #${selectedCustomer}`;
      }

      toast.success(`Notification sent successfully to ${targetText}!`, {
        description: "The user will see this message inside their dashboard notification bell icon.",
      });

      setShowSendModal(false);
      setNotifMessage("");
      setNotifTitle("Important Notice from Admin");
      fetchNotifications();
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteNotification = async (noteId) => {
    try {
      const apiHost = window.ENV_API_URL || (window.location.port === "3000" || window.location.port === "8080" ? `${window.location.protocol}//${window.location.hostname}:5000/api` : `${window.location.origin}/api`);
      let res = await fetch(`${apiHost}/notifications/${noteId}`, { method: "DELETE" });
      if (!res.ok) {
        res = await fetch(`/api/notifications/${noteId}`, { method: "DELETE" });
      }
      toast.success("Deleted notification");
      setNotificationsList((prev) => prev.filter((n) => n.id !== noteId));
    } catch (e) {
      console.error(e);
      setNotificationsList((prev) => prev.filter((n) => n.id !== noteId));
    }
  };

  return (
    jsx.jsxs("div", {
      className: "space-y-6",
      children: [
        // Title Header
        jsx.jsxs("div", {
          className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          children: [
            jsx.jsxs("div", {
              children: [
                jsx.jsx("h1", {
                  className: "text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2",
                  children: [
                    jsx.jsx(BellIcon, { className: "h-7 w-7 text-primary" }),
                    "Notifications & Alerts",
                  ],
                }),
                jsx.jsx("p", {
                  className: "mt-1 text-sm text-muted-foreground",
                  children:
                    "Send direct notifications to specific POS users or broadcast storewide messages with instant device alerts.",
                }),
              ],
            }),
            jsx.jsxs(Button, {
              onClick: () => setShowSendModal(true),
              className: "bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90 flex items-center gap-2 self-start sm:self-auto",
              children: [
                jsx.jsx(BellIcon, { className: "h-4 w-4" }),
                "Send Notification to POS User",
              ],
            }),
          ],
        }),

        // Quick Direct Notification Box Card
        jsx.jsxs(Card, {
          className: "border-primary/40 bg-gradient-to-r from-primary/5 via-background to-primary/5 shadow-sm",
          children: [
            jsx.jsxs(CardHeader, {
              className: "pb-3 border-b border-border/40 flex flex-row items-center justify-between",
              children: [
                jsx.jsxs(CardTitle, {
                  className: "text-base flex items-center gap-2",
                  children: [
                    jsx.jsx(BellIcon, { className: "h-5 w-5 text-primary" }),
                    "Send Direct Alert to Selected POS User",
                  ],
                }),
                jsx.jsx(Badge, { variant: "outline", className: "text-xs border-primary text-primary font-semibold", children: "Live POS Push" }),
              ],
            }),
            jsx.jsx(CardContent, {
              className: "p-6",
              children: jsx.jsxs("form", {
                onSubmit: handleSendNotification,
                className: "space-y-4",
                children: [
                  jsx.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [
                      // Customer Dropdown
                      jsx.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          jsx.jsx(Label, { className: "text-xs font-semibold", children: "Select POS User / Store *" }),
                          jsx.jsxs(u, {
                            value: selectedCustomer,
                            onValueChange: setSelectedCustomer,
                            children: [
                              jsx.jsx(s, { className: "h-10 text-xs bg-card", children: jsx.jsx(o, {}) }),
                              jsx.jsxs(c, {
                                className: "max-h-[250px]",
                                children: [
                                  jsx.jsx(l, { value: "all", children: "🌐 All POS Users (Storewide Broadcast)" }),
                                  (customers || []).map((cust) =>
                                    jsx.jsxs(l, {
                                      value: String(cust.id).replace("CUS-", ""),
                                      children: ["🏪 ", cust.businessName || cust.name || `Store #${cust.id}`, " (CUS-", cust.id, ")"],
                                    }, cust.id)
                                  ),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      // Title Input
                      jsx.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          jsx.jsx(Label, { className: "text-xs font-semibold", children: "Notification Title *" }),
                          jsx.jsx(Input, {
                            placeholder: "e.g. Plan Expiry Warning, Offer Update...",
                            value: notifTitle,
                            onChange: (e) => setNotifTitle(e.target.value),
                            className: "h-10 text-xs bg-card",
                            required: true,
                          }),
                        ],
                      }),
                      // Type Select
                      jsx.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          jsx.jsx(Label, { className: "text-xs font-semibold", children: "Alert Type" }),
                          jsx.jsxs(u, {
                            value: notifType,
                            onValueChange: setNotifType,
                            children: [
                              jsx.jsx(s, { className: "h-10 text-xs bg-card", children: jsx.jsx(o, {}) }),
                              jsx.jsxs(c, {
                                children: [
                                  jsx.jsx(l, { value: "info", children: "ℹ️ Info / Announcement" }),
                                  jsx.jsx(l, { value: "warning", children: "⚠️ Warning / Reminder" }),
                                  jsx.jsx(l, { value: "success", children: "✅ Success / Special Offer" }),
                                  jsx.jsx(l, { value: "reminder", children: "🔔 Subscription Reminder" }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Message Text Area
                  jsx.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      jsx.jsx(Label, { className: "text-xs font-semibold", children: "Notification Message Text Box *" }),
                      jsx.jsx("textarea", {
                        rows: 3,
                        placeholder: "Type your notification message here. When sent, this message will display directly inside the user's dashboard notification bell icon in the POS application...",
                        value: notifMessage,
                        onChange: (e) => setNotifMessage(e.target.value),
                        className: "w-full rounded-md border border-input bg-card px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
                        required: true,
                      }),
                    ],
                  }),
                  // Submit Button
                  jsx.jsxs("div", {
                    className: "flex justify-end gap-2 pt-2",
                    children: [
                      jsx.jsxs(Button, {
                        type: "submit",
                        disabled: isSending,
                        className: "bg-primary text-primary-foreground font-bold text-xs h-9 px-6 shadow-md hover:opacity-90 flex items-center gap-2",
                        children: [
                          jsx.jsx(BellIcon, { className: "h-4 w-4" }),
                          isSending ? "Sending Notification..." : "Send Notification Now",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),

        // Recent Sent Notifications List
        jsx.jsxs(Card, {
          className: "border-border bg-card shadow-sm",
          children: [
            jsx.jsxs(CardHeader, {
              className: "pb-3 border-b border-border/40 flex items-center justify-between",
              children: [
                jsx.jsxs(CardTitle, {
                  className: "text-base flex items-center gap-2",
                  children: [
                    jsx.jsx(BellIcon, { className: "h-4 w-4 text-primary" }),
                    `Sent Notifications History (${notificationsList.length})`,
                  ],
                }),
                jsx.jsx(Button, {
                  size: "sm",
                  variant: "ghost",
                  onClick: fetchNotifications,
                  className: "h-8 text-xs text-muted-foreground hover:text-foreground",
                  children: "🔄 Refresh",
                }),
              ],
            }),
            jsx.jsx(CardContent, {
              className: "p-4",
              children:
                notificationsList.length === 0
                  ? jsx.jsx("p", {
                      className: "py-8 text-center text-sm text-muted-foreground",
                      children: "No notifications sent yet.",
                    })
                  : jsx.jsx("ul", {
                      className: "divide-y divide-border/60",
                      children: notificationsList.map((item) => {
                        let conf = typeConfigs[item.type] ?? {
                          icon: BellIcon,
                          color: "bg-muted text-muted-foreground",
                        };
                        let IconComponent = conf.icon;
                        return jsx.jsxs(
                          "li",
                          {
                            className: "flex items-start justify-between gap-4 py-3.5 hover:bg-muted/20 px-2 rounded-lg transition-colors",
                            children: [
                              jsx.jsxs("div", {
                                className: "flex items-start gap-3 min-w-0 flex-1",
                                children: [
                                  jsx.jsx("div", {
                                    className: cn(
                                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold shadow-sm",
                                      conf.color
                                    ),
                                    children: jsx.jsx(IconComponent, { className: "h-5 w-5" }),
                                  }),
                                  jsx.jsxs("div", {
                                    className: "min-w-0 flex-1 space-y-1",
                                    children: [
                                      jsx.jsxs("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                          jsx.jsx("span", {
                                            className: "font-semibold text-sm text-foreground",
                                            children: item.title || "Notification",
                                          }),
                                          jsx.jsx(Badge, {
                                            variant: "secondary",
                                            className: "text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5",
                                            children: item.targetUser || item.target_user || (item.user_id ? `User #${item.user_id}` : "All POS Users"),
                                          }),
                                        ],
                                      }),
                                      jsx.jsx("p", {
                                        className: "text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed",
                                        children: item.message || item.desc || "",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              jsx.jsxs("div", {
                                className: "flex items-center gap-2 shrink-0 self-center",
                                children: [
                                  jsx.jsx("span", {
                                    className: "text-[11px] text-muted-foreground font-mono",
                                    children: item.time_ago || formatTimeAgo(item.created_at || item.time),
                                  }),
                                  jsx.jsx(Button, {
                                    size: "icon",
                                    variant: "ghost",
                                    onClick: () => handleDeleteNotification(item.id),
                                    className: "h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full",
                                    title: "Delete Notification",
                                    children: jsx.jsx(TrashIcon, { className: "h-4 w-4" }),
                                  }),
                                ],
                              }),
                            ],
                          },
                          item.id
                        );
                      }),
                    }),
            }),
          ],
        }),

        // Modal Form for Sending Notification
        showSendModal &&
          jsx.jsx("div", {
            className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto",
            children: jsx.jsxs("div", {
              className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8",
              children: [
                jsx.jsxs("div", {
                  className: "p-5 border-b border-border/40 flex items-center justify-between bg-muted/20",
                  children: [
                    jsx.jsxs("h3", {
                      className: "font-bold text-lg flex items-center gap-2",
                      children: [
                        jsx.jsx(BellIcon, { className: "h-5 w-5 text-primary" }),
                        "Send Notification to POS User",
                      ],
                    }),
                    jsx.jsx("button", {
                      onClick: () => setShowSendModal(false),
                      className: "text-muted-foreground hover:text-foreground p-1 rounded-lg text-sm font-bold",
                      children: "✕",
                    }),
                  ],
                }),
                jsx.jsxs("form", {
                  onSubmit: handleSendNotification,
                  className: "p-6 space-y-4 max-h-[80vh] overflow-y-auto",
                  children: [
                    jsx.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        jsx.jsx(Label, { className: "text-xs font-semibold", children: "Select Target POS User *" }),
                        jsx.jsxs(u, {
                          value: selectedCustomer,
                          onValueChange: setSelectedCustomer,
                          children: [
                            jsx.jsx(s, { className: "h-10 text-xs bg-card", children: jsx.jsx(o, {}) }),
                            jsx.jsxs(c, {
                              className: "max-h-[250px]",
                              children: [
                                jsx.jsx(l, { value: "all", children: "🌐 All POS Users (Storewide Broadcast)" }),
                                (customers || []).map((cust) =>
                                  jsx.jsxs(l, {
                                    value: String(cust.id).replace("CUS-", ""),
                                    children: ["🏪 ", cust.businessName || cust.name || `Store #${cust.id}`, " (CUS-", cust.id, ")"],
                                  }, cust.id)
                                ),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsx.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        jsx.jsx(Label, { className: "text-xs font-semibold", children: "Title *" }),
                        jsx.jsx(Input, {
                          placeholder: "e.g. System Update, Subscription Alert...",
                          value: notifTitle,
                          onChange: (e) => setNotifTitle(e.target.value),
                          className: "h-10 text-xs bg-card",
                          required: true,
                        }),
                      ],
                    }),
                    jsx.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        jsx.jsx(Label, { className: "text-xs font-semibold", children: "Notification Type" }),
                        jsx.jsxs(u, {
                          value: notifType,
                          onValueChange: setNotifType,
                          children: [
                            jsx.jsx(s, { className: "h-10 text-xs bg-card", children: jsx.jsx(o, {}) }),
                            jsx.jsxs(c, {
                              children: [
                                jsx.jsx(l, { value: "info", children: "ℹ️ Info / Announcement" }),
                                jsx.jsx(l, { value: "warning", children: "⚠️ Warning / Reminder" }),
                                jsx.jsx(l, { value: "success", children: "✅ Success / Special Offer" }),
                                jsx.jsx(l, { value: "reminder", children: "🔔 Subscription Reminder" }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    jsx.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        jsx.jsx(Label, { className: "text-xs font-semibold", children: "Message Content *" }),
                        jsx.jsx("textarea", {
                          rows: 4,
                          placeholder: "Type your message text here...",
                          value: notifMessage,
                          onChange: (e) => setNotifMessage(e.target.value),
                          className: "w-full rounded-md border border-input bg-card px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
                          required: true,
                        }),
                      ],
                    }),
                    jsx.jsxs("div", {
                      className: "flex items-center justify-end gap-2 pt-4 border-t border-border/40",
                      children: [
                        jsx.jsx(Button, {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          onClick: () => setShowSendModal(false),
                          className: "h-9 text-xs",
                          children: "Cancel",
                        }),
                        jsx.jsx(Button, {
                          type: "submit",
                          disabled: isSending,
                          size: "sm",
                          className: "h-9 text-xs bg-primary text-primary-foreground font-bold px-5",
                          children: isSending ? "Sending..." : "Send Notification",
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

export { NotificationsComponent as component };