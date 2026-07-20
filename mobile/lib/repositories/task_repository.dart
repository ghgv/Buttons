import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/task.dart';

class TaskRepository {

  Future<List<Task>> getTasks(String token) async {

    final response = await http.get(
      Uri.parse("${ApiConfig.baseUrl}/tasks"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode != 200) {
      return [];
    }

    final List<dynamic> data = jsonDecode(response.body);

    return data
        .map((e) => Task.fromJson(e))
        .toList();
  }
}