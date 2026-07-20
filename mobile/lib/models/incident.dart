class Incident {

  final int id;
  final String client;
  final String floor;
  final String bathroom;
  final String alert;
  final DateTime createdAt;

  Incident({
    required this.id,
    required this.client,
    required this.floor,
    required this.bathroom,
    required this.alert,
    required this.createdAt,
  });

  factory Incident.fromJson(Map<String, dynamic> json) {

    return Incident(
      id: json["id"],
      client: json["client"],
      floor: json["floor"],
      bathroom: json["bathroom"],
      alert: json["alert"],
      createdAt: DateTime.parse(json["created_at"]),
    );

  }

}