import axios from "axios";
import { env } from "../config/env.config";
import { useAuthStore } from "../store/auth.store";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar automáticamente el Bearer Token a las rutas protegidas
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token directamente del estado de Zustand
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      // Inyectamos el formato estándar: Bearer eyJhbGciOi...
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);