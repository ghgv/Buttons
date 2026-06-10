// hooks/useReportes.ts
import { useQuery } from "@tanstack/react-query";
import { reporteService } from "../services/reporte.service";

export const useGetReporteMetrics = (clientId: number | null) => {
  return useQuery({
    queryKey: ["reporte", clientId],
    queryFn: () => reporteService.getMetricsByClientId(clientId!),
    enabled: !!clientId && clientId > 0,
    retry: 1,
    staleTime: 0,
  });
};