// components/reportes/FiltrosReportes.tsx
import { Calendar, Filter, MapPin, ChevronDown, Building2, RefreshCw } from "lucide-react";

interface FiltrosReportesProps {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedSede: string;
  setSelectedSede: (sede: string) => void;
  fechaInicio: string;
  setFechaInicio: (fecha: string) => void;
  fechaFin: string;
  setFechaFin: (fecha: string) => void;
  sedesList: string[];
  clientes: any[];
  onGenerar: () => void;
  onExportar: () => void;
  isLoading: boolean;
  hasData: boolean;
}

export default function FiltrosReportes({
  selectedClientId,
  setSelectedClientId,
  selectedSede,
  setSelectedSede,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  sedesList,
  clientes,
  onGenerar,
  onExportar,
  isLoading,
  hasData,
}: FiltrosReportesProps) {
  
  const limpiarFiltros = () => {
    setSelectedSede("");
    setFechaInicio("");
    setFechaFin("");
  };

  const hayFiltrosActivos = selectedSede || fechaInicio || fechaFin;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Selector de Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Cliente *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedSede(""); // Resetear sede al cambiar cliente
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Fecha Inicio
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Fecha Fin
          </label>
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

        {/* Selector de Sede (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sede (opcional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              disabled={!selectedClientId || sedesList.length === 0}
              className="appearance-none w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">Todas las sedes</option>
              {sedesList.map((sede) => (
                <option key={sede} value={sede}>
                  {sede}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          {selectedClientId && sedesList.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">⚠️ No hay sedes disponibles para este cliente</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onGenerar}
          disabled={!selectedClientId || isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <Filter size={18} />
              Generar reporte
            </>
          )}
        </button>
        
        <button
          onClick={onExportar}
          disabled={!hasData || isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>📎</span>
          Exportar a Excel
        </button>
        
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hayFiltrosActivos && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">Filtros activos:</span>
            {selectedSede && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md">
                <MapPin size={12} />
                {selectedSede}
              </span>
            )}
            {fechaInicio && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                <Calendar size={12} />
                Desde: {new Date(fechaInicio).toLocaleDateString()}
              </span>
            )}
            {fechaFin && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                <Calendar size={12} />
                Hasta: {new Date(fechaFin).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Información de ayuda */}
      {!selectedClientId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-600">
            💡 Selecciona un cliente para generar el reporte
          </p>
        </div>
      )}
    </div>
  );
}