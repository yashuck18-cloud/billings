import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/db_provider.dart';

class PaperSizeDialog extends StatelessWidget {
  const PaperSizeDialog({super.key});

  static void show(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => const PaperSizeDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final theme = Theme.of(context);

    final options = [
      {
        'id': '58mm',
        'title': '58mm Thermal (2 Inch)',
        'desc': 'Standard mini thermal receipt printers (Bluetooth / USB POS).',
        'icon': Icons.receipt_long_outlined,
      },
      {
        'id': '80mm',
        'title': '80mm Thermal (3 Inch)',
        'desc': 'Popular counter thermal receipt printers (Epson, Star, Xprinter).',
        'icon': Icons.receipt_outlined,
      },
      {
        'id': 'A4',
        'title': 'A4 Standard Sheet',
        'desc': 'Full page desktop inkjet or laser printer billing sheet.',
        'icon': Icons.description_outlined,
      },
      {
        'id': 'A5',
        'title': 'A5 Compact Sheet',
        'desc': 'Half-page compact invoice sheet printing.',
        'icon': Icons.feed_outlined,
      },
    ];

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Row(
        children: [
          Icon(Icons.print_outlined, color: theme.colorScheme.primary),
          const SizedBox(width: 10),
          const Expanded(
            child: Text(
              'Receipt Paper Size',
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
      content: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 440),
        child: SingleChildScrollView(
          child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select your default invoice printer paper size. Invoice layouts and PDFs will adjust automatically.',
              style: TextStyle(fontSize: 13, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            ...options.map((opt) {
              final id = opt['id'] as String;
              final isSelected = db.receiptPaperSize == id;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? theme.colorScheme.primary : Colors.grey.shade300,
                    width: isSelected ? 2 : 1,
                  ),
                  color: isSelected ? theme.colorScheme.primary.withValues(alpha: 0.08) : null,
                ),
                child: ListTile(
                  leading: Icon(
                    opt['icon'] as IconData,
                    color: isSelected ? theme.colorScheme.primary : Colors.grey,
                  ),
                  title: Text(
                    opt['title'] as String,
                    style: TextStyle(
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                      color: isSelected ? theme.colorScheme.primary : null,
                    ),
                  ),
                  subtitle: Text(
                    opt['desc'] as String,
                    style: const TextStyle(fontSize: 11),
                  ),
                  trailing: isSelected
                      ? Icon(Icons.check_circle, color: theme.colorScheme.primary)
                      : null,
                  onTap: () {
                    db.setReceiptPaperSize(id);
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Receipt Paper Size set to ${opt['title']}'),
                        duration: const Duration(seconds: 2),
                        backgroundColor: Colors.green.shade700,
                      ),
                    );
                  },
                ),
              );
            }),
          ],
        ),
      ),
    ),
    actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Close'),
        ),
      ],
    );
  }
}
