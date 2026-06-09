// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardMetricsResponse } from "../types/dashboard.types";

export const useGetDashboardMetrics = (clientId: number | null) => {
  return useQuery<DashboardMetricsResponse, Error>({
    queryKey: ["dashboard", "metrics", clientId],
    queryFn: () => dashboardService.getMetricsByClientId(clientId!),
    enabled: !!clientId && clientId > 0,
    retry: 1,
    staleTime: 30000,
  });
};