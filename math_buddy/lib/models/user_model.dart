class UserModel {
  final String name;
  final String email;
  final String phone;
  final String childName;

  UserModel({
    required this.name,
    required this.email,
    required this.phone,
    required this.childName,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'phone': phone,
        'childName': childName,
      };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        name: json['name'] ?? '',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        childName: json['childName'] ?? '',
      );
}
