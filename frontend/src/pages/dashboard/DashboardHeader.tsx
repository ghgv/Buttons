// components/dashboard/DashboardHeader.tsx
import { ChevronDown, Filter, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  selectedClientId: string;
  clientes: any[];
  selectedCliente: any;
  selectedSedes: string[];
  fechaInicio: string;
  fechaFin: string;
  hasActiveFilters: boolean;
  onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFilterToggle: () => void;
  isLoadingClientes: boolean;
  onRefresh?: () => void; // ✅ Nuevo prop
  isRefreshing?: boolean; // ✅ Nuevo prop
}

export default function DashboardHeader({
  selectedClientId,
  clientes,
  selectedCliente,
  selectedSedes,
  fechaInicio,
  fechaFin,
  hasActiveFilters,
  onClientChange,
  onFilterToggle,
  isLoadingClientes,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  if (isLoadingClientes) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  // Texto de sedes seleccionadas
  const getSedesText = () => {
    if (selectedSedes.length === 0) return 'Ninguna sede';
    if (selectedSedes.length === 1) return selectedSedes[0];
    return `${selectedSedes.length} sedes seleccionadas`;
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard de Métricas</h1>
          <p className="text-gray-600 mt-1">
            Visualiza estadísticas y métricas de los baños
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative min-w-[200px]">
            <select
              value={selectedClientId}
              onChange={onClientChange}
              className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 cursor-pointer"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          {/* ✅ Botón de recarga */}
          {selectedClientId && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Recargar datos"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          )}

          <button
            onClick={onFilterToggle}
            disabled={!selectedClientId}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Filter size={16} />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {selectedClientId && selectedCliente && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">Cliente seleccionado:</span>
            <span className="font-semibold text-purple-600">{selectedCliente.name}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">NIT: {selectedCliente.nit}</span>
            {selectedSedes.length > 0 && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Sedes:</span>
                <span className="font-semibold text-cyan-600">{getSedesText()}</span>
              </>
            )}
            {(fechaInicio || fechaFin) && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Período:</span>
                <span className="font-semibold text-green-600">
                  {fechaInicio || "Inicio"} - {fechaFin || "Fin"}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}