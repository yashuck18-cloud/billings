import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/db_provider.dart';
import '../../models/credit_due.dart';

class PendingDuesScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const PendingDuesScreen({super.key, this.onOpenDrawer});

  @override
  State<PendingDuesScreen> createState() => _PendingDuesScreenState();
}

class _PendingDuesScreenState extends State<PendingDuesScreen> {
  String _searchQuery = '';
  String _filterStatus = 'ALL';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final db = Provider.of<DbProvider>(context);
    final allDues = db.creditDues;

    final double totalCredit = allDues.fold(0.0, (sum, item) => sum + (item.status != 'PAID' ? item.dueAmount : 0.0));
    final int overdueCount = allDues.where((d) => d.isOverdue).length;
    final int pendingCount = allDues.where((d) => d.status != 'PAID').length;

    final filteredDues = allDues.where((d) {
      final matchesSearch = d.customerName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          d.customerPhone.contains(_searchQuery) ||
          d.invoiceNumber.toLowerCase().contains(_searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (_filterStatus == 'PENDING') return d.status == 'PENDING' || d.status == 'PARTIAL';
      if (_filterStatus == 'OVERDUE') return d.isOverdue;
      if (_filterStatus == 'PAID') return d.status == 'PAID';
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        leading: widget.onOpenDrawer != null
            ? IconButton(
                icon: const Icon(Icons.menu),
                onPressed: widget.onOpenDrawer,
              )
            : null,
        title: const Text('Customer Credit & Pending Dues', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh & Check Alerts',
            onPressed: () {
              db.checkPendingDueAlerts();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('✓ Checked due dates & updated notification alerts')),
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddCreditDueModal(context, db),
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Note Unpaid Purchase', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Summary Cards (Scrollable / Responsive)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  SizedBox(
                    width: 140,
                    child: _buildKpiCard(
                      context,
                      'Total Unpaid',
                      '₹${totalCredit.toStringAsFixed(2)}',
                      Icons.account_balance_wallet_outlined,
                      Colors.orange.shade700,
                    ),
                  ),
                  const SizedBox(width: 10),
                  SizedBox(
                    width: 140,
                    child: _buildKpiCard(
                      context,
                      'Overdue',
                      '$overdueCount',
                      Icons.warning_amber_rounded,
                      Colors.red.shade700,
                    ),
                  ),
                  const SizedBox(width: 10),
                  SizedBox(
                    width: 140,
                    child: _buildKpiCard(
                      context,
                      'Pending Dues',
                      '$pendingCount',
                      Icons.people_outline,
                      Colors.blue.shade700,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Search & Filter Row
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search by customer, phone, invoice...',
                      prefixIcon: const Icon(Icons.search),
                      isDense: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                const SizedBox(width: 12),
                DropdownButton<String>(
                  value: _filterStatus,
                  items: const [
                    DropdownMenuItem(value: 'ALL', child: Text('All Dues')),
                    DropdownMenuItem(value: 'PENDING', child: Text('Pending Only')),
                    DropdownMenuItem(value: 'OVERDUE', child: Text('Overdue Only')),
                    DropdownMenuItem(value: 'PAID', child: Text('Paid History')),
                  ],
                  onChanged: (v) {
                    if (v != null) setState(() => _filterStatus = v);
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Credit Due List
            if (filteredDues.isEmpty)
              Container(
                height: 220,
                width: double.infinity,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: theme.cardColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.check_circle_outline, size: 48, color: Colors.green.shade400),
                    const SizedBox(height: 12),
                    const Text('No credit due entries found', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 4),
                    Text('Click "+ Note Unpaid Purchase" to record unpaid customer credit.', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                  ],
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filteredDues.length,
                itemBuilder: (context, index) {
                  final due = filteredDues[index];
                  return _buildCreditDueCard(context, db, due);
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard(BuildContext context, String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Icon(icon, size: 18, color: color),
            ],
          ),
          const SizedBox(height: 8),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
          ),
        ],
      ),
    );
  }

  Widget _buildCreditDueCard(BuildContext context, DbProvider db, CreditDue due) {
    final isOverdue = due.isOverdue;
    final isPaid = due.status == 'PAID';

    Color statusColor = isPaid ? Colors.green : (isOverdue ? Colors.red : Colors.orange);
    String statusLabel = isPaid ? 'PAID' : (isOverdue ? 'OVERDUE' : due.status);

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: statusColor.withValues(alpha: 0.4)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(due.customerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      if (due.customerPhone.isNotEmpty)
                        Text('Phone: ${due.customerPhone}', style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: statusColor),
                  ),
                  child: Text(
                    statusLabel,
                    style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
              ],
            ),
            const Divider(height: 20),

            Wrap(
              spacing: 12,
              runSpacing: 8,
              alignment: WrapAlignment.spaceBetween,
              children: [
                _buildDetailItem('Invoice Ref', due.invoiceNumber.isNotEmpty ? due.invoiceNumber : 'N/A'),
                _buildDetailItem('Due Date', DateFormat('dd-MM-yyyy').format(due.dueDate)),
                _buildDetailItem('Total Credit', '₹${due.totalAmount.toStringAsFixed(2)}'),
                _buildDetailItem('Balance Due', '₹${due.dueAmount.toStringAsFixed(2)}', isHighlight: true, color: statusColor),
              ],
            ),
            if (due.notes.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text('Note: ${due.notes}', style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey.shade600, fontSize: 11)),
            ],

            const SizedBox(height: 12),
            LayoutBuilder(
              builder: (context, constraints) {
                return Wrap(
                  alignment: WrapAlignment.spaceBetween,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    if (!isPaid) ...[
                      ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: constraints.maxWidth > 340 ? 180 : constraints.maxWidth),
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                          ),
                          onPressed: () {
                            db.sendReminderNotificationForDue(due);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('🔔 Notification alert added to Store Dashboard for ${due.customerName}'),
                                backgroundColor: Colors.blue.shade700,
                              ),
                            );
                          },
                          icon: const Icon(Icons.notifications_active, size: 14),
                          label: const FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text('Send Reminder Alert', style: TextStyle(fontSize: 12)),
                          ),
                        ),
                      ),
                      ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: constraints.maxWidth > 340 ? 150 : constraints.maxWidth),
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade700,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          ),
                          onPressed: () => _showRecordPaymentModal(context, db, due),
                          icon: const Icon(Icons.payments, size: 14),
                          label: const FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text('Record Payment', style: TextStyle(fontSize: 12)),
                          ),
                        ),
                      ),
                    ],
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                      onPressed: () => db.deleteCreditDue(due.id),
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

  Widget _buildDetailItem(String label, String val, {bool isHighlight = false, Color? color}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(
          val,
          style: TextStyle(
            fontSize: isHighlight ? 13 : 11,
            fontWeight: isHighlight ? FontWeight.bold : FontWeight.w600,
            color: color,
          ),
        ),
      ],
    );
  }

  void _showAddCreditDueModal(BuildContext context, DbProvider db) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final invCtrl = TextEditingController();
    final amountCtrl = TextEditingController();
    final paidCtrl = TextEditingController(text: '0.0');
    final notesCtrl = TextEditingController();
    DateTime selectedDueDate = DateTime.now().add(const Duration(days: 7));

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Row(
                children: [
                  Icon(Icons.assignment_ind_outlined, color: Colors.blue),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Note Unpaid Customer Credit',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(labelText: 'Customer Name *', prefixIcon: Icon(Icons.person)),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(labelText: 'Customer Phone Number', prefixIcon: Icon(Icons.phone)),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: invCtrl,
                      decoration: const InputDecoration(labelText: 'Invoice Number (Optional)', prefixIcon: Icon(Icons.receipt)),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: amountCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Total Credit Amount (₹) *'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: paidCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Advance Paid (₹)'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Payment Due Date', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      subtitle: Text(DateFormat('dd-MM-yyyy').format(selectedDueDate)),
                      trailing: const Icon(Icons.calendar_today, color: Colors.blue),
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: selectedDueDate,
                          firstDate: DateTime.now().subtract(const Duration(days: 30)),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );
                        if (picked != null) {
                          setModalState(() => selectedDueDate = picked);
                        }
                      },
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: notesCtrl,
                      decoration: const InputDecoration(labelText: 'Product / Item Note', prefixIcon: Icon(Icons.note)),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade700, foregroundColor: Colors.white),
                  onPressed: () async {
                    final name = nameCtrl.text.trim();
                    final total = double.tryParse(amountCtrl.text.trim()) ?? 0.0;
                    final paid = double.tryParse(paidCtrl.text.trim()) ?? 0.0;
                    if (name.isEmpty || total <= 0) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please enter valid customer name and total amount')),
                      );
                      return;
                    }
                    final dueAmt = total - paid;
                    final due = CreditDue(
                      id: 'cd_${DateTime.now().millisecondsSinceEpoch}',
                      customerName: name,
                      customerPhone: phoneCtrl.text.trim(),
                      invoiceNumber: invCtrl.text.trim(),
                      totalAmount: total,
                      paidAmount: paid,
                      dueAmount: dueAmt > 0 ? dueAmt : 0.0,
                      dueDate: selectedDueDate,
                      createdAt: DateTime.now(),
                      status: dueAmt <= 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'PENDING'),
                      notes: notesCtrl.text.trim(),
                    );
                    await db.addCreditDue(due);
                    if (context.mounted) Navigator.pop(ctx);
                  },
                  child: const Text('Save Credit Note'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showRecordPaymentModal(BuildContext context, DbProvider db, CreditDue due) {
    final payCtrl = TextEditingController(text: due.dueAmount.toStringAsFixed(2));

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Record Payment for ${due.customerName}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Current Balance Due: ₹${due.dueAmount.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(
              controller: payCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Amount Received (₹)', prefixIcon: Icon(Icons.currency_rupee)),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade700, foregroundColor: Colors.white),
            onPressed: () async {
              final amt = double.tryParse(payCtrl.text.trim()) ?? 0.0;
              if (amt <= 0) return;
              final newPaid = due.paidAmount + amt;
              final newDue = due.totalAmount - newPaid;
              final updatedDue = CreditDue(
                id: due.id,
                customerName: due.customerName,
                customerPhone: due.customerPhone,
                invoiceNumber: due.invoiceNumber,
                totalAmount: due.totalAmount,
                paidAmount: newPaid,
                dueAmount: newDue > 0 ? newDue : 0.0,
                dueDate: due.dueDate,
                createdAt: due.createdAt,
                status: newDue <= 0 ? 'PAID' : 'PARTIAL',
                notes: due.notes,
              );
              await db.updateCreditDue(updatedDue);
              if (context.mounted) Navigator.pop(ctx);
            },
            child: const Text('Confirm Payment'),
          ),
        ],
      ),
    );
  }
}
