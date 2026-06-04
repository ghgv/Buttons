// pages/dashboard/Dashboard.tsx
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido de vuelta, {user?.name}</p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Clientes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Usuarios Activos</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">42</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Sensores Conectados</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">28</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Alertas Hoy</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">12</p>
        </div>
      </div>
    </div>
  );
}