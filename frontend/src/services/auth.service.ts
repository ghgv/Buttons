import { api } from "../api/axios.client";
import axios from "axios";
import type { LoginRequest } from "../zod/auth.zod";
import type { LoginResponse } from "../types/auth.types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (error) {
      console.error("Error en login:", error);

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail || "Error de autenticación"
        );
      }

      throw new Error(
        "No se pudo conectar con el servidor"
      );
    }
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      const { data } = await api.post(
        "/auth/forgot-password",
        { email }
      );

      return data;
    } catch (error) {
      console.error(
        "Error solicitando recuperación:",
        error
      );

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail ||
            "No fue posible solicitar la recuperación"
        );
      }

      throw new Error(
        "No se pudo conectar con el servidor"
      );
    }
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    try {
      const { data } = await api.post(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

      return data;
    } catch (error) {
      console.error(
        "Error restableciendo contraseña:",
        error
      );

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.detail ||
            "No fue posible restablecer la contraseña"
        );
      }

      throw new Error(
        "No se pudo conectar con el servidor"
      );
    }
  },
};