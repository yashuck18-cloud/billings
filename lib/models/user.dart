class User {
  final String id;
  final String email;
  final String businessName;
  final String token;

  User({
    required this.id,
    required this.email,
    required this.businessName,
    required this.token,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'businessName': businessName,
        'token': token,
      };

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] as String,
        email: json['email'] as String,
        businessName: json['businessName'] as String,
        token: json['token'] as String,
      );
}
