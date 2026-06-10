// services/contador.service.ts
import { api } from "../api/axios.client";
import type { CreateContadorRequest } from "../schemas/contador.schema";
import type { ContadorResponse } from "../types/contador.types";
import axios from "axios";

export const contadorService = {
  create: async (data: CreateContadorRequest): Promise<ContadorResponse> => {
    try {
      console.log("📤 Enviando contador:", data);
      const { data: response } = await api.post<ContadorResponse>("/contadores", data);
      console.log("✅ Contador creado:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el contador");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  getByBathroomId: async (bathroomId: number): Promise<ContadorResponse[]> => {
    try {
      console.log(`🔍 Buscando contadores para el baño: ${bathroomId}`);
      const { data } = await api.get<ContadorResponse[]>(`/contadores/${bathroomId}`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error al obtener contadores:", error);
      return [];
    }
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contadores/${id}`);
  },
};