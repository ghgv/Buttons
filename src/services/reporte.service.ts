// services/reporte.service.ts
import { api } from "../api/axios.client";
import axios from "axios";

export interface EventoReporte {
  fecha_hora: string;
  sede: string;
  nivel: string;
  genero_bano: string;
  dispositivo_serie: number;
  tipo_evento: "ingreso" | "alerta";
  detalle_evento: string;
  valor: number;
}

export interface ResumenInfraestructura {
  total_sedes: number;
  total_levels: number;
  total_bathrooms: number;
}

export interface DashboardMetricsResponse {
  client_id: number;
  resumen_infraestructura: ResumenInfraestructura;
  total_eventos: number;
  eventos: EventoReporte[];
}

export const reporteService = {
  getMetricsByClientId: async (clientId: number): Promise<DashboardMetricsResponse> => {
    try {
      console.log(`📊 Obteniendo métricas para cliente: ${clientId}`);
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