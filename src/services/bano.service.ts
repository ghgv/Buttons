// services/bano.service.ts
import { api } from "../api/axios.client";
import type { CreateBanoRequest, BanoResponse } from "../schemas/bano.schema";
import axios from "axios";

export const banoService = {
  create: async (data: CreateBanoRequest): Promise<BanoResponse> => {
    try {
      const { data: response } = await api.post<BanoResponse>("/banos", data);
      console.log("✅ Baño creado:", response);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el baño");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  getByNivelId: async (nivelId: string): Promise<BanoResponse[]> => {
    const { data } = await api.get<BanoResponse[]>(`/banos/nivel/${nivelId}`);
    return Array.isArray(data) ? data : [];
  },
  
  update: async (id: string, data: Partial<CreateBanoRequest>): Promise<BanoResponse> => {
    const { data: response } = await api.put<BanoResponse>(`/banos/${id}`, data);
    return response;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/banos/${id}`);
  },
};