import 'package:flutter/material.dart';

import '../../models/incident.dart';
import '../../repositories/incident_repository.dart';
import '../../services/storage_service.dart';

class IncidentScreen extends StatefulWidget {

  final Incident incident;

  const IncidentScreen(
    this.incident, {
    super.key,
  });

  @override
  State<IncidentScreen> createState() =>
      _IncidentScreenState();

}

class _IncidentScreenState
    extends State<IncidentScreen> {

  final comments =
      TextEditingController();

  final repository =
      IncidentRepository();

  final storage =
      StorageService();

  bool sending = false;

  Future<void> resolve(
    bool solved,
  ) async {

    setState(
      () => sending = true,
    );

    final token =
        await storage.getToken();

    if (token == null) {

      setState(
        () => sending = false,
      );

      return;

    }

    final ok =
        await repository.resolve(

      widget.incident.id,

      solved,

      comments.text,

      token,

    );

    if (!mounted) return;

    setState(
      () => sending = false,
    );

    if (ok) {

      ScaffoldMessenger
          .of(context)
          .showSnackBar(

        SnackBar(

          content: Row(

            children: [

              Icon(
                solved
                    ? Icons.check_circle
                    : Icons.warning_amber_rounded,
                color: Colors.white,
              ),

              const SizedBox(
                width: 10,
              ),

              Expanded(

                child: Text(

                  solved
                      ? "Incidencia solucionada"
                      : "Incidencia marcada como no solucionada",

                ),

              ),

            ],

          ),

          backgroundColor:
              solved
                  ? Colors.green
                  : Colors.orange,

        ),

      );

      Navigator.pop(context);

    } else {

      ScaffoldMessenger
          .of(context)
          .showSnackBar(

        const SnackBar(

          content: Text(
            "Error enviando la respuesta",
          ),

          backgroundColor:
              Colors.red,

        ),

      );

    }

  }

  @override
  void dispose() {

    comments.dispose();

    super.dispose();

  }

  @override
  Widget build(
    BuildContext context,
  ) {

    return Scaffold(

      backgroundColor:
          const Color(0xFFF4F6F8),

      appBar: AppBar(

        backgroundColor:
            const Color(0xFF0D47A1),

        foregroundColor:
            Colors.white,

        elevation: 0,

        title: const Text(

          "DETALLE DE INCIDENCIA",

          style: TextStyle(
            fontWeight:
                FontWeight.bold,
          ),

        ),

      ),

      body: SafeArea(

        child: SingleChildScrollView(

          padding:
              const EdgeInsets.all(16),

          child: Column(

            crossAxisAlignment:
                CrossAxisAlignment.stretch,

            children: [

              // -------------------------
              // INFORMACIÓN INCIDENCIA
              // -------------------------

              Card(

                elevation: 2,

                shape:
                    RoundedRectangleBorder(

                  borderRadius:
                      BorderRadius.circular(
                    16,
                  ),

                ),

                child: Padding(

                  padding:
                      const EdgeInsets.all(
                    20,
                  ),

                  child: Column(

                    crossAxisAlignment:
                        CrossAxisAlignment.start,

                    children: [

                      Row(

                        children: [

                          Container(

                            width: 50,
                            height: 50,

                            decoration:
                                BoxDecoration(

                              color: Colors.orange
                                  .withValues(
                                      alpha: 0.15),

                              borderRadius:
                                  BorderRadius.circular(
                                12,
                              ),

                            ),

                            child: const Icon(

                              Icons
                                  .warning_amber_rounded,

                              color:
                                  Colors.orange,

                              size: 30,

                            ),

                          ),

                          const SizedBox(
                            width: 15,
                          ),

                          Expanded(

                            child: Text(

                              widget
                                  .incident
                                  .alert,

                              style:
                                  const TextStyle(

                                fontSize: 20,

                                fontWeight:
                                    FontWeight.bold,

                              ),

                            ),

                          ),

                        ],

                      ),

                      const SizedBox(
                        height: 20,
                      ),

                      const Divider(),

                      const SizedBox(
                        height: 10,
                      ),

                      _infoRow(

                        Icons.business,

                        "Cliente",

                        widget
                            .incident
                            .client,

                      ),

                      const SizedBox(
                        height: 12,
                      ),

                      _infoRow(

                        Icons.layers_outlined,

                        "Piso",

                        widget
                            .incident
                            .floor,

                      ),

                      const SizedBox(
                        height: 12,
                      ),

                      _infoRow(

                        Icons.wc,

                        "Baño",

                        widget
                            .incident
                            .bathroom,

                      ),

                    ],

                  ),

                ),

              ),

              const SizedBox(
                height: 24,
              ),

              // -------------------------
              // COMENTARIOS
              // -------------------------

              const Text(

                "Acción realizada",

                style: TextStyle(

                  fontSize: 18,

                  fontWeight:
                      FontWeight.bold,

                ),

              ),

              const SizedBox(
                height: 6,
              ),

              const Text(

                "Describe brevemente qué hiciste para atender la incidencia.",

                style: TextStyle(
                  color: Colors.grey,
                ),

              ),

              const SizedBox(
                height: 12,
              ),

              TextField(

                controller:
                    comments,

                maxLines: 5,

                decoration:
                    InputDecoration(

                  hintText:
                      "Escribe aquí los detalles...",

                  filled: true,

                  fillColor:
                      Colors.white,

                  prefixIcon:
                      const Padding(

                    padding:
                        EdgeInsets.only(
                      bottom: 90,
                    ),

                    child: Icon(
                      Icons.edit_note,
                    ),

                  ),

                  border:
                      OutlineInputBorder(

                    borderRadius:
                        BorderRadius.circular(
                      14,
                    ),

                    borderSide:
                        BorderSide.none,

                  ),

                  focusedBorder:
                      OutlineInputBorder(

                    borderRadius:
                        BorderRadius.circular(
                      14,
                    ),

                    borderSide:
                        const BorderSide(

                      color:
                          Color(0xFF0D47A1),

                      width: 2,

                    ),

                  ),

                ),

              ),

              const SizedBox(
                height: 30,
              ),

              // -------------------------
              // BOTÓN SOLUCIONADO
              // -------------------------

              SizedBox(

                height: 56,

                child:
                    ElevatedButton.icon(

                  onPressed:
                      sending
                          ? null
                          : () =>
                              resolve(true),

                  icon: sending

                      ? const SizedBox(

                          width: 22,
                          height: 22,

                          child:
                              CircularProgressIndicator(

                            strokeWidth: 2,

                            color:
                                Colors.white,

                          ),

                        )

                      : const Icon(
                          Icons
                              .check_circle_outline,
                          size: 26,
                        ),

                  label: const Text(

                    "SOLUCIONADO",

                    style: TextStyle(

                      fontSize: 16,

                      fontWeight:
                          FontWeight.bold,

                    ),

                  ),

                  style:
                      ElevatedButton.styleFrom(

                    backgroundColor:
                        const Color.fromARGB(255, 31, 38, 158),

                    foregroundColor:
                        Colors.white,

                    shape:
                        RoundedRectangleBorder(

                      borderRadius:
                          BorderRadius.circular(
                        14,
                      ),

                    ),

                  ),

                ),

              ),

              const SizedBox(
                height: 12,
              ),

              // -------------------------
              // BOTÓN NO SOLUCIONADO
              // -------------------------

              SizedBox(

                height: 56,

                child:
                    ElevatedButton.icon(

                  onPressed:
                      sending
                          ? null
                          : () =>
                              resolve(false),

                  icon: const Icon(

                    Icons
                        .cancel_outlined,

                    size: 26,

                  ),

                  label: const Text(

                    "NO SOLUCIONADO",

                    style: TextStyle(

                      fontSize: 16,

                      fontWeight:
                          FontWeight.bold,

                    ),

                  ),

                  style:
                      ElevatedButton.styleFrom(

                    backgroundColor:
                        const Color.fromARGB(255, 68, 65, 147),

                    foregroundColor:
                        Colors.white,

                    shape:
                        RoundedRectangleBorder(

                      borderRadius:
                          BorderRadius.circular(
                        14,
                      ),

                    ),

                  ),

                ),

              ),

              const SizedBox(
                height: 20,
              ),

            ],

          ),

        ),

      ),

    );

  }

  Widget _infoRow(

    IconData icon,

    String label,

    String value,

  ) {

    return Row(

      children: [

        Icon(

          icon,

          size: 22,

          color:
              const Color(
                0xFF0D47A1,
              ),

        ),

        const SizedBox(
          width: 12,
        ),

        Expanded(

          child: Column(

            crossAxisAlignment:
                CrossAxisAlignment.start,

            children: [

              Text(

                label,

                style:
                    const TextStyle(

                  fontSize: 12,

                  color:
                      Colors.grey,

                ),

              ),

              const SizedBox(
                height: 2,
              ),

              Text(

                value,

                style:
                    const TextStyle(

                  fontSize: 16,

                  fontWeight:
                      FontWeight.w500,

                ),

              ),

            ],

          ),

        ),

      ],

    );

  }

}