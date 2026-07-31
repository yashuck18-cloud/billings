import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/db_provider.dart';
import '../../core/storage.dart';
import '../receipt_builder/receipt_builder_screen.dart';

class SettingsScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const SettingsScreen({super.key, this.onOpenDrawer});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _selectedPrinter = 'A4';
  bool _autoSyncEnabled = true;

  @override
  void initState() {
    super.initState();
    _selectedPrinter = StorageService.getPrinterType();
  }

  void _handlePrinterChanged(String? val) {
    if (val != null) {
      setState(() {
        _selectedPrinter = val;
      });
      StorageService.savePrinterType(val);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Printer preference saved: $val')));
    }
  }



  void _triggerManualBackup(DbProvider db) async {
    final success = await db.syncCloud(silent: false);
    if (!mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          success
              ? 'SaaS Database Backup successfully completed!'
              : 'Offline Mode: All sales saved locally. Auto-syncing when online.',
        ),
        backgroundColor: success ? Colors.green.shade700 : Colors.orange.shade800,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _handleLogout() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Logout'),
        content: const Text('Are you sure you want to end your POS session?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              auth.logout();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  void _showEditProfileDialog(AuthProvider auth) {
    final nameController = TextEditingController(text: auth.currentUser?.businessName ?? '');
    final emailController = TextEditingController(text: auth.currentUser?.email ?? '');
    final passwordController = TextEditingController();
    bool showPassword = false;
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.manage_accounts, color: Color(0xFF4F46E5)),
              ),
              const SizedBox(width: 12),
              const Text('Edit User Profile', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Update store name, email address, and security password.',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Business / Owner Name',
                    hintText: 'e.g. Bekery',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.storefront_outlined),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email Address',
                    hintText: 'm@mmail.com',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: passwordController,
                  obscureText: !showPassword,
                  decoration: InputDecoration(
                    labelText: 'New Password',
                    hintText: 'Leave blank to keep current',
                    border: const OutlineInputBorder(),
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(
                        showPassword ? Icons.visibility : Icons.visibility_off,
                        color: Colors.grey.shade600,
                      ),
                      onPressed: () {
                        setDialogState(() {
                          showPassword = !showPassword;
                        });
                      },
                      tooltip: showPassword ? 'Hide password' : 'Show password',
                    ),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: isSaving ? null : () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: isSaving
                  ? null
                  : () async {
                      final name = nameController.text.trim();
                      final email = emailController.text.trim();
                      final pass = passwordController.text.trim();

                      if (name.isEmpty || email.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Name and Email cannot be empty.')),
                        );
                        return;
                      }

                      setDialogState(() {
                        isSaving = true;
                      });

                      final success = await auth.updateProfile(
                        name: name,
                        email: email,
                        password: pass.isNotEmpty ? pass : null,
                      );

                      if (mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              success
                                  ? 'User profile updated successfully!'
                                  : 'Failed to update profile.',
                            ),
                            backgroundColor: success ? Colors.green : Colors.red,
                          ),
                        );
                      }
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                minimumSize: const Size(100, 42),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: isSaving
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Save Profile'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // User & Shop Profile Section
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () => _showEditProfileDialog(auth),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: theme.colorScheme.primary.withOpacity(0.15),
                      child: Icon(
                        Icons.storefront,
                        color: theme.colorScheme.primary,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            auth.currentUser?.businessName ?? 'Bekery',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            auth.currentUser?.email ?? 'm@mmail.com',
                            style: TextStyle(
                              color: theme.colorScheme.onSurfaceVariant,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.edit_outlined, size: 16, color: theme.colorScheme.primary),
                          const SizedBox(width: 4),
                          Text(
                            'Edit Profile',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Core System Settings Title
          const Padding(
            padding: EdgeInsets.only(left: 8.0, bottom: 8.0),
            child: Text(
              'Device & App Options',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),

          Card(
            child: Column(
              children: [
                // Dark Mode Toggle
                SwitchListTile(
                  title: const Text('Dark Theme Mode'),
                  subtitle: const Text(
                    'Toggle between Light and Dark interface modes',
                  ),
                  secondary: const Icon(Icons.brightness_6_outlined),
                  value: db.isDarkTheme,
                  onChanged: (val) => db.toggleTheme(),
                ),
                const Divider(height: 1),

                // Printer Select configuration
                ListTile(
                  leading: const Icon(Icons.print_outlined),
                  title: const Text('Printer Selection'),
                  subtitle: const Text(
                    'Set default invoice paper formatting layout',
                  ),
                  trailing: DropdownButton<String>(
                    value: _selectedPrinter,
                    items: const [
                      DropdownMenuItem(value: 'A4', child: Text('A4 Printer')),
                      DropdownMenuItem(
                        value: 'Thermal',
                        child: Text('Thermal (80mm)'),
                      ),
                      DropdownMenuItem(
                        value: 'Bluetooth',
                        child: Text('Bluetooth roll'),
                      ),
                      DropdownMenuItem(
                        value: 'USB',
                        child: Text('USB Desktop'),
                      ),
                    ],
                    onChanged: _handlePrinterChanged,
                  ),
                ),
                const Divider(height: 1),

                // Receipt & Bill Designer
                ListTile(
                  leading: const Icon(Icons.receipt_long_outlined, color: Color(0xFF4F46E5)),
                  title: const Text('Receipt & Bill Designer'),
                  subtitle: const Text('Design store header, language, paper layout & QR code'),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (ctx) => const ReceiptBuilderScreen()),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Cloud & Storage Title
          const Padding(
            padding: EdgeInsets.only(left: 8.0, bottom: 8.0),
            child: Text(
              'SaaS Sync & Backups',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),

          Card(
            child: Column(
              children: [
                // Auto Sync Toggle
                SwitchListTile(
                  title: const Text('Auto Sync Database'),
                  subtitle: const Text(
                    'Automatically sync completed bills and stock changes to the cloud',
                  ),
                  secondary: const Icon(Icons.cloud_sync_outlined),
                  value: _autoSyncEnabled,
                  onChanged: (val) {
                    setState(() {
                      _autoSyncEnabled = val;
                    });
                  },
                ),
                const Divider(height: 1),

                // Manual Cloud Sync Trigger
                ListTile(
                  leading: const Icon(Icons.backup_outlined),
                  title: const Text('Backup Database Now'),
                  subtitle: Text(
                    db.lastSynced != null
                        ? 'Last Backup: ${DateFormat('dd MMM yyyy, hh:mm a').format(db.lastSynced!)}'
                        : 'Database not backed up yet',
                  ),
                  trailing: db.isSyncing
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: db.isSyncing ? null : () => _triggerManualBackup(db),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Log Out Button
          ElevatedButton.icon(
            onPressed: _handleLogout,
            icon: const Icon(Icons.logout),
            label: const Text(
              'Logout Session',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade700,
              foregroundColor: Colors.white,
              elevation: 1,
            ),
          ),
          const SizedBox(height: 24),

          // Version info footer
          Center(
            child: Column(
              children: [
                Image.asset(
                  'assets/images/crafzio_logo.png',
                  height: 48,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 6),
                const Text(
                  'Crafzio Billing Suite v1.0.0 (Secure Session)',
                  style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
