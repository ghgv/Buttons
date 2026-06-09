// components/reportes/FiltrosReportes.tsx
import { Calendar, Filter, MapPin, ChevronDown } from "lucide-react";

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
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Selector de Cliente */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer"
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.name} - {cliente.nit}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" size={18} />
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm"
            />
          </div>
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm"
            />
          </div>
        </div>

        {/* Selector de Sede (opcional) */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sede (opcional)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="appearance-none w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer"
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
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onGenerar}
          disabled={!selectedClientId || isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Filter size={18} />
          {isLoading ? "Cargando..." : "Generar reporte"}
        </button>
        <button
          onClick={onExportar}
          disabled={!hasData || isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📎 Exportar a Excel
        </button>
      </div>
    </div>
  );
}