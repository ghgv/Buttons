// services/sede.service.ts
import { api } from "../api/axios.client";
import type { CreateSedeRequest } from "../zod/sede.zod";
import axios from "axios";
import type { SedeResponse } from "../types/sede.types";

export const sedeService = {
  create: async (data: CreateSedeRequest): Promise<SedeResponse> => {
    try {
      console.log("BASE URL:", api.defaults.baseURL);
console.log("POST URL:", api.getUri({ url: "/sedes" }));
      const  response  = await api.post<SedeResponse>("/sedes/", data);
      console.log("BASE URL:", api.defaults.baseURL);
console.log("REQUEST URL:", response.request.responseURL);
console.log("STATUS:", response.status);
console.log("DATA:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("CONFIG:", error.config);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
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