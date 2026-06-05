// services/contador.service.ts
import { api } from "../api/axios.client";
import type { CreateContadorRequest, ContadorResponse } from "../schemas/contador.schema";
import axios from "axios";

export const contadorService = {
  // ✅ Crear un contador
  create: async (data: CreateContadorRequest): Promise<ContadorResponse> => {
    try {
      console.log("📤 Enviando contador al backend:", data);
      const { data: response } = await api.post<ContadorResponse>("/contadores", data);
      console.log("✅ Contador creado:", response);
      return response;
    } catch (error) {
      console.error("❌ Error al crear contador:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el contador");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // ✅ Obtener TODOS los contadores de un baño
  getByBathroomId: async (bathroomId: number): Promise<ContadorResponse[]> => {
    try {
      console.log(`🔍 Buscando contadores para el baño ID: ${bathroomId}`);
      const { data } = await api.get<ContadorResponse[]>(`/contadores/${bathroomId}`);
      console.log("📊 Contadores encontrados:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error al obtener contadores:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener contadores");
      }
      return []; // Retornar array vacío en caso de error
    }
  },
  
  // Obtener un contador por ID
  getById: async (id: string): Promise<ContadorResponse> => {
    try {
      const { data } = await api.get<ContadorResponse>(`/contadores/${id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener el contador");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Actualizar un contador
  update: async (id: string, data: Partial<CreateContadorRequest>): Promise<ContadorResponse> => {
    try {
      const { data: response } = await api.put<ContadorResponse>(`/contadores/${id}`, data);
      console.log("✏️ Contador actualizado:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al actualizar el contador");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Eliminar un contador
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/contadores/${id}`);
      console.log("🗑️ Contador eliminado:", id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al eliminar el contador");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};