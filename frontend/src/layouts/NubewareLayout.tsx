// layouts/NubewareLayout.tsx (con 1 'e')
import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  LogOut,
  Building2,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { getRoleDisplayName } from "../utils/roles.utils";

export default function NubewareLayout() { // ✅ 1 'e'
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Rutas con nubeware (1 'e')
  const menuItems = [
    { path: "/nubeware/dashboard", icon: LayoutDashboard, label: "Dashboard", description: "Visión general" },
    { path: "/nubeware/clientes", icon: Building2, label: "Clientes", description: "Gestión de clientes" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-4 left-4 z-50 bg-purple-900 text-white p-2 rounded-md shadow-lg hover:bg-purple-800 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {menuOpen && (
        <div className="fixed top-0 left-0 z-50">
          <nav className="bg-white rounded-md shadow-xl w-72 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center">
                    <span className="text-white text-xl font-black">NB</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Nubeware</h2>
                    <p className="text-sm font-medium text-gray-800 capitalize">Emp: {user?.name || "Usuario"}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-purple-600 font-medium">Rol: {getRoleDisplayName(user?.role)}</p>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                
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

      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}