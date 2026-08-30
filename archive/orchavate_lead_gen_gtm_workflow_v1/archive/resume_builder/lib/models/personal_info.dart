class PersonalInfo {
  String name;
  String email;
  String phone;
  String address;
  String linkedin;
  String website;
  String summary;
  bool isSelected;

  PersonalInfo({
    this.name = '',
    this.email = '',
    this.phone = '',
    this.address = '',
    this.linkedin = '',
    this.website = '',
    this.summary = '',
    this.isSelected = true,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'phone': phone,
        'address': address,
        'linkedin': linkedin,
        'website': website,
        'summary': summary,
        'isSelected': isSelected,
      };

  factory PersonalInfo.fromJson(Map<String, dynamic> json) => PersonalInfo(
        name: json['name'] ?? '',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        address: json['address'] ?? '',
        linkedin: json['linkedin'] ?? '',
        website: json['website'] ?? '',
        summary: json['summary'] ?? '',
        isSelected: json['isSelected'] ?? true,
      );
}
