// pages/dashboard/Reportes.tsx
import { useState, useMemo } from "react";
import { Calendar, Filter, MapPin, ChevronDown, Building2, AlertTriangle } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";
import { useGetClientes, useGetReporteMetrics } from "../../hooks";

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-500">Cargando datos...</p>
    </div>
  </div>
);

// Helper para obtener etiqueta de alerta
const getTipoAlertaLabel = (detalle: string): string => {
  switch (detalle) {
    case "Baño sin papel": return "🧻 Sin Papel";
    case "Baño sucio": return "🧹 Sucio";
    case "Baño con mal olor": return "👃 Mal Olor";
    case "Baño sin jabon": return "🧼 Sin Jabón";
    default: return detalle;
  }
};

const getTipoAlertaColor = (detalle: string): string => {
  switch (detalle) {
    case "Baño sin papel": return "bg-yellow-100 text-yellow-800";
    case "Baño sucio": return "bg-orange-100 text-orange-800";
    case "Baño con mal olor": return "bg-red-100 text-red-800";
    case "Baño sin jabon": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getGeneroLabel = (genero: string): string => {
  switch (genero) {
    case "men": return "🚹 Hombres";
    case "women": return "🚺 Mujeres";
    case "mixed": return "👥 Mixto";
    case "disabled": return "♿ Discapacitados";
    default: return genero;
  }
};

export default function Reportes() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  const { data: metrics, isLoading, error, refetch } = useGetReporteMetrics(
    selectedClientId ? parseInt(selectedClientId) : null
  );

  // Obtener lista única de sedes
  const sedesList = useMemo(() => {
    if (!metrics?.eventos || metrics.eventos.length === 0) return [];
    const sedes = new Set<string>();
    metrics.eventos.forEach((evento: any) => {
      if (evento.sede) sedes.add(evento.sede);
    });
    return Array.from(sedes);
  }, [metrics?.eventos]);

  // Filtrar eventos
  const filteredEventos = useMemo(() => {
    if (!metrics?.eventos || metrics.eventos.length === 0) return [];
    
    let eventos = [...metrics.eventos];
    
    if (selectedSede) {
      eventos = eventos.filter(e => e.sede === selectedSede);
    }
    
    if (fechaInicio) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) >= new Date(fechaInicio));
    }
    
    if (fechaFin) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) <= new Date(fechaFin));
    }
    
    return eventos.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
  }, [metrics?.eventos, selectedSede, fechaInicio, fechaFin]);

  const handleGenerar = () => {
    if (selectedClientId) {
      refetch();
    }
  };

  const handleExportar = () => {
    if (!filteredEventos.length || !metrics?.resumen_infraestructura) return;
    
    //const selectedCliente = clientes.find(c => c.id === selectedClientId);
    
    exportToExcel({
      eventos: filteredEventos,
      resumen: metrics.resumen_infraestructura,
      clienteNombre: metrics.client_name || "Cliente",
      fechaInicio,
      fechaFin,
    });
  };

  const selectedCliente = clientes.find(c => c.id === selectedClientId);
  const hasData = filteredEventos.length > 0;

  if (isLoadingClientes) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-1">Exporta métricas de clientes a Excel</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cliente *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setSelectedSede("");
                  setFechaInicio("");
                  setFechaFin("");
                }}
                className="appearance-none w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer text-gray-700"
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} - {cliente.nit}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Inicio</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700"
              />
            </div>
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Fin</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700"
              />
            </div>
          </div>

          {/* Sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sede (opcional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                disabled={!selectedClientId}
                className="appearance-none w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">Todas las sedes</option>
                {sedesList.map((sede) => (
                  <option key={sede} value={sede}>{sede}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleGenerar}
            disabled={!selectedClientId || isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Filter size={18} />
            {isLoading ? "Cargando..." : "Generar reporte"}
          </button>
          
          <button
            onClick={handleExportar}
            disabled={!hasData || isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📎</span>
            Exportar a Excel
          </button>
        </div>

        {/* Filtros activos */}
        {(selectedSede || fechaInicio || fechaFin) && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Filtros activos:</span>
              {selectedSede && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md">
                  <MapPin size={12} /> {selectedSede}
                </span>
              )}
              {fechaInicio && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                  <Calendar size={12} /> Desde: {new Date(fechaInicio).toLocaleDateString()}
                </span>
              )}
              {fechaFin && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                  <Calendar size={12} /> Hasta: {new Date(fechaFin).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Información del cliente seleccionado */}
      {selectedClientId && selectedCliente && (
        <div className="p-3 bg-purple-50 rounded-xl">
          <p className="text-sm text-gray-600">
            Cliente: <span className="font-semibold text-purple-600">{selectedCliente.name}</span>
            {selectedSede && <span className="ml-2">| Sede: <span className="font-semibold text-cyan-600">{selectedSede}</span></span>}
            {metrics && <span className="ml-2">| Total eventos: <span className="font-semibold text-gray-900">{filteredEventos.length}</span></span>}
          </p>
        </div>
      )}

      {/* Resultados - Solo tabla de eventos */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-red-600">Error al cargar los datos: {error.message}</p>
          <button onClick={handleGenerar} className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg">
            Reintentar
          </button>
        </div>
      ) : selectedClientId && metrics?.eventos && metrics.eventos.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Eventos Registrados</h3>
            <p className="text-sm text-gray-500">Mostrando {filteredEventos.length} de {metrics.total_eventos} eventos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Baño</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEventos.slice(0, 50).map((evento, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(evento.fecha_hora).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evento.sede}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evento.nivel}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getGeneroLabel(evento.genero_bano)}</td>
                    <td className="px-4 py-3">
                      {evento.tipo_evento === "ingreso" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          🚪 Ingreso
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getTipoAlertaColor(evento.detalle_evento)}`}>
                          ⚠️ Alerta
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {evento.tipo_evento === "ingreso" 
                        ? `${evento.valor} persona(s)`
                        : getTipoAlertaLabel(evento.detalle_evento)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEventos.length > 50 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-center text-sm text-gray-500">
              Mostrando 50 de {filteredEventos.length} eventos. Exporta a Excel para ver todos.
            </div>
          )}
        </div>
      ) : selectedClientId && metrics?.eventos && metrics.eventos.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
          <p className="text-yellow-600">No hay eventos para el cliente seleccionado</p>
        </div>
      ) : null}
    </div>
  );
}