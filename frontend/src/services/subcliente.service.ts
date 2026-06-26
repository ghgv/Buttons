// services/subcliente.service.ts
import { api } from "../api/axios.client";
import axios from "axios";
import type { SubclienteResponse } from "../types/subcliente.types";

export const subclienteService = {
  // ✅ Obtener subclientes por client_local_id
  getByClientLocalId: async (clientLocalId: number): Promise<SubclienteResponse[]> => {
    try {
      const { data } = await api.get<SubclienteResponse[]>(`/clients/locales/${clientLocalId}`);
      return data || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener los subclientes");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};