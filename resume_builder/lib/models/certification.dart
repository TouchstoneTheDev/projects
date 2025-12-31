class Certification {
  String id;
  String name;
  String issuer;
  String date;
  String credentialId;
  bool isSelected;

  Certification({
    required this.id,
    this.name = '',
    this.issuer = '',
    this.date = '',
    this.credentialId = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'issuer': issuer,
        'date': date,
        'credentialId': credentialId,
        'isSelected': isSelected,
      };

  factory Certification.fromJson(Map<String, dynamic> json) => Certification(
        id: json['id'],
        name: json['name'] ?? '',
        issuer: json['issuer'] ?? '',
        date: json['date'] ?? '',
        credentialId: json['credentialId'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
