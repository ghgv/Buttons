// hooks/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import type { LoginResponse } from "../types/auth.types";
import type { LoginRequest } from "../zod/auth.zod";

// Mapeo de roles a rutas
const ROLE_ROUTES: Record<string, string> = {
  'client_admin': '/admin/dashboard',
  'coordinator': '/coordinator/dashboard',
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log("📦 Datos de login recibidos:", data);
      console.log("👤 User info:", data.user_info);
      console.log("🔑 Token:", data.access_token);
      console.log("🎭 Rol del usuario:", data.user_info.role);
      
      // Guardar en el store
      setAuth(data.user_info, data.access_token);
      
      toast.success(`¡Sesión iniciada como ${data.user_info.name}!`);
      
      // Redirigir según el rol
      const role = data.user_info.role;
      const redirectPath = ROLE_ROUTES[role] || '/dashboard';
      
      console.log("🚀 Redirigiendo a:", redirectPath);
      navigate(redirectPath, { replace: true });
    },
    onError: (error) => {
      console.error("❌ Error en login:", error);
      console.error("📝 Mensaje de error:", error.message);
      
      Swal.fire({
        title: "Error de Acceso",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#3b82f6"
      });
    },
  });
};