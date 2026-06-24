// pages/coordinator/Dashboard.tsx
import { 
  AlertTriangle, 
  ClipboardList, 
  CheckCircle, 
  Clock,
  MapPin,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Bell
} from "lucide-react";

export default function CoordinatorDashboard() {
  // Datos de ejemplo
  const stats = [
    { 
      titulo: "Alertas Activas", 
      valor: "12", 
      cambio: "+3", 
      tendencia: "up",
      icon: AlertTriangle,
      color: "bg-yellow-500"
    },
    { 
      titulo: "Tareas Pendientes", 
      valor: "8", 
      cambio: "-2", 
      tendencia: "down",
      icon: ClipboardList,
      color: "bg-blue-500"
    },
    { 
      titulo: "Completadas Hoy", 
      valor: "5", 
      cambio: "+2", 
      tendencia: "up",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    { 
      titulo: "Horas Trabajadas", 
      valor: "6.5", 
      cambio: "+1.5", 
      tendencia: "up",
      icon: Clock,
      color: "bg-purple-500"
    }
  ];

  const alertasAsignadas = [
    { id: 1, titulo: "Fuga de agua en baño 3", sede: "Sede Principal", prioridad: "alta", tiempo: "Hace 5 min" },
    { id: 2, titulo: "Sensor de humedad activado", sede: "Sede Norte", prioridad: "media", tiempo: "Hace 15 min" },
    { id: 3, titulo: "Temperatura fuera de rango", sede: "Sede Sur", prioridad: "media", tiempo: "Hace 30 min" },
  ];

  const tareasProximas = [
    { id: 1, titulo: "Revisar sensor de temperatura", vencimiento: "Hoy", prioridad: "alta" },
    { id: 2, titulo: "Actualizar firmware", vencimiento: "Mañana", prioridad: "media" },
    { id: 3, titulo: "Mantenimiento preventivo", vencimiento: "En 2 días", prioridad: "baja" },
  ];

  const actividadReciente = [
    { id: 1, accion: "Alerta #12 resuelta", tiempo: "Hace 10 min", tipo: "resuelto" },
    { id: 2, accion: "Tarea completada", tiempo: "Hace 25 min", tipo: "completado" },
    { id: 3, accion: "Nueva alerta asignada", tiempo: "Hace 45 min", tipo: "nuevo" },
  ];

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="text-purple-600" size={28} />
          Mi Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen de tu actividad y tareas asignadas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${
                  stat.tendencia === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.cambio}
                  {stat.tendencia === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 mt-2">{stat.valor}</p>
              <p className="text-xs text-gray-500">{stat.titulo}</p>
            </div>
          );
        })}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas asignadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              Mis Alertas
            </h3>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              {alertasAsignadas.length} activas
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {alertasAsignadas.map((alerta) => (
              <div key={alerta.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${getPrioridadColor(alerta.prioridad)}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{alerta.titulo}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <MapPin size={12} />
                        {alerta.sede}
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <Clock size={12} />
                        {alerta.tiempo}
                      </p>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-xs font-medium">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tareas próximas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-500" />
              Tareas Próximas
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {tareasProximas.length} pendientes
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {tareasProximas.map((tarea) => (
              <div key={tarea.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${getPrioridadColor(tarea.prioridad)}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{tarea.titulo}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar size={12} />
                        Vence: {tarea.vencimiento}
                      </p>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 text-xs font-medium">
                    Completar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={18} className="text-purple-500" />
            Actividad Reciente
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {actividadReciente.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.tipo === 'resuelto' ? 'bg-green-100' :
                  item.tipo === 'completado' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  {item.tipo === 'resuelto' && <CheckCircle size={14} className="text-green-600" />}
                  {item.tipo === 'completado' && <CheckCircle size={14} className="text-blue-600" />}
                  {item.tipo === 'nuevo' && <Bell size={14} className="text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.accion}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {item.tiempo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
          <p className="text-xs text-green-700 font-medium">Completado Hoy</p>
          <p className="text-xl font-bold text-green-900">5/8</p>
          <p className="text-xs text-green-600">62.5% de tareas</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-xl p-4 border border-yellow-200">
          <p className="text-xs text-yellow-700 font-medium">Alertas Activas</p>
          <p className="text-xl font-bold text-yellow-900">12</p>
          <p className="text-xs text-yellow-600">3 de alta prioridad</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
          <p className="text-xs text-purple-700 font-medium">Eficiencia</p>
          <p className="text-xl font-bold text-purple-900">92%</p>
          <p className="text-xs text-purple-600">+5% esta semana</p>
        </div>
      </div>
    </div>
  );
}