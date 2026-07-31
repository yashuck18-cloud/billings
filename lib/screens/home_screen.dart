import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:motion_tab_bar_v2/motion-tab-bar.dart';
import 'package:motion_tab_bar_v2/motion-tab-controller.dart';
import '../providers/auth_provider.dart';
import '../providers/db_provider.dart';
import '../core/report_exporter.dart';
import '../widgets/paper_size_dialog.dart';
import 'receipt_builder/receipt_builder_screen.dart';
import 'dashboard/dashboard_screen.dart';
import 'billing/billing_screen.dart';
import 'products/product_screen.dart';
import 'categories/category_screen.dart';
import 'inventory/inventory_screen.dart';
import 'inventory/purchase_history_screen.dart';
import 'sales_history/sales_history_screen.dart';
import 'sales_history/cancelled_bills_screen.dart';
import 'reports/reports_screen.dart';
import 'settings/settings_screen.dart';
import 'pending_dues/pending_dues_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _currentIndex = 0;
  int _reportsInitialTab = 0;
  MotionTabBarController? _motionTabBarController;
  late PageController _pageController;
  late List<Widget> _screens;

  // Helper to map indexes specifically for bottom navigation on mobile
  final List<int> _mobileIndexMap = [0, 1, 2, 5, 7]; // Dashboard, Billing, Products, Sales, Settings

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _motionTabBarController = MotionTabBarController(
      initialIndex: 0,
      length: 5,
      vsync: this,
    );
    // Build screens once — prevents heavy widgets being recreated on every setState
    _screens = [
      DashboardScreen(onNavigate: _navigateToTab, onOpenDrawer: _openDrawer), // 0
      BillingScreen(onOpenDrawer: _openDrawer), // 1
      ProductScreen(onOpenDrawer: _openDrawer), // 2
      CategoryScreen(onOpenDrawer: _openDrawer), // 3
      InventoryScreen(onOpenDrawer: _openDrawer), // 4
      SalesHistoryScreen(onOpenDrawer: _openDrawer), // 5
      ReportsScreen(initialTab: _reportsInitialTab, onOpenDrawer: _openDrawer), // 6
      SettingsScreen(onOpenDrawer: _openDrawer), // 7
      CancelledBillsScreen(onOpenDrawer: _openDrawer), // 8
      PurchaseHistoryScreen(onOpenDrawer: _openDrawer), // 9
      PendingDuesScreen(onOpenDrawer: _openDrawer), // 10
    ];
  }

  @override
  void dispose() {
    _pageController.dispose();
    _motionTabBarController?.dispose();
    super.dispose();
  }

  void _openDrawer() {
    _scaffoldKey.currentState?.openDrawer();
  }

  void _navigateToTab(int index, {int reportsTab = 0}) {
    final db = Provider.of<DbProvider>(context, listen: false);
    String? moduleKey;
    String name = 'Feature';
    if (index == 1) {
      moduleKey = 'billing';
      name = 'POS Billing';
    } else if (index == 2 || index == 3 || index == 4) {
      moduleKey = 'products';
      name = 'Products & Inventory';
    } else if (index == 5 || index == 8) {
      moduleKey = 'sales_history';
      name = 'Sales History';
    } else if (index == 9) {
      moduleKey = 'purchase_entry';
      name = 'Purchase History';
    } else if (index == 6) {
      moduleKey = 'reports';
      name = 'Reports';
    }

    if (moduleKey != null && !db.isModuleEnabled(moduleKey)) {
      _showModuleDisabledNotice(context, name);
      return;
    }

    setState(() {
      _currentIndex = index;
      if (index == 6) {
        _reportsInitialTab = reportsTab;
      }
      if (_mobileIndexMap.contains(index)) {
        int mobileIdx = _mobileIndexMap.indexOf(index);
        _motionTabBarController?.index = mobileIdx;
      }
    });

    if (_pageController.hasClients && _pageController.page?.round() != index) {
      _pageController.animateToPage(
        index,
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  void _showExportDialog(BuildContext context, DbProvider db) {
    final data = db.exportBackupData();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.backup_outlined, color: Theme.of(context).colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Backup Database'),
          ],
        ),
        content: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Your store configurations, products, categories, stock history, cancelled bills, purchase history, and invoices have been serialized successfully:'),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                constraints: const BoxConstraints(maxHeight: 180),
                width: double.maxFinite,
                decoration: BoxDecoration(
                  color: Colors.grey.shade900,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    data,
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.greenAccent),
                  ),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton.icon(
            icon: const Icon(Icons.copy_rounded),
            label: const Text('Copy Backup String'),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: data));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Database backup copied to clipboard!')),
              );
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }

  void _showImportDialog(BuildContext context, DbProvider db) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.restore_outlined, color: Theme.of(context).colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Restore Database'),
          ],
        ),
        content: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Paste your exported JSON backup string below to restore categories, products, stock history, purchase ledger, and invoices:'),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                maxLines: 5,
                decoration: const InputDecoration(
                  hintText: 'Paste backup code here...',
                  border: OutlineInputBorder(),
                ),
                style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton.icon(
            icon: const Icon(Icons.download_done_rounded),
            label: const Text('Restore Database'),
            onPressed: () {
              final val = controller.text.trim();
              if (val.isEmpty) return;
              final success = db.importBackupData(val);
              if (success) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Database backup restored successfully!'), backgroundColor: Colors.green),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Failed to restore database. Invalid backup string.'), backgroundColor: Colors.red),
                );
              }
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPremiumDrawer(BuildContext context, AuthProvider auth, DbProvider db) {
    final theme = Theme.of(context);
    final user = auth.currentUser;
    final storeName = user?.businessName ?? 'ApexPOS';
    final storeEmail = user?.email ?? 'store@apexpos.com';

    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [theme.colorScheme.primary, theme.colorScheme.primaryContainer],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            currentAccountPicture: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(4),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/crafzio_logo.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
            accountName: Row(
              children: [
                Expanded(
                  child: Text(
                    storeName,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.greenAccent.shade700,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'PRO',
                    style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            accountEmail: Text(storeEmail),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildDrawerSectionHeader(context, 'Core Operational Modules'),
                _buildDrawerItem(Icons.warehouse_outlined, Icons.warehouse, 'Inventory & Stock', 4, moduleKey: 'products'),
                
                const Divider(),
                _buildDrawerSectionHeader(context, 'Sales & Credit Ledger'),
                _buildDrawerItem(Icons.history_outlined, Icons.history, 'Sales History', 5, moduleKey: 'sales_history'),
                _buildDrawerItem(Icons.account_balance_wallet_outlined, Icons.account_balance_wallet, 'Customer Credit & Pending Dues', 10, moduleKey: 'sales_and_credit_ledger'),
                _buildDrawerItem(Icons.cancel_outlined, Icons.cancel, 'Cancelled Bills', 8, moduleKey: 'sales_history'),
                _buildDrawerItem(Icons.add_shopping_cart, Icons.shopping_bag_outlined, 'Purchase History', 9, moduleKey: 'purchases'),
                
                const Divider(),
                _buildDrawerSectionHeader(context, 'Reports & Export Options'),
                _buildDrawerItem(Icons.analytics_outlined, Icons.analytics, 'Sales Report', 6, reportsTab: 0, moduleKey: 'reports'),
                ListTile(
                  leading: Icon(db.isModuleEnabled('reports') ? Icons.picture_as_pdf_outlined : Icons.lock, color: db.isModuleEnabled('reports') ? Colors.redAccent : Colors.grey.shade400),
                  title: Text('Export PDF', style: TextStyle(fontWeight: FontWeight.w500, color: db.isModuleEnabled('reports') ? null : Colors.grey.shade500)),
                  onTap: () {
                    Navigator.pop(context);
                    if (!db.isModuleEnabled('reports')) {
                      _showModuleDisabledNotice(context, 'Reports & Export');
                    } else {
                      ReportExporter.showExportPdfDialog(context, db, storeName);
                    }
                  },
                ),
                ListTile(
                  leading: Icon(db.isModuleEnabled('reports') ? Icons.table_chart_outlined : Icons.lock, color: db.isModuleEnabled('reports') ? Colors.green : Colors.grey.shade400),
                  title: Text('Export Excel', style: TextStyle(fontWeight: FontWeight.w500, color: db.isModuleEnabled('reports') ? null : Colors.grey.shade500)),
                  onTap: () {
                    Navigator.pop(context);
                    if (!db.isModuleEnabled('reports')) {
                      _showModuleDisabledNotice(context, 'Reports & Export');
                    } else {
                      ReportExporter.showExportExcelDialog(context, db);
                    }
                  },
                ),
                ListTile(
                  leading: Icon(db.isModuleEnabled('reports') ? Icons.share_outlined : Icons.lock, color: db.isModuleEnabled('reports') ? Colors.blueAccent : Colors.grey.shade400),
                  title: Text('Share Report', style: TextStyle(fontWeight: FontWeight.w500, color: db.isModuleEnabled('reports') ? null : Colors.grey.shade500)),
                  onTap: () {
                    Navigator.pop(context);
                    if (!db.isModuleEnabled('reports')) {
                      _showModuleDisabledNotice(context, 'Reports & Export');
                    } else {
                      ReportExporter.shareReport(context, db, storeName);
                    }
                  },
                ),

                const Divider(),
                _buildDrawerSectionHeader(context, 'Database & Configuration'),
                ListTile(
                  leading: Icon(db.isModuleEnabled('backup') ? Icons.backup_outlined : Icons.lock, color: db.isModuleEnabled('backup') ? theme.colorScheme.primary : Colors.grey.shade400),
                  title: Text('Backup Database', style: TextStyle(fontWeight: FontWeight.w500, color: db.isModuleEnabled('backup') ? null : Colors.grey.shade500)),
                  onTap: () {
                    Navigator.pop(context);
                    if (!db.isModuleEnabled('backup')) {
                      _showModuleDisabledNotice(context, 'Database Backup');
                    } else {
                      _showExportDialog(context, db);
                    }
                  },
                ),
                ListTile(
                  leading: Icon(db.isModuleEnabled('backup') ? Icons.restore_outlined : Icons.lock, color: db.isModuleEnabled('backup') ? theme.colorScheme.primary : Colors.grey.shade400),
                  title: Text('Restore Database', style: TextStyle(fontWeight: FontWeight.w500, color: db.isModuleEnabled('backup') ? null : Colors.grey.shade500)),
                  onTap: () {
                    Navigator.pop(context);
                    if (!db.isModuleEnabled('backup')) {
                      _showModuleDisabledNotice(context, 'Database Restore');
                    } else {
                      _showImportDialog(context, db);
                    }
                  },
                ),
                ListTile(
                  leading: Icon(Icons.print_outlined, color: theme.colorScheme.primary),
                  title: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Receipt Paper Size', style: TextStyle(fontWeight: FontWeight.w500)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          db.receiptPaperSize,
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                        ),
                      ),
                    ],
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    PaperSizeDialog.show(context);
                  },
                ),
                ListTile(
                  leading: Icon(Icons.receipt_long_outlined, color: theme.colorScheme.primary),
                  title: const Text('Receipt & Bill Designer (ಕನ್ನಡ)', style: TextStyle(fontWeight: FontWeight.w500)),
                  subtitle: const Text('Edit store name, language, header & footer', style: TextStyle(fontSize: 11)),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (ctx) => const ReceiptBuilderScreen()),
                    );
                  },
                ),

                const Divider(),
                _buildDrawerSectionHeader(context, 'System & Session'),
                _buildDrawerItem(Icons.settings_outlined, Icons.settings, 'System Settings', 7),
                ListTile(
                  leading: const Icon(Icons.logout_rounded, color: Colors.redAccent),
                  title: const Text('Logout', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
                  onTap: () async {
                    Navigator.pop(context);
                    await auth.logout();
                  },
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerSectionHeader(BuildContext context, String title) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(left: 16.0, top: 12.0, bottom: 4.0),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: theme.colorScheme.primary.withOpacity(0.8),
          letterSpacing: 1.0,
        ),
      ),
    );
  }

  void _showModuleDisabledNotice(BuildContext context, String moduleName) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.block_rounded, color: Colors.redAccent),
            const SizedBox(width: 8),
            Text('$moduleName Disabled'),
          ],
        ),
        content: Text(
          'Access to the $moduleName module has been disabled for your account by the Super Administrator.\n\nPlease contact your system admin if you need this feature enabled.',
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, foregroundColor: Colors.white),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK, Got it'),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(
    IconData icon,
    IconData activeIcon,
    String label,
    int targetIndex, {
    int reportsTab = 0,
    String? moduleKey,
  }) {
    final theme = Theme.of(context);
    final db = Provider.of<DbProvider>(context, listen: false);
    final isEnabled = moduleKey == null || db.isModuleEnabled(moduleKey);
    final isSelected = _currentIndex == targetIndex && (targetIndex != 6 || _reportsInitialTab == reportsTab);

    return ListTile(
      leading: Icon(
        !isEnabled ? Icons.lock : (isSelected ? activeIcon : icon),
        color: !isEnabled ? Colors.grey.shade400 : (isSelected ? theme.colorScheme.primary : Colors.grey),
      ),
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: !isEnabled ? Colors.grey.shade500 : (isSelected ? theme.colorScheme.primary : null),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (!isEnabled)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'DISABLED',
                style: TextStyle(color: Colors.redAccent, fontSize: 9, fontWeight: FontWeight.w900),
              ),
            ),
        ],
      ),
      selected: isSelected,
      onTap: () {
        Navigator.pop(context); // Close drawer
        if (!isEnabled) {
          _showModuleDisabledNotice(context, label);
        } else {
          _navigateToTab(targetIndex, reportsTab: reportsTab);
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final auth = Provider.of<AuthProvider>(context);
    final db = Provider.of<DbProvider>(context);
    final screenWidth = MediaQuery.of(context).size.width;

    final isDesktop = screenWidth >= 1024;
    final isTablet = screenWidth >= 600 && screenWidth < 1024;

    // Update ReportsScreen only when its tab changes
    if (_currentIndex == 6) {
      _screens[6] = ReportsScreen(initialTab: _reportsInitialTab, onOpenDrawer: _openDrawer);
    }
    final List<Widget> screens = _screens;

    if (isDesktop || isTablet) {
      // Widescreen Desktop / Tablet Layout
      return Scaffold(
        key: _scaffoldKey,
        drawer: _buildPremiumDrawer(context, auth, db),
        body: Row(
          children: [
            LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: constraints.maxHeight),
                    child: IntrinsicHeight(
                      child: NavigationRail(
                        extended: isDesktop,
                        minWidth: 72,
                        minExtendedWidth: 220,
                        selectedIndex: _currentIndex < 8 ? _currentIndex : 0,
                        labelType: isDesktop ? NavigationRailLabelType.none : NavigationRailLabelType.all,
                        leading: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 8.0),
                          child: InkWell(
                            onTap: _openDrawer,
                            borderRadius: BorderRadius.circular(20),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircleAvatar(
                                  backgroundColor: theme.colorScheme.primary.withOpacity(0.15),
                                  child: Icon(Icons.menu, color: theme.colorScheme.primary),
                                ),
                                if (isDesktop) ...[
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      auth.currentUser?.businessName ?? 'ApexPOS',
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                        onDestinationSelected: (idx) {
                          _navigateToTab(idx);
                        },
                        destinations: const [
                          NavigationRailDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: Text('Dashboard')),
                          NavigationRailDestination(icon: Icon(Icons.point_of_sale_outlined), selectedIcon: Icon(Icons.point_of_sale), label: Text('POS Billing')),
                          NavigationRailDestination(icon: Icon(Icons.inventory_2_outlined), selectedIcon: Icon(Icons.inventory_2), label: Text('Products')),
                          NavigationRailDestination(icon: Icon(Icons.category_outlined), selectedIcon: Icon(Icons.category), label: Text('Categories')),
                          NavigationRailDestination(icon: Icon(Icons.warehouse_outlined), selectedIcon: Icon(Icons.warehouse), label: Text('Inventory')),
                          NavigationRailDestination(icon: Icon(Icons.history_outlined), selectedIcon: Icon(Icons.history), label: Text('Sales Hist.')),
                          NavigationRailDestination(icon: Icon(Icons.analytics_outlined), selectedIcon: Icon(Icons.analytics), label: Text('Reports')),
                          NavigationRailDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: Text('Settings')),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
            const VerticalDivider(width: 1, thickness: 1),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const BouncingScrollPhysics(),
                onPageChanged: (index) {
                  if (_currentIndex != index) {
                    setState(() {
                      _currentIndex = index;
                      if (_mobileIndexMap.contains(index)) {
                        int mobileIdx = _mobileIndexMap.indexOf(index);
                        _motionTabBarController?.index = mobileIdx;
                      }
                    });
                  }
                },
                children: screens,
              ),
            ),
          ],
        ),
      );
    } else {
      // Mobile Layout (Phones < 600px)
      return Scaffold(
        key: _scaffoldKey,
        drawer: _buildPremiumDrawer(context, auth, db),
        body: PageView(
          controller: _pageController,
          physics: const BouncingScrollPhysics(),
          onPageChanged: (index) {
            if (_currentIndex != index) {
              setState(() {
                _currentIndex = index;
                if (_mobileIndexMap.contains(index)) {
                  int mobileIdx = _mobileIndexMap.indexOf(index);
                  _motionTabBarController?.index = mobileIdx;
                }
              });
            }
          },
          children: screens,
        ),
        bottomNavigationBar: MotionTabBar(
          controller: _motionTabBarController,
          initialSelectedTab: 'Dashboard',
          labels: const ['Dashboard', 'Billing', 'Products', 'Sales', 'Settings'],
          icons: const [
            Icons.dashboard_rounded,
            Icons.point_of_sale_rounded,
            Icons.inventory_2_rounded,
            Icons.history_rounded,
            Icons.settings_rounded,
          ],
          badges: const [
            null,
            null,
            null,
            null,
            null,
          ],
          tabSize: 50,
          tabIconSize: 28,
          tabIconSelectedSize: 26,
          tabIconColor: theme.brightness == Brightness.dark ? Colors.grey.shade400 : Colors.grey.shade600,
          tabIconSelectedColor: Colors.white,
          tabSelectedColor: theme.colorScheme.primary,
          textStyle: TextStyle(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
          onTabItemSelected: (int value) {
            _navigateToTab(_mobileIndexMap[value]);
          },
        ),
      );
    }
  }
}
