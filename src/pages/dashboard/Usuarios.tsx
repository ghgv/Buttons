// pages/dashboard/Usuarios.tsx
import { useState } from "react";
import { Search, Plus, MoreVertical, UserCircle, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth(); // Para saber el rol del usuario logueado

  const usuarios = [
    { id: 1, nombre: "Carlos Mendoza", email: "carlos@nubeware.com", rol: "GERENTE_GLOBAL", estado: "Activo" },
    { id: 2, nombre: "Sonia Restrepo", email: "sonia@nubeware.com", rol: "SUPERVISOR_SEDE", estado: "Activo" },
    { id: 3, nombre: "Ana García", email: "ana@nubeware.com", rol: "SUPERVISOR_SEDE", estado: "Inactivo" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Administración de usuarios del sistema</p>
        </div>
        {user?.role && (
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus size={18} />
            Nuevo Usuario
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <UserCircle size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{usuario.nombre}</h3>
                  <p className="text-sm text-gray-500">{usuario.email}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-gray-600">
                    {usuario.rol === "GERENTE_GLOBAL" ? "Gerente Global" : "Supervisor"}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  usuario.estado === "Activo" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {usuario.estado}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}