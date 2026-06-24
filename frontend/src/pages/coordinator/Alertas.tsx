// pages/coordinator/Alertas.tsx
import {  Clock,ChevronRight, Bell } from "lucide-react";

export default function CoordinatorAlertas() {
  // Datos de ejemplo - luego vendrán de la API
  const alertas = [
    { id: 1, titulo: "Fuga de agua en baño 3", sede: "Sede Principal", tiempo: "Hace 5 minutos", estado: "pendiente", prioridad: "alta" },
    { id: 2, titulo: "Sensor de humedad activado", sede: "Sede Norte", tiempo: "Hace 10 minutos", estado: "pendiente", prioridad: "media" },
    { id: 3, titulo: "Temperatura fuera de rango", sede: "Sede Sur", tiempo: "Hace 15 minutos", estado: "pendiente", prioridad: "media" },
    { id: 4, titulo: "Batería baja en dispositivo", sede: "Sede Este", tiempo: "Hace 25 minutos", estado: "pendiente", prioridad: "baja" },
  ];

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === 'pendiente') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          <Clock size={12} />
          Pendiente
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="text-purple-600" size={28} />
            Mis Alertas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {alertas.length} alertas activas requieren tu atención
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Filtrar
          </button>
          <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Marcar todas como vistas
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Alta prioridad</p>
          <p className="text-2xl font-bold text-red-600">
            {alertas.filter(a => a.prioridad === 'alta').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Media prioridad</p>
          <p className="text-2xl font-bold text-yellow-600">
            {alertas.filter(a => a.prioridad === 'media').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Baja prioridad</p>
          <p className="text-2xl font-bold text-blue-600">
            {alertas.filter(a => a.prioridad === 'baja').length}
          </p>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Alerta
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                  Sede
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                  Tiempo
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Estado
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alertas.map((alerta) => (
                <tr 
                  key={alerta.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => console.log("Ver alerta", alerta.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${getPrioridadColor(alerta.prioridad)}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alerta.titulo}</p>
                        <p className="text-xs text-gray-400 md:hidden">{alerta.sede}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {alerta.sede}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {alerta.tiempo}
                  </td>
                  <td className="px-6 py-4">
                    {getEstadoBadge(alerta.estado)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Ver detalles", alerta.id);
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensaje si no hay alertas */}
      {alertas.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay alertas</h3>
          <p className="text-sm text-gray-500">Todas las alertas han sido atendidas</p>
        </div>
      )}
    </div>
  );
}