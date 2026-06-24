// pages/coordinator/Tareas.tsx
import { ClipboardList, CheckCircle, Circle, Calendar, Clock, Plus,} from "lucide-react";
import { useState } from "react";

export default function CoordinatorTareas() {
  const [filter, setFilter] = useState('todas');

  // Datos de ejemplo - luego vendrán de la API
  const tareas = [
    { id: 1, titulo: "Revisar sensor de temperatura", descripcion: "Verificar calibración del sensor en sala de servidores", prioridad: "alta", vencimiento: "Hoy", completada: false },
    { id: 2, titulo: "Actualizar firmware", descripcion: "Actualizar firmware de todos los dispositivos", prioridad: "media", vencimiento: "Mañana", completada: false },
    { id: 3, titulo: "Revisar reporte semanal", descripcion: "Generar y revisar reporte de incidentes de la semana", prioridad: "media", vencimiento: "En 2 días", completada: false },
    { id: 4, titulo: "Mantenimiento preventivo", descripcion: "Realizar mantenimiento a equipos críticos", prioridad: "baja", vencimiento: "En 3 días", completada: false },
    { id: 5, titulo: "Capacitación de personal", descripcion: "Capacitar al nuevo personal en uso del sistema", prioridad: "baja", vencimiento: "En 5 días", completada: false },
  ];

  const tareasFiltradas = filter === 'todas' 
    ? tareas 
    : filter === 'pendientes' 
      ? tareas.filter(t => !t.completada)
      : tareas.filter(t => t.completada);

  const getPrioridadBadge = (prioridad: string) => {
    const styles = {
      alta: 'bg-red-100 text-red-800 border-red-200',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baja: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles[prioridad as keyof typeof styles]}`}>
        {prioridad}
      </span>
    );
  };

  const toggleTarea = (id: number) => {
    console.log("Toggle tarea", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="text-purple-600" size={28} />
            Mis Tareas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {tareas.filter(t => !t.completada).length} tareas pendientes
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Nueva tarea
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('todas')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            filter === 'todas' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Todas ({tareas.length})
        </button>
        <button
          onClick={() => setFilter('pendientes')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            filter === 'pendientes' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Pendientes ({tareas.filter(t => !t.completada).length})
        </button>
        <button
          onClick={() => setFilter('completadas')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            filter === 'completadas' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Completadas ({tareas.filter(t => t.completada).length})
        </button>
      </div>

      {/* Lista de tareas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {tareasFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-gray-400" size={28} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">¡Todas completadas!</h3>
            <p className="text-sm text-gray-500">No hay tareas en esta categoría</p>
          </div>
        ) : (
          tareasFiltradas.map((tarea) => (
            <div 
              key={tarea.id} 
              className="flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => console.log("Ver tarea", tarea.id)}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTarea(tarea.id);
                }}
                className="mt-0.5 flex-shrink-0"
              >
                {tarea.completada ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors" />
                )}
              </button>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className={`text-sm font-medium ${tarea.completada ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {tarea.titulo}
                  </h4>
                  {getPrioridadBadge(tarea.prioridad)}
                </div>
                <p className={`text-sm mt-1 ${tarea.completada ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tarea.descripcion}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {tarea.vencimiento}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {tarea.completada ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button 
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Editar tarea", tarea.id);
                  }}
                >
                  <ClipboardList size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap justify-between items-center text-sm">
          <span className="text-gray-500">
            Total: <span className="font-medium text-gray-900">{tareas.length}</span> tareas
          </span>
          <span className="text-gray-500">
            Pendientes: <span className="font-medium text-yellow-600">{tareas.filter(t => !t.completada).length}</span>
          </span>
          <span className="text-gray-500">
            Completadas: <span className="font-medium text-green-600">{tareas.filter(t => t.completada).length}</span>
          </span>
          <span className="text-gray-500">
            Progreso: <span className="font-medium text-purple-600">
              {Math.round((tareas.filter(t => t.completada).length / tareas.length) * 100)}%
            </span>
          </span>
        </div>
        {/* Barra de progreso */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${(tareas.filter(t => t.completada).length / tareas.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}