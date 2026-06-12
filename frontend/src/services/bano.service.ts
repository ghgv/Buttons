// services/bano.service.ts
import { api } from "../api/axios.client";
import type { CreateBanoRequest } from "../zod/bano.zod";
import axios from "axios";
import type { BanoResponse } from "../types/bano.types";

export const banoService = {
  // Crear un nuevo baño
  create: async (data: CreateBanoRequest): Promise<BanoResponse> => {
    try {
      const { data: response } = await api.post<BanoResponse>("/bathrooms", data);
      console.log("✅ Baño creado:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el baño");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // ✅ Obtener TODOS los baños por level_id
  getByLevelId: async (levelId: string): Promise<BanoResponse[]> => {
    try {
      console.log(`🔍 Buscando baños para el nivel: ${levelId}`);
      const { data } = await api.get<BanoResponse[]>(`/bathrooms/${levelId}`);
      console.log("📊 Baños encontrados:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error al obtener baños:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener baños");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Obtener un baño por ID
  getById: async (id: string): Promise<BanoResponse> => {
    try {
      const { data } = await api.get<BanoResponse>(`/bathrooms/${id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener el baño");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Actualizar un baño
  update: async (id: string, data: Partial<CreateBanoRequest>): Promise<BanoResponse> => {
    try {
      const { data: response } = await api.put<BanoResponse>(`/bathrooms/${id}`, data);
      console.log("✏️ Baño actualizado:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al actualizar el baño");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Eliminar un baño
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/bathrooms/${id}`);
      console.log("🗑️ Baño eliminado:", id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al eliminar el baño");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};