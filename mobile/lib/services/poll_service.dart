import 'dart:async';

import '../providers/incident_provider.dart';
import '../repositories/incident_repository.dart';
import 'storage_service.dart';

class PollService {

  final repository = IncidentRepository();

  final storage = StorageService();

  Timer? timer;

  void start(IncidentProvider provider){

    timer = Timer.periodic(

      const Duration(seconds:10),

      (_) async {

        final token =
            await storage.getToken();

        if(token==null){

          return;

        }

        final incidents =
            await repository.getIncidents(token);

        provider.update(incidents);

      },

    );

  }

  void stop(){

    timer?.cancel();

  }

}