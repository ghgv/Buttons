import 'package:flutter/material.dart';

import '../models/task.dart';

class TaskProvider extends ChangeNotifier {

  List<Task> _tasks = [];

  List<Task> get tasks => _tasks;

  void setTasks(List<Task> list) {

    _tasks = list;

    notifyListeners();

  }

}