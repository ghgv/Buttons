// pages/dashboard/Alertas.tsx
import { useState } from "react";
import { useGetClientes } from "../../hooks/useCliente";
import AlertasPanel from "../../components/dashboard/AlertasPanel";
import { ChevronDown } from "lucide-react";

export default function Alertas() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(e.target.value);
  };

  const selectedCliente = clientes.find(c => c.id === selectedClientId);

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

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header con selector de cliente */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alertas</h1>
            <p className="text-gray-600 mt-1">
              Monitoreo de incidentes en tiempo real
            </p>
          </div>

          <div className="relative min-w-[250px]">
            <select
              value={selectedClientId}
              onChange={handleClientChange}
              className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 cursor-pointer"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name} - {cliente.nit}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {selectedClientId && selectedCliente && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Cliente seleccionado:</span>
              <span className="font-semibold text-purple-600">{selectedCliente.name}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">NIT: {selectedCliente.nit}</span>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Alertas */}
      <AlertasPanel clientId={selectedClientId ? parseInt(selectedClientId) : null} />
    </div>
  );
}