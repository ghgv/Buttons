import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/incident_provider.dart';
import '../../services/poll_service.dart';
import '../incident/incident_screen.dart';

class HomeScreen extends StatefulWidget {

  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() =>
      _HomeScreenState();

}

class _HomeScreenState
    extends State<HomeScreen>{

  final poll = PollService();

  @override
  void initState(){

    super.initState();

    Future.microtask((){

      poll.start(

        context.read<IncidentProvider>(),

      );

    });

  }

  @override
  void dispose(){

    poll.stop();

    super.dispose();

  }

  @override
  Widget build(BuildContext context){

    final provider =
        context.watch<IncidentProvider>();

    return Scaffold(

      appBar: AppBar(

        title: const Text("INCIDENCIAS"),

      ),

      body: ListView.builder(

        itemCount:
            provider.incidents.length,

        itemBuilder: (_,index){

          final incident =
              provider.incidents[index];

          return Card(

            child: ListTile(

              title: Text(
                  incident.alert),

              subtitle: Text(

                  "${incident.client}\n${incident.floor} - ${incident.bathroom}"

              ),

              isThreeLine: true,

              trailing: const Icon(
                  Icons.chevron_right),

              onTap: (){

                Navigator.push(

                  context,

                  MaterialPageRoute(

                    builder: (_)=>

                        IncidentScreen(

                            incident),

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