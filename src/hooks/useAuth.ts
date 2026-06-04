// hooks/useAuth.ts
import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    isAuthenticated: !!user, // ← Útil para saber si hay sesión activa
    logout, // ← Para cerrar sesión desde cualquier lado
  };
};