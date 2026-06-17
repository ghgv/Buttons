// services/dashboard.service.ts
import { api } from "../api/axios.client";
import type { DashboardMetricsResponse } from "../types/dashboard.types";
import axios from "axios";

export const dashboardService = {
  getMetricsByClientId: async (clientId: number): Promise<DashboardMetricsResponse> => {
    try {
      const { data } = await api.get<DashboardMetricsResponse>(`/metrics/client/${clientId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener métricas");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};