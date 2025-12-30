class Skill {
  String id;
  String category;
  String items;
  bool isSelected;

  Skill({
    required this.id,
    this.category = '',
    this.items = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'category': category,
        'items': items,
        'isSelected': isSelected,
      };

  factory Skill.fromJson(Map<String, dynamic> json) => Skill(
        id: json['id'],
        category: json['category'] ?? '',
        items: json['items'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
