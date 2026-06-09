// routes/RoutePrivate.tsx
import { Navigate, Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sheet
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

interface PrivateLayoutProps {
  isAuthenticated: boolean;
}

export default function RoutePrivate({ isAuthenticated }: PrivateLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // ✅ Estado para colapsar sidebar

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Menús del sidebar
  const menuItems = [
    { 
      path: "/dashboard", 
      icon: LayoutDashboard, 
      label: "Dashboard",
      description: "Visión general"
    },
    { 
    path: "/alertas",  // ✅ Nueva ruta
    icon: AlertTriangle, 
    label: "Alertas",
    description: "Monitoreo de incidentes"
  },
    { 
      path: "/clientes", 
      icon: Building2, 
      label: "Clientes",
      description: "Gestión de clientes"
    },
    {
      path: "/reportes",
      icon: Sheet ,
      label: "Reportes",
      description: "Análisis y estadísticas"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Versión Desktop con colapsable */}
      <aside 
        className={`
          hidden lg:flex lg:flex-col bg-gradient-to-b from-purple-900 via-purple-900 to-purple-950 text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}
        `}
      >
        {/* Logo y perfil */}
        <div className={`p-6 border-b border-purple-800/50 ${sidebarCollapsed ? "px-2" : ""}`}>
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} mb-4`}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-black">N</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold">Nubeware</h2>
                <p className="text-xs text-purple-300">IoT Platform</p>
              </div>
            )}
          </div>
          
          {/* Información del usuario */}
          {!sidebarCollapsed && (
            <div className="mt-4 pt-4 border-t border-purple-800/50">
              <p className="text-sm font-medium text-white">{user?.name || "Usuario"}</p>
              <p className="text-xs text-purple-300 mt-1">
                {user?.role}
              </p>
            </div>
          )}
          
          {/* Avatar mini cuando está colapsado */}
          {sidebarCollapsed && (
            <div className="mt-4 pt-4 border-t border-purple-800/50 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          )}
        </div>

        {/* Menús de navegación */}
        <nav className="flex-1 mt-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200
                  ${sidebarCollapsed ? "justify-center" : ""}
                  ${isActive 
                    ? "bg-purple-700/50 text-white shadow-lg shadow-purple-900/20" 
                    : "text-purple-200 hover:bg-purple-800/30 hover:text-white"
                  }
                `}
                title={sidebarCollapsed ? item.label : ""}
              >
                <Icon size={20} className={isActive ? "text-purple-300" : ""} />
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs opacity-70">{item.description}</p>
                    </div>
                    {isActive && (
                      <div className="w-1 h-8 bg-purple-400 rounded-full"></div>
                    )}
                  </>
                )}
                {sidebarCollapsed && isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-purple-400 rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Botón de colapsar sidebar */}
        <div className="p-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              flex items-center gap-3 px-4 py-2 w-full text-sm text-purple-300 hover:bg-purple-800/30 hover:text-white rounded-lg transition-all
              ${sidebarCollapsed ? "justify-center" : ""}
            `}
            title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!sidebarCollapsed}
          </button>
        </div>

        {/* Botón de cerrar sesión */}
        <div className={`p-4 m-4 border-t border-purple-800/50 ${sidebarCollapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-4 py-3 w-full text-sm text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-all
              ${sidebarCollapsed ? "justify-center" : ""}
            `}
            title={sidebarCollapsed ? "Cerrar Sesión" : ""}
          >
            <LogOut size={20} />
            {!sidebarCollapsed}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior - Versión Mobile y Desktop */}
      
        {/* Menú mobile desplegable */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors
                      ${isActive 
                        ? "bg-purple-50 text-purple-900" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Botón cerrar sesión mobile */}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-3 w-full text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}

        {/* Contenido principal - Aquí se renderizan las páginas */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}