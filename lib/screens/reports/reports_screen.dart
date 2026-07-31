import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/db_provider.dart';
import '../../models/category.dart';
import '../../models/product.dart';

class ReportsScreen extends StatefulWidget {
  final int initialTab;
  final VoidCallback? onOpenDrawer;
  const ReportsScreen({super.key, this.initialTab = 0, this.onOpenDrawer});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this, initialIndex: widget.initialTab);
  }

  @override
  void didUpdateWidget(covariant ReportsScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialTab != widget.initialTab) {
      _tabController.animateTo(widget.initialTab);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final theme = Theme.of(context);
    final isTablet = MediaQuery.of(context).size.width > 600;

    // --- Calculation Functions ---
    // Sales Summaries
    final todaySales = db.getTodaySalesAmount();
    
    final now = DateTime.now();
    final startOfWeek = now.subtract(Duration(days: now.weekday - 1)); // Mon
    final weeklySales = db.invoices
        .where((inv) => inv.dateTime.isAfter(startOfWeek.subtract(const Duration(seconds: 1))))
        .fold(0.0, (sum, inv) => sum + inv.grandTotal);
        
    final monthlySales = db.getMonthlySalesAmount();
    final cumulativeRevenue = db.invoices.fold(0.0, (sum, inv) => sum + inv.grandTotal);

    // Override & Discount Calculations
    final totalMrpSales = db.invoices.fold(0.0, (sum, inv) => sum + inv.originalSubTotal);
    final totalActualSales = db.invoices.fold(0.0, (sum, inv) => sum + inv.grandTotal);
    final totalSavingsGiven = db.invoices.fold(0.0, (sum, inv) => sum + inv.totalSavings);
    final totalOverrideDiscounts = db.invoices.fold(0.0, (sum, inv) => sum + inv.rateOverrideDiscount);
    final totalInvoiceDiscounts = db.invoices.fold(0.0, (sum, inv) => sum + inv.discount);

    // Profit & Cost Calculations
    final totalCostOfGoods = db.invoices.fold(0.0, (sum, inv) => sum + inv.items.fold(0.0, (itemSum, item) => itemSum + (item.purchasePrice * item.quantity)));
    final totalProfit = totalActualSales - totalCostOfGoods;
    final profitMargin = totalActualSales > 0 ? (totalProfit / totalActualSales) * 100 : 0.0;

    // Category-wise Sales
    final Map<String, double> categorySales = {};
    for (var cat in db.categories) {
      categorySales[cat.name] = 0.0;
    }
    for (var inv in db.invoices) {
      for (var item in inv.items) {
        final prod = db.products.firstWhere(
          (p) => p.id == item.productId,
          orElse: () => Product(
            id: item.productId,
            name: item.productName,
            categoryId: '',
            unit: item.unit,
            quantity: 0.0,
            defaultSellingPrice: item.defaultPrice,
            purchasePrice: item.purchasePrice,
            lowStockAlert: 0.0,
          ),
        );
        final cat = db.categories.firstWhere(
          (c) => c.id == prod.categoryId,
          orElse: () => Category(id: '', name: 'Uncategorized'),
        );
        categorySales[cat.name] = (categorySales[cat.name] ?? 0.0) + item.total;
      }
    }
    final double totalSalesValue = categorySales.values.fold(0.0, (sum, v) => sum + v);

    // Product-wise Sales
    final Map<String, _ProductSalesReport> productSales = {};
    for (var prod in db.products) {
      productSales[prod.id] = _ProductSalesReport(
        productName: prod.name,
        unit: prod.unit,
        quantitySold: 0.0,
        salesAmount: 0.0,
      );
    }
    for (var inv in db.invoices) {
      for (var item in inv.items) {
        if (productSales.containsKey(item.productId)) {
          final current = productSales[item.productId]!;
          productSales[item.productId] = _ProductSalesReport(
            productName: current.productName,
            unit: current.unit,
            quantitySold: current.quantitySold + item.quantity,
            salesAmount: current.salesAmount + item.total,
          );
        } else {
          productSales[item.productId] = _ProductSalesReport(
            productName: item.productName,
            unit: item.unit,
            quantitySold: item.quantity,
            salesAmount: item.total,
          );
        }
      }
    }
    // Sort products by sales amount desc
    final sortedProductSales = productSales.values.toList()
      ..sort((a, b) => b.salesAmount.compareTo(a.salesAmount));

    // Low stock and Out of Stock reports
    final lowStockProducts = db.products.where((p) => p.quantity > 0 && p.quantity <= p.lowStockAlert).toList();
    final outOfStockProducts = db.products.where((p) => p.quantity <= 0).toList();

    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports & Analytical Ledger'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.analytics_outlined), text: 'Sales Summary'),
            Tab(icon: Icon(Icons.trending_up_rounded), text: 'Profit & Loss'),
            Tab(icon: Icon(Icons.notification_important_outlined), text: 'Stock Report'),
            Tab(icon: Icon(Icons.receipt_long_rounded), text: 'Tax Report'),
            Tab(icon: Icon(Icons.star_outline_rounded), text: 'Top Products'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: Sales Summary
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Sales Performance', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                
                // Summary Metrics
                GridView.count(
                  crossAxisCount: isTablet ? 4 : 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: isTablet ? 1.6 : (screenWidth < 360 ? 1.15 : 1.35),
                  children: [
                    _buildMetricCard(context, "Today's Sales", "₹${todaySales.toStringAsFixed(1)}", Colors.indigo),
                    _buildMetricCard(context, "Weekly Sales", "₹${weeklySales.toStringAsFixed(1)}", Colors.blue),
                    _buildMetricCard(context, "Monthly Sales", "₹${monthlySales.toStringAsFixed(1)}", Colors.purple),
                    _buildMetricCard(context, "Revenue", "₹${cumulativeRevenue.toStringAsFixed(1)}", Colors.teal),
                  ],
                ),
                
                const SizedBox(height: 32),
                Text('Price Override & Discount Ledger', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildReportRow(context, "Total Sales at Original MRP", "₹${totalMrpSales.toStringAsFixed(1)}", theme),
                        const Divider(height: 20),
                        _buildReportRow(context, "Total Rate Override Discounts", "-₹${totalOverrideDiscounts.toStringAsFixed(1)}", theme, valueColor: Colors.red),
                        const Divider(height: 20),
                        _buildReportRow(context, "Total Additional Promo Discounts", "-₹${totalInvoiceDiscounts.toStringAsFixed(1)}", theme, valueColor: Colors.red),
                        const Divider(height: 20),
                        _buildReportRow(context, "Total Customer Savings (Loss)", "₹${totalSavingsGiven.toStringAsFixed(1)}", theme, valueColor: Colors.green, isBold: true),
                        const Divider(height: 24, thickness: 1.5),
                        _buildReportRow(context, "Actual Revenue Collected", "₹${totalActualSales.toStringAsFixed(1)}", theme, valueColor: theme.colorScheme.primary, isBold: true, fontSize: 16),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 32),
                Text('Category-wise Sales Share', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: categorySales.entries.map((entry) {
                        final catName = entry.key;
                        final val = entry.value;
                        final percent = totalSalesValue > 0 ? (val / totalSalesValue) : 0.0;
                        
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(catName, style: const TextStyle(fontWeight: FontWeight.w500)),
                                  Text(
                                    '₹${val.toStringAsFixed(1)} (${(percent * 100).toStringAsFixed(1)}%)',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              LinearProgressIndicator(
                                value: percent,
                                backgroundColor: theme.brightness == Brightness.dark ? Colors.grey.shade800 : Colors.grey.shade200,
                                valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                                minHeight: 8,
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 2: Profit & Loss
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Profit & Cost Analysis', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildReportRow(context, "Total Sales Revenue (Actual)", "₹${totalActualSales.toStringAsFixed(1)}", theme),
                        const Divider(height: 20),
                        _buildReportRow(context, "Cost of Goods Sold (COGS)", "₹${totalCostOfGoods.toStringAsFixed(1)}", theme, valueColor: Colors.amber.shade800),
                        const Divider(height: 20),
                        _buildReportRow(context, "Gross Profit Made", "₹${totalProfit.toStringAsFixed(1)}", theme, valueColor: Colors.green, isBold: true, fontSize: 16),
                        const Divider(height: 20),
                        _buildReportRow(context, "Average Profit Margin", "${profitMargin.toStringAsFixed(1)}%", theme, valueColor: theme.colorScheme.primary, isBold: true),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 3: Stock Report
          ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              // Out of stock
              Row(
                children: [
                  const Icon(Icons.error_outline, color: Colors.red),
                  const SizedBox(width: 8),
                  Text(
                    'Out of Stock Report (${outOfStockProducts.length})',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: Colors.red),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (outOfStockProducts.isEmpty)
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('All products are currently in stock! Perfect.', style: TextStyle(color: Colors.green)),
                  ),
                )
              else
                Card(
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: outOfStockProducts.length,
                    separatorBuilder: (context, index) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final prod = outOfStockProducts[index];
                      return ListTile(
                        title: Text(prod.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('Unit: ${prod.unit} • Threshold: ${prod.lowStockAlert}'),
                        trailing: const Text('0 Stock', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                      );
                    },
                  ),
                ),

              const SizedBox(height: 32),

              // Low stock
              Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, color: Colors.amber),
                  const SizedBox(width: 8),
                  Text(
                    'Low Stock Report (${lowStockProducts.length})',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: Colors.amber.shade800),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (lowStockProducts.isEmpty)
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('No products currently crossing low stock threshold.', style: TextStyle(color: Colors.green)),
                  ),
                )
              else
                Card(
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: lowStockProducts.length,
                    separatorBuilder: (context, index) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final prod = lowStockProducts[index];
                      return ListTile(
                        title: Text(prod.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('Unit: ${prod.unit} • Alert Limit: ${prod.lowStockAlert}'),
                        trailing: Text(
                          '${prod.quantity} Left',
                          style: TextStyle(color: Colors.amber.shade800, fontWeight: FontWeight.bold),
                        ),
                      );
                    },
                  ),
                ),
            ],
          ),

          // Tab 4: Tax Report
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Tax Collected & Ledger (Inclusive 18% GST)', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildReportRow(context, "Gross Revenue (Inclusive Tax)", "₹${totalActualSales.toStringAsFixed(1)}", theme),
                        const Divider(height: 20),
                        _buildReportRow(context, "Taxable Base Amount", "₹${(totalActualSales / 1.18).toStringAsFixed(1)}", theme),
                        const Divider(height: 20),
                        _buildReportRow(context, "Estimated CGST (9%)", "₹${((totalActualSales - (totalActualSales / 1.18)) / 2).toStringAsFixed(1)}", theme, valueColor: Colors.teal),
                        const Divider(height: 20),
                        _buildReportRow(context, "Estimated SGST (9%)", "₹${((totalActualSales - (totalActualSales / 1.18)) / 2).toStringAsFixed(1)}", theme, valueColor: Colors.teal),
                        const Divider(height: 24, thickness: 1.5),
                        _buildReportRow(context, "Total GST Tax Collected (18%)", "₹${(totalActualSales - (totalActualSales / 1.18)).toStringAsFixed(1)}", theme, valueColor: theme.colorScheme.primary, isBold: true, fontSize: 16),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab 5: Top Products
          sortedProductSales.isEmpty
              ? const Center(child: Text('No product sales recorded yet.'))
              : ListView(
                  padding: const EdgeInsets.all(16.0),
                  children: [
                    Text('Product Sales Performance', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: DataTable(
                            columns: const [
                              DataColumn(label: Text('Product Name', style: TextStyle(fontWeight: FontWeight.bold))),
                              DataColumn(label: Text('Quantity Sold', style: TextStyle(fontWeight: FontWeight.bold))),
                              DataColumn(label: Text('Sales Value', style: TextStyle(fontWeight: FontWeight.bold))),
                            ],
                            rows: sortedProductSales.map((item) {
                              return DataRow(
                                cells: [
                                  DataCell(Text(item.productName, style: const TextStyle(fontWeight: FontWeight.w500))),
                                  DataCell(Text('${item.quantitySold} ${item.unit}')),
                                  DataCell(Text('₹${item.salesAmount.toStringAsFixed(1)}', style: const TextStyle(fontWeight: FontWeight.bold))),
                                ],
                              );
                            }).toList(),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(BuildContext context, String title, String value, Color color) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: theme.textTheme.bodySmall?.copyWith(
                color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              value,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReportRow(BuildContext context, String label, String value, ThemeData theme, {Color? valueColor, bool isBold = false, double fontSize = 14}) {
    final isDark = theme.brightness == Brightness.dark;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: isDark ? Colors.grey.shade300 : Colors.grey.shade800,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.bold,
            color: valueColor ?? (isDark ? Colors.white : Colors.black),
          ),
        ),
      ],
    );
  }
}

class _ProductSalesReport {
  final String productName;
  final String unit;
  final double quantitySold;
  final double salesAmount;

  _ProductSalesReport({
    required this.productName,
    required this.unit,
    required this.quantitySold,
    required this.salesAmount,
  });
}
