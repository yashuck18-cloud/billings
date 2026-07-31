class Category {
  final String id;
  final String name;
  final String description;

  Category({
    required this.id,
    required this.name,
    this.description = '',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
      };

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String? ?? '',
      );

  Category copyWith({
    String? id,
    String? name,
    String? description,
  }) {
    return Category(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
    );
  }
}
