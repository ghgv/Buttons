// App.tsx
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import RoutePublic from "./routes/RoutePublic";
import RoutePrivate from "./routes/RoutePrivate";

// Rutas Públicas
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Rutas Privadas - Principales
import Dashboard from "./pages/dashboard/Dashboard";
import Clientes from "./pages/dashboard/Clientes";
import Usuarios from "./pages/dashboard/Usuarios";
import Settings from "./pages/dashboard/Settings";
import ClienteSedes from "./pages/dashboard/ClienteSedes";
import ClienteSedesNiveles from "./pages/dashboard/ClienteSedesNiveles";
import ClienteSedesNivelesBanios from "./pages/dashboard/ClienteSedesNivelesBanios";

// Rutas Privadas - Anidadas (Cliente -> Sedes -> Niveles -> Baños)


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route element={<RoutePublic isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Rutas Privadas */}
      <Route element={<RoutePrivate isAuthenticated={isAuthenticated} />}>
        {/* Rutas principales */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Rutas anidadas de Clientes -> Sedes */}
        <Route path="clientes/:clienteId/sedes" element={<ClienteSedes />} />
        <Route path="clientes/:clienteId/sedes/:sedeId/niveles" element={<ClienteSedesNiveles />} />
        <Route path="clientes/:clienteId/sedes/:sedeId/niveles/:nivelId/banos" element={<ClienteSedesNivelesBanios />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;