// hooks/useAuth.ts

import { useAuthStore } from "../store/auth.store";

function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payloadBase64 = token.split(".")[1];

    if (!payloadBase64) return false;

    const payload = JSON.parse(atob(payloadBase64));

    // Si no existe exp, consideramos el token inválido
    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);

    return payload.exp > now;

  } catch (error) {
    console.error("Token JWT inválido:", error);
    return false;
  }
}

export const useAuth = () => {

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const tokenValid = isTokenValid(token);

  return {
    user,
    token,

    // Hay sesión solamente si:
    // 1. Existe usuario
    // 2. Existe JWT válido
    // 3. JWT no ha expirado
    isAuthenticated: !!user && tokenValid,

    logout,
  };
};