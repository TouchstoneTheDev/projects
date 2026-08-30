class Education {
  String id;
  String institution;
  String degree;
  String fieldOfStudy;
  String year;
  String gpa;
  bool isSelected;

  Education({
    required this.id,
    this.institution = '',
    this.degree = '',
    this.fieldOfStudy = '',
    this.year = '',
    this.gpa = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'institution': institution,
        'degree': degree,
        'fieldOfStudy': fieldOfStudy,
        'year': year,
        'gpa': gpa,
        'isSelected': isSelected,
      };

  factory Education.fromJson(Map<String, dynamic> json) => Education(
        id: json['id'],
        institution: json['institution'] ?? '',
        degree: json['degree'] ?? '',
        fieldOfStudy: json['fieldOfStudy'] ?? '',
        year: json['year'] ?? '',
        gpa: json['gpa'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
