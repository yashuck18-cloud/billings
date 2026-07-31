import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/db_provider.dart';
import '../../models/category.dart';
import '../../core/theme.dart';

class CategoryScreen extends StatefulWidget {
  final VoidCallback? onOpenDrawer;

  const CategoryScreen({super.key, this.onOpenDrawer});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddEditDialog([Category? category]) {
    final isEdit = category != null;
    final nameController = TextEditingController(text: category?.name ?? '');
    final descController = TextEditingController(text: category?.description ?? '');
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isEdit ? 'Edit Category' : 'Add Category'),
        content: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Category Name',
                    hintText: 'e.g., Beverages',
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter category name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: descController,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    hintText: 'e.g., Sodas, juices, and water',
                  ),
                  maxLines: 2,
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                final db = Provider.of<DbProvider>(context, listen: false);
                if (isEdit) {
                  db.editCategory(category.copyWith(
                    name: nameController.text.trim(),
                    description: descController.text.trim(),
                  ));
                } else {
                  db.addCategory(
                    nameController.text.trim(),
                    descController.text.trim(),
                  );
                }
                Navigator.pop(context);
              }
            },
            child: Text(isEdit ? 'Save Changes' : 'Add'),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(Category category) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red),
            SizedBox(width: 8),
            Text('Delete Category'),
          ],
        ),
        content: Text('Are you sure you want to delete "${category.name}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Provider.of<DbProvider>(context, listen: false).deleteCategory(category.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Category "${category.name}" deleted.')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final db = Provider.of<DbProvider>(context);
    final results = db.searchCategories(_searchQuery);
    final theme = Theme.of(context);
    final isTablet = MediaQuery.of(context).size.width > 600;

    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Category Management'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: widget.onOpenDrawer ?? () => Scaffold.of(context).openDrawer(),
          tooltip: 'Open Menu',
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'fab_category_screen',
        onPressed: () => _showAddEditDialog(),
        icon: const Icon(Icons.add),
        label: const Text('Add Category'),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextFormField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search Category...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                            _searchQuery = '';
                          });
                        },
                      )
                    : null,
              ),
              onChanged: (val) {
                setState(() {
                  _searchQuery = val.trim();
                });
              },
            ),
          ),

          // Category List
          Expanded(
            child: results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.category_outlined, size: 64, color: theme.colorScheme.onSurfaceVariant.withOpacity(0.5)),
                        const SizedBox(height: 16),
                        Text(
                          'No Categories Found',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  )
                : isTablet
                    ? GridView.builder(
                        padding: const EdgeInsets.all(16.0),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: screenWidth > 900 ? 3 : 2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          childAspectRatio: 2.2,
                        ),
                        itemCount: results.length,
                        itemBuilder: (context, idx) {
                          final category = results[idx];
                          return _buildCategoryCard(category, theme);
                        },
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16.0),
                        itemCount: results.length,
                        itemBuilder: (context, idx) {
                          final category = results[idx];
                          final isDark = theme.brightness == Brightness.dark;
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12.0),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF1E293B) : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark ? Slate.shade850 : Colors.grey.shade100,
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: isDark ? Colors.black.withOpacity(0.05) : Colors.grey.shade50,
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          category.name,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          category.description.isNotEmpty ? category.description : 'No description',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: isDark ? Slate.shade400 : Slate.shade500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Material(
                                        color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                        shape: const CircleBorder(),
                                        child: IconButton(
                                          icon: const Icon(Icons.edit_rounded, color: Colors.blue, size: 18),
                                          onPressed: () => _showAddEditDialog(category),
                                          constraints: const BoxConstraints(),
                                          padding: const EdgeInsets.all(8),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Material(
                                        color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                                        shape: const CircleBorder(),
                                        child: IconButton(
                                          icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 18),
                                          onPressed: () => _confirmDelete(category),
                                          constraints: const BoxConstraints(),
                                          padding: const EdgeInsets.all(8),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(Category category, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? Slate.shade850 : Colors.grey.shade100,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withOpacity(0.05) : Colors.grey.shade50,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    category.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Expanded(
                    child: Text(
                      category.description.isNotEmpty ? category.description : 'No description',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: isDark ? Slate.shade400 : Slate.shade500,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Material(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                  shape: const CircleBorder(),
                  child: IconButton(
                    icon: const Icon(Icons.edit_rounded, color: Colors.blue, size: 16),
                    onPressed: () => _showAddEditDialog(category),
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(8),
                  ),
                ),
                const SizedBox(width: 8),
                Material(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9),
                  shape: const CircleBorder(),
                  child: IconButton(
                    icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 16),
                    onPressed: () => _confirmDelete(category),
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(8),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
