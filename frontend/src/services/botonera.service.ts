// services/botonera.service.ts
import type { CreateBotoneraRequest } from "../zod/botonera.zod";
import type { 
  BotoneraResponse
} from "../types/botonera.types";
import { api } from "../api/axios.client";
import axios from "axios";

const handleServiceError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.detail || defaultMessage);
  }
  throw new Error("No se pudo conectar con el servidor o el servicio no está disponible");
};

export const botoneraService = {
  /**
   * Crea y vincula una botonera a un baño.
   */
  create: async (data: CreateBotoneraRequest): Promise<BotoneraResponse> => {
    console.group("➕ [BotoneraService] Creando nueva botonera");
    console.log("Payload enviado al servidor:", data);
    try {
      const {data: response} = await api.post<BotoneraResponse>("/botonera", data);
      return response;
    } catch (error) {
      return handleServiceError(error, "Error al crear el contador en el servidor");
    }
  },

  /**
   * Recupera las botoneras asignadas a un baño específico.
   */
  getByBathroomId: async (bathroomId: number): Promise<BotoneraResponse[]> => {
    console.group(`🔍 [BotoneraService] Solicitando botoneras del baño ID: ${bathroomId}`);
    try {
      const url = `/botonera/bathroom/${bathroomId}`; 
      const response = await api.get<BotoneraResponse[]>(url);
      console.log("✅ Servidor respondió (Lista de botoneras):", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error("❌ Error en getByBathroomId:", error);
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Obtiene los datos duros de una botonera por su ID.
   */
  getById: async (id: number): Promise<BotoneraResponse> => {
    console.group(`🆔 [BotoneraService] Buscando botonera por ID: ${id}`);
    try {
      const url = `/botonera/${id}`;
      const response = await api.get<BotoneraResponse>(url);
      console.log("✅ Servidor respondió (Botonera localizada):", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error("❌ Error en getById:", error);
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Obtiene una botonera con su historial detallado y paginado.
   */
  // getByIdWithLogs: async (id: number, params: GetBotoneraLogsParams): Promise<BotoneraWithLogsResponse> => {
  //   console.group(`📜 [BotoneraService] Solicitando historial de la botonera ID: ${id}`);
  //   console.log("Parámetros de paginación/filtros:", params);
  //   try {
  //     const url = `/botonera/${id}/logs`;
  //     const response = await api.get<BotoneraWithLogsResponse>(url, { params });
  //     console.log("✅ Servidor respondió (Historial recuperado):", response.data);
  //     console.groupEnd();
  //     return response.data;
  //   } catch (error) {
  //     console.groupEnd();
  //     return handleServiceError(
  //       error,
  //       `Error al recuperar el historial de la botonera con código único: ${id}`
  //     );
  //   }
  // },

  /**
   * Actualiza propiedades parciales de la botonera.
   */
  update: async (id: number, data: Partial<CreateBotoneraRequest>): Promise<BotoneraResponse> => {
    console.group(`📝 [BotoneraService] Actualizando botonera ID: ${id}`);
    try {
      const url = `/botonera/${id}`;
      const response = await api.put<BotoneraResponse>(url, data);
      console.log("✅ Servidor respondió (Botonera actualizada):", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error("❌ Error en update:", error);
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Elimina una botonera usando su código único numérico.
   */
  delete: async (id: number): Promise<void> => {
    console.group(`🗑️ [BotoneraService] Eliminando botonera ID: ${id}`);
    try {
      const url = `/botonera/${id}`;
      await api.delete(url);
      console.log(`✅ Botonera ID: ${id} removida exitosamente.`);
      console.groupEnd();
    } catch (error) {
      console.error("❌ Error en delete:", error);
      console.groupEnd();
      throw error;
    }
  },
};