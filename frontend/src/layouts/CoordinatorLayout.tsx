// layouts/CoordinatorLayout.tsx
import { Outlet, Link, useLocation } from "react-router";
import { 
  AlertTriangle, 
  LogOut,
  ClipboardList,
  User,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { getRoleDisplayName } from "../utils/roles.utils";

export default function CoordinatorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Controlar visibilidad de la navegación inferior
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Si el scroll es menor a 50px, siempre visible
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Si el scroll es mayor que la posición anterior, ocultar
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        // Si el scroll es menor, mostrar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const menuItems = [
    { path: "/coordinator/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/coordinator/alertas", icon: AlertTriangle, label: "Alertas" },
    { path: "/coordinator/tareas", icon: ClipboardList, label: "Tareas" }
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header fijo arriba - Solo nombre y botón salir */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Logo */}
         <div className="flex flex-col items-start gap-0">
  <p className="text-sm font-medium text-gray-900 capitalize">{user?.name || "Usuario"}</p>
  <p className="text-[10px] text-purple-600 font-medium">
    {getRoleDisplayName(user?.role)}
  </p>
</div>

          {/* Info usuario y botón salir */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
             
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <User size={16} className="text-purple-700" />
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
     // layouts/CoordinatorLayout.tsx
// Cambia el padding del main de pt-16 a pt-20 para dar más espacio

<main className="pt-10 lg:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  <Outlet />
</main>

      {/* Navegación inferior - Se oculta/muestra con scroll */}
      <nav 
        className={`
          fixed bottom-0 left-0 right-0 z-40 
          bg-white border-t border-gray-200 shadow-lg 
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="flex items-center justify-around px-2 py-1.5 max-w-7xl mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? "text-purple-600" 
                    : "text-gray-400 hover:text-gray-600"
                  }
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? "bg-purple-50" : ""
                }`}>
                  <Icon size={22} className={isActive ? "text-purple-600" : ""} />
                </div>
                <span className={`text-[10px] font-medium ${
                  isActive ? "text-purple-600" : "text-gray-500"
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-px w-8 h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}