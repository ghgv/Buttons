import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Sincronizamos con la nueva estructura del JSON
      setAuth(data.user_info, data.access_token);
      
      toast.success(`¡Sesión iniciada como ${data.user_info.name}!`);
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
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