// pages/nubeware/DashboardNubeware.tsx
import { useAuth } from "../../hooks/useAuth";
import { Building2, Users, AlertTriangle, Sheet } from "lucide-react";

export default function DashboardNubeware() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Clientes", value: "24", icon: Building2, color: "bg-purple-500" },
    { label: "Usuarios Activos", value: "156", icon: Users, color: "bg-blue-500" },
    { label: "Alertas Pendientes", value: "3", icon: AlertTriangle, color: "bg-yellow-500" },
    { label: "Reportes Generados", value: "89", icon: Sheet, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Nubeware</h1>
        <p className="text-gray-500">Bienvenido, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}