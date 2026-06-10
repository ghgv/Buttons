import { api } from "../api/axios.client";
import axios from "axios";
import type { LoginRequest } from "../schemas/auth.schema";
import type { LoginResponse } from "../types/auth.types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // Mandamos JSON puro y duro en el body
      const { data } = await api.post<LoginResponse>("/auth/login", credentials);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Mapea el error del JSON de respuesta que envíe tu backend
        throw new Error(error.response.data?.detail || "Error de autenticación");
      }
      throw new Error("No se pudo conectar con el servidor de base de datos");
    }
  },
};