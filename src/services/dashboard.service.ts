// services/dashboard.service.ts
import { api } from "../api/axios.client";
import type { DashboardMetricsResponse } from "../schemas/dashboard.schema";
import axios from "axios";

export const dashboardService = {
  // Obtener métricas del dashboard por cliente
  getMetricsByClientId: async (clientId: number): Promise<DashboardMetricsResponse> => {
    try {
      console.log(`📊 Obteniendo métricas para el cliente: ${clientId}`);
      const { data } = await api.get<DashboardMetricsResponse>(`/metrics/client/${clientId}`);
      console.log("✅ Métricas obtenidas:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al obtener métricas:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener métricas");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};