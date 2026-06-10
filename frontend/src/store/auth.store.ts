import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "../types/auth.types"; // Tipo importado explícitamente

interface AuthState {
  user: UserInfo | null; // Guardará { name, role }
  token: string | null;
  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);