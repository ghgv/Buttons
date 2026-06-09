// hooks/useReportes.ts
import { useQuery } from "@tanstack/react-query";
import { reporteService, type DashboardMetricsResponse } from "../services/reporte.service";

export const useGetReporteMetrics = (clientId: number | null) => {
  return useQuery<DashboardMetricsResponse, Error>({
    queryKey: ["reporte", clientId],
    queryFn: () => reporteService.getMetricsByClientId(clientId!),
    enabled: !!clientId && clientId > 0,
    retry: 1,
  });
};