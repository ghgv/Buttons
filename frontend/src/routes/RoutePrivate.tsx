// routes/RoutePrivate.tsx
import { Navigate, Routes, Route } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import CoordinatorLayout from "../layouts/CoordinatorLayout";

// Páginas Admin - Desde pages/admin/
import Dashboard from "../pages/admin/Dashboard";
import Alertas from "../pages/admin/Alertas";
import Clientes from "../pages/admin/Clientes";
import ClienteSedes from "../pages/admin/ClienteSedes";
import ClienteSedesNiveles from "../pages/admin/ClienteSedesNiveles";
import ClienteSedesNivelesBanios from "../pages/admin/ClienteSedesNivelesBanios";
import Reportes from "../pages/admin/Reportes";

// Páginas Coordinator
import CoordinatorAlertas from "../pages/coordinator/Alertas";
import CoordinatorTareas from "../pages/coordinator/Tareas";
import type { JSX } from "react/jsx-runtime";
import CoordinatorDashboard from "../pages/coordinator/CoordinatorDashboard";
import Trazabilidad from "../pages/admin/Trazabilidad";

// Componente para redirigir según el rol
const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'client_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === 'coordinator') {
    return <Navigate to="/coordinator/alertas" replace />;
  }

  return <Navigate to="/login" replace />;
};

// ✅ Componente para proteger rutas por rol
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
    // Redirige según el rol
    if (user.role === 'client_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'coordinator') {
      return <Navigate to="/coordinator/alertas" replace />;
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
      {/* Redirección raíz */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Rutas Admin - Protegidas con RoleGuard */}
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
        
        {/* Rutas anidadas de Clientes -> Sedes -> Niveles -> Baños */}
        <Route path="clientes/:clienteId/sedes/:sedeId/niveles/:nivelId/banos" element={<ClienteSedesNivelesBanios />} />
        <Route path="clientes/:clienteId/sedes/:sedeId/niveles" element={<ClienteSedesNiveles />} />
        <Route path="clientes/:clienteId/sedes" element={<ClienteSedes />} />
      </Route>

      {/* Rutas Coordinator - Protegidas con RoleGuard */}
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}