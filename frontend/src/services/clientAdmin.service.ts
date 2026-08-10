import axios from "axios";
import { api } from "../api/axios.client";
import type {
  ClientAdminResponse,
  CreateClientAdminRequest,
  UpdateClientAdminRequest,
} from "../types/clientAdmin.types";

export const clientAdminService = {
  getAll: async (): Promise<ClientAdminResponse[]> => {
    try {
      const { data } = await api.get("/client-admins");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail ||
          "Error al obtener los administradores"
        );
      }

      throw new Error("No se pudo conectar con el servidor");
    }
  },

  create: async (
    request: CreateClientAdminRequest
  ): Promise<ClientAdminResponse> => {
    try {
      const { data } = await api.post("/client-admins", request);
      return data.administrator;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail ||
          "Error al crear el administrador"
        );
      }

      throw new Error("No se pudo conectar con el servidor");
    }
  },

  update: async (
    id: number,
    request: UpdateClientAdminRequest
  ): Promise<ClientAdminResponse> => {
    try {
      const { data } = await api.put(
        `/client-admins/${id}`,
        request
      );

      return data.administrator;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail ||
          "Error al actualizar el administrador"
        );
      }

      throw new Error("No se pudo conectar con el servidor");
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/client-admins/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail ||
          "Error al eliminar el administrador"
        );
      }

      throw new Error("No se pudo conectar con el servidor");
    }
  },
};