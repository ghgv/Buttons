import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/incident.dart';

class IncidentRepository {

  Future<List<Incident>> getIncidents(String token) async {

    final response = await http.get(

      Uri.parse("${ApiConfig.baseUrl}/incidents"),

      headers: {
        "Authorization": "Bearer $token",
      },

    );

    if (response.statusCode != 200) {
      return [];
    }

    final List<dynamic> json = jsonDecode(response.body);

    return json
        .map((e) => Incident.fromJson(e))
        .toList();

  }

  Future<bool> resolve(
      int id,
      bool solved,
      String comment,
      String token) async {

    final response = await http.post(

      Uri.parse("${ApiConfig.baseUrl}/incidents/$id/resolve"),

      headers: {

        "Authorization":"Bearer $token",

        "Content-Type":"application/json",

      },

      body: jsonEncode({

        "resolved": solved,

        "comment": comment,

      }),

    );

    return response.statusCode == 200;

  }

}

Future<bool> resolve(
  int id,
  bool solved,
  String comment,
  String token,
) async {

  final response = await http.post(
    Uri.parse("${ApiConfig.baseUrl}/incidents/$id/resolve"),
    headers: {
      "Authorization": "Bearer $token",
      "Content-Type": "application/json",
    },
    body: jsonEncode({
      "resolved": solved,
      "comment": comment,
    }),
  );

  return response.statusCode == 200;
}
