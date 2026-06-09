// services/alertas.service.ts
import { api } from "../api/axios.client";
import axios from "axios";

export interface AlertaEvento {
  cliente: string;
  fecha_hora: string;
  sede: string;
  nivel: string;
  genero_bano: string;
  dispositivo_serie: number;
  tipo_evento: string;
  detalle_evento: string;
  valor: number;
}

export interface AlertasResponse {
  registros_devueltos: number;
  limit: number;
  offset: number;
  historial_eventos: AlertaEvento[];
}

export const alertasService = {
  getAlertas: async (limit: number = 100, offset: number = 0): Promise<AlertasResponse> => {
    try {
      const { data } = await api.get<AlertasResponse>(`/botonera/logs?limit=${limit}&offset=${offset}`);
      console.log("Alertas obtenidas:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener alertas:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener alertas");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};