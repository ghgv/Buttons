// services/nivel.service.ts
import { api } from "../api/axios.client";
import type { CreateNivelRequest, NivelResponse } from "../schemas/nivel.schema";
import axios from "axios";

export const nivelService = {
  create: async (data: CreateNivelRequest): Promise<NivelResponse> => {
    try {
      const { data: response } = await api.post<NivelResponse>("/levels", data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el nivel");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  getAll: async (): Promise<NivelResponse[]> => {
    const { data } = await api.get<NivelResponse[]>("/levels");
    return data;
  },
  
  getBySedeId: async (sedeId: string): Promise<NivelResponse[]> => {
    const { data } = await api.get<NivelResponse[]>(`/levels/${sedeId}`);
    return data;
  },

  update: async (id: string, data: Partial<CreateNivelRequest>): Promise<NivelResponse> => {
    const { data: response } = await api.put<NivelResponse>(`/levels/${id}`, data);
    return response;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/levels/${id}`);
  },
};