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

export interface SedeInfo {
  id: number;
  name: string;
  eventos: Omit<EventoReporte, 'sede'>[];
}

export interface DashboardMetricsResponse {
  client_id: number;
  resumen_infraestructura: ResumenInfraestructura;
  total_eventos: number;
  sedes_info: SedeInfo[];
}

export const reporteService = {
  getMetricsByClientId: async (clientId: number) => {
    try {
      const { data } = await api.get<DashboardMetricsResponse>(`/metrics/client/${clientId}`);
      
      // Aplanar los eventos y agregar la propiedad 'sede'
      const eventos = data.sedes_info.flatMap(sede => 
        sede.eventos.map(evento => ({
          ...evento,
          sede: sede.name
        }))
      );
      
     
      
      return {
        client_id: data.client_id,
        resumen_infraestructura: data.resumen_infraestructura,
        total_eventos: data.total_eventos,
        sedes_info: data.sedes_info,
        eventos: eventos
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener métricas");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};