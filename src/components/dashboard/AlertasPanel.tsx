// components/dashboard/AlertasPanel.tsx
import { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Building2, 
  Droplets,
  Filter,
  X,
  Calendar
} from "lucide-react";
import { useGetDashboardMetrics } from "../../hooks/useDashboard";

interface AlertasPanelProps {
  clientId: number | null;
}

export default function AlertasPanel({ clientId }: AlertasPanelProps) {
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const { data: metrics, isLoading, error, refetch } = useGetDashboardMetrics(clientId);

  // Obtener lista única de sedes
  const sedesList = useMemo(() => {
    if (!metrics?.eventos) return [];
    const sedes = new Set<string>();
    metrics.eventos.forEach((evento: any) => {
      if (evento.tipo_evento === 'alerta' && evento.sede) {
        sedes.add(evento.sede);
      }
    });
    return Array.from(sedes);
  }, [metrics?.eventos]);

  // Obtener lista única de tipos de alerta
  const tiposAlerta = useMemo(() => {
    if (!metrics?.eventos) return [];
    const tipos = new Set<string>();
    metrics.eventos.forEach((evento: any) => {
      if (evento.tipo_evento === 'alerta' && evento.detalle_evento) {
        tipos.add(evento.detalle_evento);
      }
    });
    return Array.from(tipos);
  }, [metrics?.eventos]);

  // Filtrar alertas
  const filteredAlertas = useMemo(() => {
    if (!metrics?.eventos) return [];
    
    let alertas = metrics.eventos.filter((evento: any) => evento.tipo_evento === 'alerta');
    
    if (selectedSede) {
      alertas = alertas.filter((alerta: any) => alerta.sede === selectedSede);
    }
    
    if (selectedTipo) {
      alertas = alertas.filter((alerta: any) => alerta.detalle_evento === selectedTipo);
    }
    
    if (fechaInicio) {
      alertas = alertas.filter((alerta: any) => 
        new Date(alerta.fecha_hora) >= new Date(fechaInicio)
      );
    }
    
    if (fechaFin) {
      alertas = alertas.filter((alerta: any) => 
        new Date(alerta.fecha_hora) <= new Date(fechaFin)
      );
    }
    
    return alertas.sort((a: any, b: any) => 
      new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
    );
  }, [metrics?.eventos, selectedSede, selectedTipo, fechaInicio, fechaFin]);

  const getAlertIcon = (detalle: string) => {
    switch(detalle) {
      case 'Baño sin papel': return '🧻';
      case 'Baño sucio': return '🧹';
      case 'mal olor': return '👃';
      case 'Baño sin jabon': return '🧼';
      default: return '⚠️';
    }
  };

  const getAlertColor = (detalle: string) => {
    switch(detalle) {
      case 'Baño sin papel': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baño sucio': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mal olor': return 'bg-red-100 text-red-800 border-red-200';
      case 'Baño sin jabon': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const limpiarFiltros = () => {
    setSelectedSede("");
    setSelectedTipo("");
    setFechaInicio("");
    setFechaFin("");
  };

  if (!clientId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un cliente</h3>
        <p className="text-gray-500">Selecciona un cliente para ver sus alertas</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando alertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar alertas</h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Panel de Alertas</h2>
            <p className="text-purple-100 mt-1">Monitor de incidentes en tiempo real</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <AlertTriangle size={20} />
            <span className="font-bold text-2xl">{filteredAlertas.length}</span>
            <span className="text-sm">Alertas totales</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter size={16} />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          {/* Filtro por Sede */}
          {sedesList.length > 0 && (
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
            >
              <option value="">Todas las sedes</option>
              {sedesList.map((sede) => (
                <option key={sede} value={sede}>{sede}</option>
              ))}
            </select>
          )}

          {/* Filtro por Tipo de Alerta */}
          {tiposAlerta.length > 0 && (
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
            >
              <option value="">Todos los tipos</option>
              {tiposAlerta.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          )}

          {/* Filtro por Fecha Inicio */}
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
              placeholder="Fecha inicio"
            />
          </div>

          {/* Filtro por Fecha Fin */}
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400"
              placeholder="Fecha fin"
            />
          </div>

          {/* Botón limpiar filtros */}
          {(selectedSede || selectedTipo || fechaInicio || fechaFin) && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Alertas */}
      {filteredAlertas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
          <p className="text-gray-500">
            {selectedSede || selectedTipo || fechaInicio || fechaFin 
              ? "No hay alertas con los filtros seleccionados" 
              : "No hay alertas registradas para este cliente"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlertas.map((alerta: any, index: number) => (
            <div
              key={index}
              className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all ${getAlertColor(alerta.detalle_evento)}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    {getAlertIcon(alerta.detalle_evento)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {alerta.detalle_evento === 'Baño sin papel' && '🧻 Falta Papel'}
                        {alerta.detalle_evento === 'Baño sucio' && '🧹 Baño Sucio'}
                        {alerta.detalle_evento === 'mal olor' && '👃 Mal Olor'}
                        {alerta.detalle_evento === 'Baño sin jabon' && '🧼 Falta Jabón'}
                      </h4>
                      <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                        {alerta.dispositivo_serie}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{alerta.sede}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 size={14} />
                        <span>{alerta.nivel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets size={14} />
                        <span>{alerta.genero_bano === 'men' ? 'Hombres' :
                                alerta.genero_bano === 'women' ? 'Mujeres' :
                                alerta.genero_bano === 'mixed' ? 'Mixto' : 'Discapacitados'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(alerta.fecha_hora).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Urgencia:</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                    Alta
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Contador de resultados */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Mostrando {filteredAlertas.length} {filteredAlertas.length === 1 ? 'alerta' : 'alertas'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}