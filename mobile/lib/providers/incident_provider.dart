import 'package:flutter/material.dart';

import '../models/incident.dart';

class IncidentProvider extends ChangeNotifier {

  bool _loading = true;
  bool get loading => _loading;

  String? _error;
  String? get error => _error;

  List<Incident> _incidents = [];
  List<Incident> get incidents => _incidents;

  void setLoading(bool value) {
    _loading = value;
    notifyListeners();
  }

  void setError(String? value) {
    _error = value;
    notifyListeners();
  }

  void update(List<Incident> list) {
    _incidents = list;
    _error = null;
    notifyListeners();
  }

}