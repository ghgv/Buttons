import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';

class AuthService {

  Future<String?> login(
      String username,
      String password) async {

    final response = await http.post(

      Uri.parse("${ApiConfig.baseUrl}/auth/login"),

      headers: {
        "Content-Type":"application/json"
      },

      body: jsonEncode({

        "username":username,
        "password":password

      }),

    );

    if(response.statusCode==200){

      final json = jsonDecode(response.body);

      return json["token"];

    }

    return null;

  }

}