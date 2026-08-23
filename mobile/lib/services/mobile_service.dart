import 'dart:convert';

import 'package:http/http.dart' as http;

import 'storage_service.dart';

class MobileService {

  static Future<void> registerDevice({

    required String fcmToken,

    required Map<String, dynamic> device,

  }) async {

    final storage = StorageService();

    final jwt = await storage.getToken();

    if (jwt == null) return;

    final url = Uri.parse(
      "https://dali.com.co/api/mobile/device",
    );

    final body = {

      "fcm_token": fcmToken,

      "platform": device["platform"],

      "app_version": "1.0.2",

      "model": device["model"],

      "android_version": device["android_version"],

    };

    final response = await http.post(

      url,

      headers: {

        "Authorization": "Bearer $jwt",

        "Content-Type": "application/json",

      },

      body: jsonEncode(body),

    );

    print(response.statusCode);

    print(response.body);

  }

}