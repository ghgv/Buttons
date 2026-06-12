// services/botonera.service.ts
import { api } from "../api/axios.client";
import type { CreateBotoneraRequest } from "../zod/botonera.zod";
import type { BotoneraResponse } from "../types/botonera.types";
import axios from "axios";

export const botoneraService = {
  create: async (data: CreateBotoneraRequest): Promise<BotoneraResponse> => {
    try {
      console.log("📤 Enviando botonera:", data);
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
  
  getByBathroomId: async (bathroomId: number): Promise<BotoneraResponse[]> => {
    try {
      console.log(`🔍 Buscando botoneras para el baño: ${bathroomId}`);
      const { data } = await api.get<BotoneraResponse[]>(`/botonera/${bathroomId}`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error al obtener botoneras:", error);
      return [];
    }
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/botoneras/${id}`);
  },
};