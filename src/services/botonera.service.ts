// services/botonera.service.ts
import { api } from "../api/axios.client";
import type { CreateBotoneraRequest, BotoneraResponse } from "../schemas/botonera.schema";
import axios from "axios";

export const botoneraService = {
  // Crear una nueva botonera
  create: async (data: CreateBotoneraRequest): Promise<BotoneraResponse> => {
    try {
      const { data: response } = await api.post<BotoneraResponse>("/botonera", data);
      console.log("✅ Botonera creada:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear la botonera");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // ✅ Obtener TODAS las botoneras de un baño específico
  getByBathroomId: async (bathroomId: string): Promise<BotoneraResponse[]> => {
    try {
      console.log(`🔍 Buscando botoneras para el baño: ${bathroomId}`);
      const { data } = await api.get<BotoneraResponse[]>(`/botonera/${bathroomId}`);
      console.log("📊 Botoneras encontradas:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error al obtener botoneras:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener botoneras");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Obtener una botonera por ID
  getById: async (id: string): Promise<BotoneraResponse> => {
    try {
      const { data } = await api.get<BotoneraResponse>(`/botonera/${id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener la botonera");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Actualizar una botonera
  update: async (id: string, data: Partial<CreateBotoneraRequest>): Promise<BotoneraResponse> => {
    try {
      const { data: response } = await api.put<BotoneraResponse>(`/botonera/${id}`, data);
      console.log("✏️ Botonera actualizada:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al actualizar la botonera");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Eliminar una botonera
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/botoneras/${id}`);
      console.log("🗑️ Botonera eliminada:", id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al eliminar la botonera");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};