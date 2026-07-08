// routes/RoutePrivate.tsx
import { Navigate, Routes, Route } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import CoordinatorLayout from "../layouts/CoordinatorLayout";
import NubewareLayout from "../layouts/NubewareLayout"; // ✅ 1 'e'

// Páginas Admin
import Dashboard from "../pages/admin/Dashboard";
import Alertas from "../pages/admin/Alertas";
import Clientes from "../pages/admin/Clientes";
import ClienteSedes from "../pages/admin/ClienteSedes";
import ClienteSedesNiveles from "../pages/admin/ClienteSedesNiveles";
import ClienteSedesNivelesBanios from "../pages/admin/ClienteSedesNivelesBanios";
import Reportes from "../pages/admin/Reportes";
import Trazabilidad from "../pages/admin/Trazabilidad";

// Páginas Coordinator
import CoordinatorAlertas from "../pages/coordinator/Alertas";
import CoordinatorTareas from "../pages/coordinator/Tareas";
import CoordinatorDashboard from "../pages/coordinator/CoordinatorDashboard";

// Páginas Nubeware - ✅ Corregido a nubeware (1 'e')
import DashboardNubeware from "../pages/nubeware/DashboardNubeware";

import type { JSX } from "react/jsx-runtime";
import ClientesNubeware from "../pages/nubeware/ClientesNubeware";
import SubclientesNubeware from "../pages/nubeware/SubclientesNubeware";

// Componente para redirigir según el rol
const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();
    console.log("AUTH", {
    isAuthenticated,
    role: user?.role,
    user,
  });
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'client_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === 'coordinator') {
    return <Navigate to="/coordinator/alertas" replace />;
  } else if (user.role === "nubeware_admin") {
      return <Navigate to="/nubeware/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

// Componente para proteger rutas por rol
const RoleGuard = ({ 
  children, 
  allowedRoles 
}: { 
  children: JSX.Element, 
  allowedRoles: string[] 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'client_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'coordinator') {
      return <Navigate to="/coordinator/alertas" replace />;
    } else if (user.role === "nubeware_admin") {
      return <Navigate to="/nubeware/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function RoutePrivate() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Rutas Admin */}
      <Route 
        path="/admin" 
        element={
          <RoleGuard allowedRoles={['client_admin']}>
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="trazabilidad" element={<Trazabilidad />} />
        <Route path="clientes/:clienteId/sedes/:sedeId/niveles/:nivelId/banos" element={<ClienteSedesNivelesBanios />} />
        <Route path="clientes/:clienteId/sedes/:sedeId/niveles" element={<ClienteSedesNiveles />} />
        <Route path="clientes/:clienteId/sedes" element={<ClienteSedes />} />
      </Route>

      {/* Rutas Coordinator */}
      <Route 
        path="/coordinator" 
        element={
          <RoleGuard allowedRoles={['coordinator']}>
            <CoordinatorLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/coordinator/dashboard" replace />} />
        <Route path="dashboard" element={<CoordinatorDashboard />} />
        <Route path="alertas" element={<CoordinatorAlertas />} />
        <Route path="tareas" element={<CoordinatorTareas />} />
      </Route>

      {/* ✅ Rutas Nubeware - CORREGIDO a nubeware (1 'e') */}
      <Route 
        path="/nubeware" 
        element={
          <RoleGuard allowedRoles={["nubeware_admin"]}>
            <NubewareLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/nubeware/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardNubeware />} />
        <Route path="clientes" element={<ClientesNubeware />} />
         <Route path="clientes/:clientLocalId/subclientes" element={<SubclientesNubeware />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}