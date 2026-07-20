import 'package:flutter/material.dart';

import '../../models/incident.dart';
import '../../repositories/incident_repository.dart';
import '../../services/storage_service.dart';

class IncidentScreen extends StatefulWidget {
  final Incident incident;

  const IncidentScreen(this.incident, {super.key});

  @override
  State<IncidentScreen> createState() => _IncidentScreenState();
}

class _IncidentScreenState extends State<IncidentScreen> {
  final comments = TextEditingController();

  final repository = IncidentRepository();
  final storage = StorageService();

  bool sending = false;

  Future<void> resolve(bool solved) async {
    setState(() => sending = true);

    final token = await storage.getToken();

    if (token == null) {
      setState(() => sending = false);
      return;
    }

    final ok = await repository.resolve(
      widget.incident.id,
      solved,
      comments.text,
      token,
    );

    if (!mounted) return;

    setState(() => sending = false);

    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            solved
                ? "Incidencia solucionada"
                : "Incidencia marcada como no solucionada",
          ),
        ),
      );

      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Error enviando la respuesta"),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("INCIDENCIA"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [

            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    Text(
                      widget.incident.alert,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text("Cliente: ${widget.incident.client}"),
                    Text("Piso: ${widget.incident.floor}"),
                    Text("Baño: ${widget.incident.bathroom}"),

                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            TextField(
              controller: comments,
              maxLines: 5,
              decoration: const InputDecoration(
                labelText: "¿Qué hizo?",
                border: OutlineInputBorder(),
              ),
            ),

            const Spacer(),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed:
                    sending ? null : () => resolve(true),
                icon: const Icon(Icons.check),
                label: const Text("SOLUCIONADO"),
              ),
            ),

            const SizedBox(height: 10),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed:
                    sending ? null : () => resolve(false),
                icon: const Icon(Icons.close),
                label: const Text("NO SOLUCIONADO"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}