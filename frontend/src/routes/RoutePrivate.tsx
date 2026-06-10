// routes/RoutePrivate.tsx
import { Navigate, Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  LogOut,
  Building2,
  AlertTriangle,
  Sheet,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

interface PrivateLayoutProps {
  isAuthenticated: boolean;
}

export default function RoutePrivate({ isAuthenticated }: PrivateLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Menús del nav
  const menuItems = [
    { 
      path: "/dashboard", 
      icon: LayoutDashboard, 
      label: "Dashboard",
      description: "Visión general"
    },
    { 
      path: "/alertas",
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
      icon: Sheet,
      label: "Reportes",
      description: "Análisis y estadísticas"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Botón hamburguesa - Siempre visible */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-4 left-4 z-50 bg-purple-900 text-white p-2 rounded-lg shadow-lg hover:bg-purple-800 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Menú flotante - Solo ocupa el espacio del contenido */}
      {menuOpen && (
        <div className="fixed top-2 left-2 z-50">
          <nav className="bg-white rounded-xl shadow-xl w-80 overflow-hidden">
            {/* Cabecera con botón de cerrar */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center">
                    <span className="text-white text-xl font-black">N</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Nubeware</h2>
                    <p className="text-xs text-gray-500">IoT Platform</p>
                  </div>
                </div>
                
                {/* Botón de cerrar */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Información del usuario */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user?.name || "Usuario"}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.role || "Usuario"}
                </p>
              </div>
            </div>

            {/* Enlaces de navegación */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-200
                      ${isActive 
                        ? "bg-purple-50 text-purple-900" 
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon size={20} className={isActive ? "text-purple-600" : "text-gray-400"} />
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    {isActive && (
                      <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Botón de cerrar sesión */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Contenido principal */}
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}