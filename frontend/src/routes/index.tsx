// routes/index.tsx
import { Routes, Route } from "react-router";
import { useAuth } from "../hooks/useAuth";

import RoutePublic from "./RoutePublic";
import RoutePrivate from "./RoutePrivate";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* Esta ruta siempre debe ser accesible,
          incluso si el usuario ya tiene sesión */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Resto de la aplicación */}
      <Route
        path="/*"
        element={
          isAuthenticated
            ? <RoutePrivate />
            : <RoutePublic />
        }
      />

    </Routes>
  );
}