import { api } from "../api/axios.client";
import type { CreateClienteRequest } from "../zod/cliente.zod";
import axios from "axios";
import type { SedeResponse } from "../types/sede.types";
import type { ClienteResponse } from "../types/cliente.types";

export const clienteService = {
  create: async (data: CreateClienteRequest): Promise<ClienteResponse> => {
    try {
      const { data: response } = await api.post<ClienteResponse>("/clients", data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al crear el cliente");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
getAll: async (): Promise<ClienteResponse[]> => {
  try {
    const response = await api.get("/clients/");

    console.log("========== CLIENTES ==========");
    console.log("URL:", response.request.responseURL);
    console.log("STATUS:", response.status);
    console.log("CONTENT-TYPE:", response.headers["content-type"]);
    console.log("DATA:", response.data);
    console.log("ARRAY:", Array.isArray(response.data));

    return response.data;
  } catch (error) {
    console.error("ERROR CLIENTES:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.detail || "Error al recuperar la lista de clientes");
    }
    throw new Error("No se pudo conectar con el servidor");
  }
},
  
  getById: async (id: string): Promise<ClienteResponse> => {
    try {
      const { data } = await api.get<ClienteResponse>(`/clients/${id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || `Error al recuperar el cliente con ID: ${id}`);
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

 // El comentario dice una cosa, pero el código hace otra totalmente diferente
// ✅ CORREGIDO: Endpoint apuntando correctamente a la colección anidada de sedes
getSedesByClientId: async (clientId: string): Promise<SedeResponse[]> => {
  const { data } = await api.get<SedeResponse[]>(`/clients/${clientId}`);
  return data;
},
  
  update: async (id: string, data: Partial<CreateClienteRequest>): Promise<ClienteResponse> => {
    try {
      const { data: response } = await api.put<ClienteResponse>(`/clients/${id}`, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al actualizar los datos del cliente");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`); // Corregido de /clientes a /clients de forma consistente
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.detail || "Error al intentar eliminar el cliente");
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};