// services/cliente.service.ts
import { api } from "../api/axios.client";
import type { CreateClienteRequest, ClienteResponse } from "../schemas/cliente.schema";
import axios from "axios";
import type { SedeResponse } from "../schemas/sede.schema";

export const clienteService = {
  create: async (data: CreateClienteRequest): Promise<ClienteResponse> => {
    try {
      // Envía JSON puro al backend
      const { data: response } = await api.post<ClienteResponse>("/clients", data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el cliente");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  // Para futuras funcionalidades
  getAll: async (): Promise<ClienteResponse[]> => {
    const { data } = await api.get<ClienteResponse[]>("/clients");
    return data;
  },
  
  getById: async (id: string): Promise<ClienteResponse> => {
    const { data } = await api.get<ClienteResponse>(`/clients/${id}`);
    return data;
  },


  // ✅ Este es el que necesitas - Obtener sedes de un cliente
  getSedesByClientId: async (clientId: string): Promise<SedeResponse[]> => {
    try {
      console.log(`🔍 Buscando sedes para el cliente: ${clientId}`);
      const { data } = await api.get<SedeResponse[]>(`/clients/${clientId}`);
      console.log("📊 Sedes encontradas:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al obtener sedes del cliente:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al obtener sedes");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  update: async (id: string, data: Partial<CreateClienteRequest>): Promise<ClienteResponse> => {
    const { data: response } = await api.put<ClienteResponse>(`/clients/${id}`, data);
    return response;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
 


};



