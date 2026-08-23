import 'package:firebase_messaging/firebase_messaging.dart';

class FirebaseService {

  static Future<String?> getToken() async {

    final messaging = FirebaseMessaging.instance;

    await messaging.requestPermission();

    return await messaging.getToken();

  }

}