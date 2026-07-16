import { api } from "../api/axios.client";
import axios from "axios";
import type { LoginRequest } from "../zod/auth.zod";
import type { LoginResponse } from "../types/auth.types";


export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // Mandamos JSON puro y duro en el body
      const { data } = await api.post<LoginResponse>("/auth/login", credentials);
      console.log("Respuesta del backend:", data, credentials); // Log de depuración
      return data;
    } catch (error) {
      console.error("Error en login:", error, credentials); // Log de depuración
      if (axios.isAxiosError(error) && error.response) {
        // Mapea el error del JSON de respuesta que envíe tu backend
        throw new Error(error.response.data?.detail || "Error de autenticación");
      }
      throw new Error("No se pudo conectar con el servidor de base de datos");
    }
  },
};