import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';

class DeviceService {

  static Future<Map<String, dynamic>> getInfo() async {

    final plugin = DeviceInfoPlugin();

    if (Platform.isAndroid) {

      final info = await plugin.androidInfo;

      return {

        "platform": "android",

        "model": info.model,

        "manufacturer": info.manufacturer,

        "brand": info.brand,

        "device": info.device,

        "android_version": info.version.release,

        "sdk": info.version.sdkInt,

      };

    }

    return {

      "platform": "unknown",

    };

  }

}