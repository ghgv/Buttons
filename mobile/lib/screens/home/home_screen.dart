import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/incident_provider.dart';
import '../../services/poll_service.dart';
import '../../services/storage_service.dart';

import '../incident/incident_screen.dart';
import '../login/login_screen.dart';

class HomeScreen extends StatefulWidget {

  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();

}

class _HomeScreenState extends State<HomeScreen> {

  final poll = PollService();
  final storage = StorageService();

  @override
  void initState() {

    super.initState();

    Future.microtask(() {

      poll.start(
        context.read<IncidentProvider>(),
      );

    });

  }

  @override
  void dispose() {

    poll.stop();
    super.dispose();

  }

  Future<void> _logout() async {

    poll.stop();

    await storage.logout();

    if (!mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (_) => const LoginScreen(),
      ),
      (route) => false,
    );

  }

  @override
  Widget build(BuildContext context) {

    final provider =
        context.watch<IncidentProvider>();

    return Scaffold(

      backgroundColor:
          const Color(0xFFF4F6F8),

      appBar: AppBar(

        backgroundColor:
            const Color(0xFF0D47A1),

        foregroundColor:
            Colors.white,

        elevation: 0,

        title: const Row(

          children: [

            Icon(
              Icons.notifications_active_outlined,
            ),

            SizedBox(width: 10),

            Text(
              "INCIDENCIAS",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),

          ],

        ),

        actions: [

          IconButton(
            icon: const Icon(
              Icons.logout,
            ),
            tooltip: "Cerrar sesión",
            onPressed: _logout,
          ),

          const SizedBox(width: 8),

        ],

      ),

      body: provider.incidents.isEmpty

          ? const Center(

              child: Column(

                mainAxisAlignment:
                    MainAxisAlignment.center,

                children: [

                  Icon(
                    Icons.check_circle_outline,
                    size: 70,
                    color: Colors.green,
                  ),

                  SizedBox(height: 16),

                  Text(
                    "Buscando incidencias",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  SizedBox(height: 6),

                  Text(
                    "Conecting to server...",
                    style: TextStyle(
                      color: Colors.grey,
                    ),
                  ),

                ],

              ),

            )

          : ListView.builder(

              padding:
                  const EdgeInsets.all(12),

              itemCount:
                  provider.incidents.length,

              itemBuilder: (_, index) {

                final incident =
                    provider.incidents[index];

                return Card(

                  margin:
                      const EdgeInsets.only(
                    bottom: 12,
                  ),

                  elevation: 2,

                  shape:
                      RoundedRectangleBorder(

                    borderRadius:
                        BorderRadius.circular(
                      14,
                    ),

                  ),

                  child: ListTile(

                    contentPadding:
                        const EdgeInsets.all(
                      16,
                    ),

                    leading: Container(

                      width: 48,
                      height: 48,

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
                        Icons.warning_amber_rounded,
                        color: Colors.orange,
                        size: 28,
                      ),

                    ),

                    title: Text(

                      incident.alert,

                      style:
                          const TextStyle(

                        fontSize: 16,

                        fontWeight:
                            FontWeight.bold,

                      ),

                    ),

                    subtitle: Padding(

                      padding:
                          const EdgeInsets.only(
                        top: 8,
                      ),

                      child: Column(

                        crossAxisAlignment:
                            CrossAxisAlignment.start,

                        children: [

                          Row(

                            children: [

                              const Icon(
                                Icons.business,
                                size: 16,
                                color: Colors.grey,
                              ),

                              const SizedBox(
                                  width: 6),

                              Expanded(
                                child: Text(
                                  incident.client,
                                ),
                              ),

                            ],

                          ),

                          const SizedBox(
                              height: 5),

                          Row(

                            children: [

                              const Icon(
                                Icons.location_on_outlined,
                                size: 16,
                                color: Colors.grey,
                              ),

                              const SizedBox(
                                  width: 6),

                              Expanded(

                                child: Text(
                                  "${incident.floor} - "
                                  "${incident.bathroom}",
                                ),

                              ),

                            ],

                          ),

                        ],

                      ),

                    ),

                    trailing:
                        const Icon(
                      Icons.chevron_right,
                    ),

                    onTap: () {

                      Navigator.push(

                        context,

                        MaterialPageRoute(

                          builder: (_) =>
                              IncidentScreen(
                            incident,
                          ),

                        ),

                      );

                    },

                  ),

                );

              },

            ),

    );

  }

}