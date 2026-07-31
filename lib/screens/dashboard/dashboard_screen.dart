import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/db_provider.dart';
import '../../core/api_client.dart';
import 'widgets/custom_chart.dart';
import '../../core/theme.dart';
import '../billing/bill_success_dialog.dart';
import '../products/add_product_screen.dart';
import '../../services/notification_service.dart';

class DashboardScreen extends StatelessWidget {
  final Function(int)? onNavigate;
  final VoidCallback? onOpenDrawer;

  const DashboardScreen({
    super.key,
    this.onNavigate,
    this.onOpenDrawer,
  });

  void _showNotificationsDialog(BuildContext context, DbProvider db) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.7,
          decoration: BoxDecoration(
            color: Theme.of(context).scaffoldBackgroundColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade400,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.notifications_active_outlined, color: Colors.amber),
                        const SizedBox(width: 8),
                        Text(
                          'Notifications & Reminders',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              Expanded(
                child: db.userNotifications.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.notifications_off_outlined, size: 48, color: Colors.grey.shade400),
                            const SizedBox(height: 12),
                            Text('No notifications yet', style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: db.userNotifications.length,
                        itemBuilder: (context, index) {
                          final note = db.userNotifications[index];
                          final int noteId = note['id'] is int
                              ? note['id']
                              : (int.tryParse(note['id'].toString()) ?? 0);
                          final String title = note['title']?.toString() ?? 'Reminder';
                          final String message = note['message']?.toString() ?? '';
                          final bool isRead = note['read'] == true || note['read'].toString() == 'true';

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            elevation: isRead ? 0 : 2,
                            color: isRead
                                ? null
                                : Theme.of(context)
                                    .colorScheme
                                    .primaryContainer
                                    .withValues(alpha: 0.15),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: isRead
                                    ? Colors.grey.shade300
                                    : Theme.of(context)
                                        .colorScheme
                                        .primary
                                        .withValues(alpha: 0.5),
                              ),
                            ),
                            child: ListTile(
                              contentPadding:
                                  const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              leading: CircleAvatar(
                                backgroundColor: isRead ? Colors.grey.shade200 : Colors.amber.shade100,
                                child: Icon(
                                  Icons.mark_email_unread_outlined,
                                  color: isRead ? Colors.grey : Colors.amber.shade800,
                                ),
                              ),
                              title: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      title,
                                      style: TextStyle(
                                        fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  if (!isRead)
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: Colors.amber,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                ],
                              ),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 6),
                                child: Text(
                                  message,
                                  style: TextStyle(
                                    color: isRead
                                        ? Colors.grey.shade700
                                        : Theme.of(context).colorScheme.onSurface,
                                    fontSize: 13,
                                    height: 1.3,
                                  ),
                                ),
                              ),
                              onTap: () {
                                if (!isRead && noteId > 0) {
                                  db.markNotificationRead(noteId);
                                }
                                NotificationService.handleNotificationTap(
                                  title: title,
                                  body: message,
                                  payload: jsonEncode(note),
                                );
                              },
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final theme = Theme.of(context);

    // Aggregates for Metric Cards
    final double todaySales = db.getTodaySalesAmount();
    final double monthlySales = db.getMonthlySalesAmount();
    final double totalRevenue = db.invoices.fold(0.0, (sum, inv) => sum + inv.grandTotal);
    final int todayBills = db.getTodayBillsCount();
    final int totalProducts = db.products.length;
    final int lowStockCount = db.getLowStockCount();
    final int outOfStockCount = db.getOutOfStockCount();

    // Trend calculations (last 7 days)
    final List<String> dailyLabels = [];
    final List<double> dailyValues = [];
    final now = DateTime.now();
    for (int i = 6; i >= 0; i--) {
      final date = now.subtract(Duration(days: i));
      dailyLabels.add(DateFormat('E').format(date)); // E.g., Mon, Tue
      final daySales = db.invoices
          .where((inv) =>
              inv.dateTime.year == date.year &&
              inv.dateTime.month == date.month &&
              inv.dateTime.day == date.day)
          .fold(0.0, (sum, inv) => sum + inv.grandTotal);
      dailyValues.add(daySales);
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
        title: FittedBox(
          fit: BoxFit.scaleDown,
          child: Column(
            children: [
              Text(
                auth.currentUser?.businessName ?? 'ApexPOS',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: db.isSyncing
                          ? Colors.amber
                          : (db.isOnline ? Colors.green : Colors.orange),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    db.isSyncing
                        ? 'Syncing to cloud...'
                        : (!db.isOnline
                            ? 'Offline (Saved locally)'
                            : db.lastSynced != null
                                ? 'Synced: ${DateFormat('hh:mm a').format(db.lastSynced!)}'
                                : 'Online'),
                    style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                  ),
                ],
              ),
            ],
          ),
        ),
        actions: [
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                tooltip: 'Notifications & Reminders',
                onPressed: () => _showNotificationsDialog(context, db),
              ),
              if (db.unreadNotificationsCount > 0)
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.redAccent,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Text(
                      '${db.unreadNotificationsCount}',
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          IconButton(
            icon: Icon(db.isDarkTheme ? Icons.light_mode : Icons.dark_mode),
            tooltip: 'Toggle Dark/Light Mode',
            onPressed: () => db.toggleTheme(),
          ),
          IconButton(
            icon: db.isSyncing
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.sync),
            tooltip: 'Sync Database Now',
            onPressed: db.isSyncing
                ? null
                : () async {
                    final success = await db.syncCloud(silent: false);
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).hideCurrentSnackBar();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            success
                                ? 'Database synced with cloud successfully!'
                                : 'Offline Mode: Sales saved locally. Auto-syncing when online.',
                          ),
                          backgroundColor: success ? Colors.green.shade700 : Colors.orange.shade800,
                          duration: const Duration(seconds: 3),
                        ),
                      );
                    }
                  },
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final double totalWidth = constraints.maxWidth > 32 ? constraints.maxWidth - 32 : constraints.maxWidth;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Account Suspended Banner Notice
                if (db.isSuspended)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.shade900.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.redAccent, width: 1.5),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.shield_outlined, color: Colors.white, size: 36),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'ACCOUNT SUSPENDED',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.8),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                db.suspendedMessage.isNotEmpty
                                    ? db.suspendedMessage
                                    : 'Your subscription is temporarily disabled. Account and data are preserved, but access is restricted until reactivated by super admin.',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                // Header banner
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Overview Dashboard',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Track sales, check alerts, and monitor inventory levels.',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                // Active Festival Banner
                _buildFestivalBanner(context, db),

                // Top Advertisement Banner Carousel
                AdvertisementCarouselWidget(ads: db.advertisements),
                const SizedBox(height: 16),

                // Dynamic grid layout rendered in 12 columns
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: db.getDashboardWidgets().map((widgetMap) {
                    final String type = widgetMap['type'] ?? '';
                    final String title = widgetMap['label'] ?? '';
                    final int span = (widgetMap['w'] as num?)?.toInt() ?? (type.contains('chart') || type == 'recent_bills' || type == 'quick_actions' || type == 'pending_payments' ? 12 : 6);
                    final double width = _getWidgetWidth(span, totalWidth, 12, type);

                    Widget child;
                    if (type == 'sales_card') {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Today's Sales",
                        value: "₹${todaySales.toStringAsFixed(1)}",
                        icon: Icons.today,
                        color: Colors.indigo,
                        onTap: () => onNavigate?.call(5), // Sales History
                      );
                    } else if (type == 'profit_card') {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Monthly Sales",
                        value: "₹${monthlySales.toStringAsFixed(1)}",
                        icon: Icons.calendar_month,
                        color: Colors.blue,
                        onTap: () => onNavigate?.call(6), // Reports
                      );
                    } else if (type == 'inventory_card') {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Revenue",
                        value: "₹${totalRevenue.toStringAsFixed(1)}",
                        icon: Icons.account_balance_wallet,
                        color: Colors.teal,
                        onTap: () => onNavigate?.call(6), // Reports
                      );
                    } else if (type == 'low_stock_card') {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Bills Today",
                        value: "$todayBills",
                        icon: Icons.receipt_long,
                        color: Colors.purple,
                        onTap: () => onNavigate?.call(1), // POS Billing
                      );
                    } else if (type == 'customer_count') {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Total Products",
                        value: "$totalProducts",
                        icon: Icons.inventory_2,
                        color: Colors.deepOrange,
                        onTap: () => onNavigate?.call(2), // Products
                      );
                    } else if (type == 'employee_count') {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Low Stock Alert",
                        value: "$lowStockCount",
                        icon: Icons.warning_amber_rounded,
                        color: lowStockCount > 0 ? Colors.amber : Colors.grey,
                        isAlert: lowStockCount > 0,
                        onTap: () => onNavigate?.call(4), // Inventory
                      );
                    } else if (type == 'recent_bills') {
                      child = _buildRecentBillsCard(context, db, theme);
                    } else if (type == 'sales_chart') {
                      child = CustomTrendChart(
                        title: title.isNotEmpty ? title : 'Daily Sales (Last 7 Days)',
                        data: dailyValues,
                        labels: dailyLabels,
                        chartColor: Colors.indigo,
                      );
                    } else if (type == 'quick_actions') {
                      child = _buildQuickActionsCard(context, theme);
                    } else if (type == 'pending_payments') {
                      child = _buildPendingPaymentsCard(context, theme);
                    } else {
                      child = _buildMetricCard(
                        context,
                        title: title.isNotEmpty ? title : "Out of Stock",
                        value: "$outOfStockCount",
                        icon: Icons.error_outline,
                        color: outOfStockCount > 0 ? Colors.red : Colors.grey,
                        isAlert: outOfStockCount > 0,
                        onTap: () => onNavigate?.call(4), // Inventory
                      );
                    }

                    return SizedBox(
                      width: width,
                      child: child,
                    );
                  }).toList(),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFestivalBanner(BuildContext context, DbProvider db) {
    final fest = db.festivalTheme;

    // Gather active uploaded festival banner photos
    List<String> bannerPhotos = List<String>.from(db.festivalBannerImages);

    // Render Auto-Sliding Carousel if festival photos are active
    if (bannerPhotos.isNotEmpty) {
      return Container(
        width: double.infinity,
        height: 165,
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: fest.primaryAccent.withValues(alpha: 0.25),
              blurRadius: 14,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            children: [
              PageView.builder(
                itemCount: bannerPhotos.length,
                itemBuilder: (context, index) {
                  final String imageUrl = ApiClient.resolveImageUrl(bannerPhotos[index]);
                  return Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        imageUrl,
                        headers: const {'ngrok-skip-browser-warning': 'true'},
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: fest.bannerGradient.first,
                            child: Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(fest.icon, color: Colors.white, size: 42),
                                  const SizedBox(height: 6),
                                  Text(
                                    fest.title,
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                      if (bannerPhotos.length > 1)
                        Positioned(
                          top: 10,
                          right: 10,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.6),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${index + 1} / ${bannerPhotos.length}',
                              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      );
    }

    // Hide if standard theme with no uploaded photos
    if (fest.key == 'standard') {
      return const SizedBox.shrink();
    }

    // Festive illustration / gradient card when festival theme is active without custom photos
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: fest.bannerGradient,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: fest.primaryAccent.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(fest.icon, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        fest.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: fest.badgeColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'ACTIVE FESTIVAL THEME',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  fest.greeting,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  double _getWidgetWidth(int span, double totalWidth, double spacing, [String? type]) {
    if (totalWidth <= 0) return 0.0;
    
    // Full-width widgets (charts, recent bills, quick actions, pending payments)
    if (span >= 12) return totalWidth;

    // Complex cards like recent_bills, quick_actions, pending_payments, sales_chart should always take full width on mobile screens (< 600px)
    if (totalWidth < 600 && (type == 'recent_bills' || type == 'quick_actions' || type == 'pending_payments' || type == 'sales_chart' || type?.contains('chart') == true)) {
      return totalWidth;
    }

    // Small Phones (320px - 440px): 2 columns or 1 column depending on space
    if (totalWidth < 440) {
      final double widthTwoCol = (totalWidth - spacing) / 2;
      return widthTwoCol > 140 ? widthTwoCol : totalWidth;
    }
    
    // Medium Phones & Small Tablets (440px - 768px): 2 columns
    if (totalWidth < 768) {
      return (totalWidth - spacing) / 2;
    }
    
    // Tablets & Laptops (768px - 1200px): 3 or 4 columns
    if (totalWidth < 1200) {
      return (totalWidth - (3 * spacing)) / 4;
    }

    // Large Desktops (1200px+): 4 to 6 columns
    return (totalWidth - (3 * spacing)) / 4;
  }

  Widget _buildMetricCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    bool isAlert = false,
    VoidCallback? onTap,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color bg;
    if (isAlert) {
      bg = color.withValues(alpha: isDark ? 0.15 : 0.08);
    } else {
      bg = isDark ? const Color(0xFF1E293B) : Colors.white;
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isAlert
                  ? color.withValues(alpha: 0.4)
                  : (isDark ? Slate.shade800 : Colors.grey.shade100),
              width: isAlert ? 1.5 : 1,
            ),
            boxShadow: isAlert
                ? []
                : [
                    BoxShadow(
                      color: isDark ? Colors.black.withValues(alpha: 0.1) : Colors.grey.shade100,
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    )
                  ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: isDark ? Slate.shade400 : Slate.shade500,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.2,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        icon,
                        color: color,
                        size: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    value,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isAlert ? color : (isDark ? Colors.white : Slate.shade900),
                      letterSpacing: -0.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRecentBillsCard(BuildContext context, DbProvider db, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;
    final recentInvoices = db.invoices.take(4).toList();
    
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? Slate.shade800 : Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Recent Invoices',
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              TextButton(
                onPressed: () => onNavigate?.call(5),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('View All', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (recentInvoices.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12.0),
              child: Text('No recent invoices generated.', style: TextStyle(color: Colors.grey, fontSize: 13)),
            )
          else
            ...recentInvoices.map((inv) => Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (_) => BillSuccessDialog(invoice: inv),
                      );
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  inv.invoiceNumber,
                                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  DateFormat('hh:mm a, dd MMM').format(inv.dateTime),
                                  style: const TextStyle(color: Colors.grey, fontSize: 11),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Text(
                                  '₹${inv.grandTotal.toStringAsFixed(1)}',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                                ),
                              ),
                              const SizedBox(width: 4),
                              const Icon(Icons.chevron_right_rounded, size: 18, color: Colors.grey),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                )),
        ],
      ),
    );
  }

  Widget _buildQuickActionsCard(BuildContext context, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? Slate.shade800 : Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => onNavigate?.call(1), // POS Billing
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(0, 44),
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                  ),
                  icon: const Icon(Icons.receipt_long, size: 16),
                  label: const FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text('New Bill', style: TextStyle(fontSize: 12)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (ctx) => const AddEditProductScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(0, 44),
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                  ),
                  icon: const Icon(Icons.add, size: 16),
                  label: const FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text('Add Product', style: TextStyle(fontSize: 12)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPendingPaymentsCard(BuildContext context, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;
    final db = Provider.of<DbProvider>(context);
    final activeDues = db.creditDues.where((d) => d.status != 'PAID').toList();

    // Sort dues so overdue/urgent items appear first
    activeDues.sort((a, b) {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return b.dueDate.compareTo(a.dueDate);
    });

    final displayDues = activeDues.take(4).toList();

    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? Slate.shade800 : Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Text(
                      'Pending Payments',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (activeDues.isNotEmpty) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.orange.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '${activeDues.length}',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.orange.shade800,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(width: 8),
              TextButton(
                onPressed: () => onNavigate?.call(5),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('View Ledger', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (displayDues.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.check_circle_outline, color: Colors.green, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'All dues cleared!',
                      style: TextStyle(
                        color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            ...displayDues.asMap().entries.map((entry) {
              final idx = entry.key;
              final due = entry.value;
              final isOverdue = due.isOverdue;

              return Column(
                children: [
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => onNavigate?.call(5),
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    due.customerName,
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  if (due.invoiceNumber.isNotEmpty || due.customerPhone.isNotEmpty)
                                    Text(
                                      due.invoiceNumber.isNotEmpty ? due.invoiceNumber : due.customerPhone,
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  '₹${due.dueAmount.toStringAsFixed(1)}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: isOverdue ? Colors.red : Colors.orange.shade700,
                                  ),
                                ),
                                if (isOverdue)
                                  const Text(
                                    'OVERDUE',
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red,
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  if (idx < displayDues.length - 1) const Divider(height: 1),
                ],
              );
            }),
        ],
      ),
    );
  }
}

class AdvertisementCarouselWidget extends StatefulWidget {
  final List<Map<String, dynamic>> ads;
  const AdvertisementCarouselWidget({super.key, required this.ads});

  @override
  State<AdvertisementCarouselWidget> createState() => _AdvertisementCarouselWidgetState();
}

class _AdvertisementCarouselWidgetState extends State<AdvertisementCarouselWidget> {
  late PageController _pageController;
  int _currentIndex = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    if (widget.ads.length <= 1) return;
    _timer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (!mounted || widget.ads.isEmpty) return;
      final nextIndex = (_currentIndex + 1) % widget.ads.length;
      _pageController.animateToPage(
        nextIndex,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void didUpdateWidget(covariant AdvertisementCarouselWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.ads.length != widget.ads.length) {
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.ads.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        SizedBox(
          height: 140,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() => _currentIndex = index);
            },
            itemCount: widget.ads.length,
            itemBuilder: (context, index) {
              final ad = widget.ads[index];
              final title = ad['title'] ?? ad['headline'] ?? 'Special Announcement';
              final subtitle = ad['subtitle'] ?? ad['description'] ?? '';
              final badge = ad['badge'] ?? 'PROMO';
              final ctaText = ad['ctaText'] ?? 'Learn More';
              final ctaLink = ad['ctaLink'] ?? ad['cta_link'] ?? '';
              final imageUrl = ad['imageUrl'] ?? ad['image_url'] ?? '';

              return InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  if (ctaLink.toString().trim().isNotEmpty) {
                    _openAdLink(context, ctaLink.toString());
                  } else {
                    _showAdDetailsDialog(context, title.toString(), subtitle.toString(), imageUrl.toString(), ctaLink.toString(), ctaText.toString());
                  }
                },
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF1E1B4B), // Deep Slate Navy
                        const Color(0xFF312E81),
                        const Color(0xFF4338CA), // Vibrant Indigo
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF4338CA).withOpacity(0.35),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(14.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF59E0B), // Amber accent
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      badge.toString().toUpperCase(),
                                      style: const TextStyle(
                                        color: Colors.black,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                title.toString(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                subtitle.toString(),
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.85),
                                  fontSize: 11,
                                  height: 1.2,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildBannerImage(imageUrl.toString()),
                              const SizedBox(height: 6),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFF59E0B),
                                  foregroundColor: Colors.black,
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  minimumSize: Size.zero,
                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  elevation: 2,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                onPressed: () {
                                  if (ctaLink.toString().trim().isNotEmpty) {
                                    _openAdLink(context, ctaLink.toString());
                                  } else {
                                    _showAdDetailsDialog(context, title.toString(), subtitle.toString(), imageUrl.toString(), ctaLink.toString(), ctaText.toString());
                                  }
                                },
                                icon: Icon(
                                  ctaLink.toString().trim().isNotEmpty ? Icons.open_in_new : Icons.info_outline,
                                  size: 12,
                                  color: Colors.black,
                                ),
                                label: Text(
                                  ctaText.toString(),
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        if (widget.ads.length > 1)
          Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                widget.ads.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: _currentIndex == i ? 18 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: _currentIndex == i
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Future<void> _openAdLink(BuildContext context, String? rawUrl) async {
    if (rawUrl == null || rawUrl.trim().isEmpty) return;
    String formattedUrl = rawUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://$formattedUrl';
    }
    final uri = Uri.tryParse(formattedUrl);
    if (uri != null) {
      try {
        bool launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
        if (!launched) {
          launched = await launchUrl(uri, mode: LaunchMode.platformDefault);
        }
      } catch (e) {
        debugPrint("Error launching external app, trying default mode: $e");
        try {
          await launchUrl(uri, mode: LaunchMode.platformDefault);
        } catch (err) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Could not open website: $formattedUrl')),
            );
          }
        }
      }
    }
  }

  void _showAdDetailsDialog(BuildContext context, String title, String subtitle, String imageUrl, String ctaLink, String ctaText) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDialogImage(imageUrl),
            const SizedBox(height: 12),
            Text(subtitle),
          ],
        ),
        actions: [
          if (ctaLink.trim().isNotEmpty)
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: Colors.black,
              ),
              onPressed: () {
                Navigator.pop(ctx);
                _openAdLink(context, ctaLink);
              },
              icon: const Icon(Icons.open_in_new, size: 14),
              label: Text(ctaText.isNotEmpty ? ctaText : 'Visit Website'),
            ),
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildBannerImage(String rawImageUrl) {
    final imageUrl = ApiClient.resolveImageUrl(rawImageUrl);
    if (imageUrl.isEmpty) {
      return Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(Icons.campaign, color: Colors.amber, size: 32),
      );
    }

    if (imageUrl.startsWith('data:image') || imageUrl.contains(';base64,')) {
      try {
        final base64Str = imageUrl.split(',').last;
        final bytes = base64Decode(base64Str);
        return ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.memory(
            bytes,
            width: 56,
            height: 56,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.campaign, color: Colors.amber, size: 32),
            ),
          ),
        );
      } catch (_) {}
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Image.network(
        imageUrl,
        width: 56,
        height: 56,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.campaign, color: Colors.amber, size: 32),
        ),
      ),
    );
  }

  Widget _buildDialogImage(String rawImageUrl) {
    final imageUrl = ApiClient.resolveImageUrl(rawImageUrl);
    if (imageUrl.isEmpty) return const SizedBox.shrink();

    if (imageUrl.startsWith('data:image') || imageUrl.contains(';base64,')) {
      try {
        final base64Str = imageUrl.split(',').last;
        final bytes = base64Decode(base64Str);
        return ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.memory(
            bytes,
            height: 140,
            width: double.infinity,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => const SizedBox.shrink(),
          ),
        );
      } catch (_) {}
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Image.network(
        imageUrl,
        height: 140,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const SizedBox.shrink(),
      ),
    );
  }
}
