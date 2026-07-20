class Task {

  final int id;
  final String title;
  final String description;
  final String priority;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.priority,
  });

  factory Task.fromJson(Map<String,dynamic> json){

    return Task(
      id: json["id"],
      title: json["title"],
      description: json["description"] ?? "",
      priority: json["priority"] ?? "NORMAL",
    );

  }

}