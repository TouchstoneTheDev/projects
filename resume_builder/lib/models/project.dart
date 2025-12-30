class Project {
  String id;
  String name;
  String description;
  String technologies;
  String url;
  bool isSelected;

  Project({
    required this.id,
    this.name = '',
    this.description = '',
    this.technologies = '',
    this.url = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'technologies': technologies,
        'url': url,
        'isSelected': isSelected,
      };

  factory Project.fromJson(Map<String, dynamic> json) => Project(
        id: json['id'],
        name: json['name'] ?? '',
        description: json['description'] ?? '',
        technologies: json['technologies'] ?? '',
        url: json['url'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
