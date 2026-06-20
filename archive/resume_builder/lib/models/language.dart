class Language {
  String id;
  String name;
  String proficiency;
  bool isSelected;

  Language({
    required this.id,
    this.name = '',
    this.proficiency = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'proficiency': proficiency,
        'isSelected': isSelected,
      };

  factory Language.fromJson(Map<String, dynamic> json) => Language(
        id: json['id'],
        name: json['name'] ?? '',
        proficiency: json['proficiency'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
