import 'package:flutter/material.dart';

import '../models/incident.dart';

class IncidentProvider extends ChangeNotifier {

  List<Incident> _incidents = [];

  List<Incident> get incidents => _incidents;

  void update(List<Incident> list) {

    _incidents = list;

    notifyListeners();

  }

}