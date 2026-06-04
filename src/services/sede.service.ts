// services/sede.service.ts
import { api } from "../api/axios.client";
import type { CreateSedeRequest, SedeResponse } from "../schemas/sede.schema";
import axios from "axios";

export const sedeService = {
  create: async (data: CreateSedeRequest): Promise<SedeResponse> => {
    try {
      const { data: response } = await api.post<SedeResponse>("/sedes", data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear la sede");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  getByClientId: async (clientId: string): Promise<SedeResponse[]> => {
    const { data } = await api.get<SedeResponse[]>(`/sedes/client/${clientId}`);
    return data;
  },
  
  update: async (id: string, data: Partial<CreateSedeRequest>): Promise<SedeResponse> => {
    const { data: response } = await api.put<SedeResponse>(`/sedes/${id}`, data);
    return response;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sedes/${id}`);
  },
};