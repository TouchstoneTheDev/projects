class WorkExperience {
  String id;
  String company;
  String position;
  String startDate;
  String endDate;
  String description;
  bool isSelected;

  WorkExperience({
    required this.id,
    this.company = '',
    this.position = '',
    this.startDate = '',
    this.endDate = '',
    this.description = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'company': company,
        'position': position,
        'startDate': startDate,
        'endDate': endDate,
        'description': description,
        'isSelected': isSelected,
      };

  factory WorkExperience.fromJson(Map<String, dynamic> json) => WorkExperience(
        id: json['id'],
        company: json['company'] ?? '',
        position: json['position'] ?? '',
        startDate: json['startDate'] ?? '',
        endDate: json['endDate'] ?? '',
        description: json['description'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
