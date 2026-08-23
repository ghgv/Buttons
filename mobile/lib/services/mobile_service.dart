import 'dart:convert';
import 'package:http/http.dart' as http;

import 'storage_service.dart';

class MobileService {

  static Future<void> registerDevice({

    required String fcmToken,

    required Map<String, dynamic> device,

  }) async {

    print("========== REGISTER DEVICE ==========");

    final storage = StorageService();

    final jwt = await storage.getToken();

    print("JWT: $jwt");

    if (jwt == null) {
      print("JWT es NULL");
      return;
    }

    print("FCM: $fcmToken");

    print("DEVICE: $device");

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

    print("POST $url");
    print(jsonEncode(body));

    try {

  print("ANTES DEL POST");

  final response = await http
      .post(
        url,
        headers: {
          "Authorization": "Bearer $jwt",
          "Content-Type": "application/json",
        },
        body: jsonEncode(body),
      )
      .timeout(const Duration(seconds: 10));

  print("DESPUES DEL POST");
  print(response.statusCode);
  print(response.body);

} catch (e, s) {

  print("ERROR EN HTTP");
  print(e);
  print(s);

}

    try {

      final response = await http.post(

        url,

        headers: {

          "Authorization": "Bearer $jwt",

          "Content-Type": "application/json",

        },

        body: jsonEncode(body),

      );

      print("STATUS: ${response.statusCode}");
      print("BODY: ${response.body}");

    } catch (e, s) {

      print("ERROR HTTP");
      print(e);
      print(s);

    }
  }
}