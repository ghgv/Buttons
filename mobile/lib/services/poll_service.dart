import 'dart:async';

import '../providers/incident_provider.dart';
import '../repositories/incident_repository.dart';
import 'storage_service.dart';

class PollService {

  final repository = IncidentRepository();
  final storage = StorageService();

  Timer? timer;

  Future<void> _refresh(
    IncidentProvider provider, {
    bool showLoading = false,
  }) async {

    if (showLoading) {
      provider.setLoading(true);
      provider.setError(null);
    }

    try {

      final token = await storage.getToken();

      if (token == null) {
        provider.setError("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }

      final incidents = await repository
          .getIncidents(token)
          .timeout(
            const Duration(seconds: 8),
          );

      provider.update(incidents);

    } on TimeoutException {

      provider.setError("Tiempo agotado consultando incidencias.");

    } catch (e) {

      provider.setError("No se pudo consultar la lista de incidencias.");

    } finally {

      if (showLoading) {
        provider.setLoading(false);
      }

    }

  }

  void start(
    IncidentProvider provider,
  ) {

    _refresh(
      provider,
      showLoading: true,
    );

    timer = Timer.periodic(
      const Duration(seconds: 10),
      (_) => _refresh(provider),
    );

  }

  void stop() {
    timer?.cancel();
  }

}