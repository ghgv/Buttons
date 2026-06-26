// services/nubewareCliente.service.ts
import { api } from "../api/axios.client";
import axios from "axios";
import type { CreateNubewareClienteRequest } from "../zod/nubewareCliente.zod";
import type { NubewareClienteResponse, NubewareClienteListResponse } from "../types/nubewareCliente.types";

export const nubewareClienteService = {
  getAll: async (): Promise<NubewareClienteResponse[]> => {
    try {
      const { data } = await api.get<NubewareClienteListResponse>("/clients/locales");
      console.log(data)
      return data.data || data || [];

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener los clientes");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  create: async (data: CreateNubewareClienteRequest): Promise<NubewareClienteResponse> => {
    try {
      const { data: response } = await api.post<NubewareClienteResponse>("/clients/locales", data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el cliente");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};