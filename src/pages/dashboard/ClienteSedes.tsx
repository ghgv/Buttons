// pages/dashboard/ClienteSedes.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, Building2, ChevronRight, Home, Edit, Trash2 } from "lucide-react";
import { useGetSedesByCliente, useGetClientes } from "../../hooks/useCliente";
import { useCreateSede } from "../../hooks/useSede";
import type { CreateSedeRequest } from "../../schemas/sede.schema";
import CrearSedeModal from "../../components/auth/sedes/CrearSedeModal";

export default function ClienteSedes() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: sedes = [], isLoading } = useGetSedesByCliente(clienteId!);
  const { data: clientes = [] } = useGetClientes();
  const { mutate: createSede, isPending } = useCreateSede();

  // Obtener el nombre del cliente
  const cliente = clientes.find(c => c.id === clienteId);

  // Filtrar sedes por nombre o dirección
  const filteredSedes = sedes.filter((sede) =>
    sede.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sede.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSede = (data: CreateSedeRequest) => {
    createSede(data, { onSuccess: () => setIsModalOpen(false) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando sedes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb - Navegación */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate("/clientes")} className="hover:text-purple-600 transition-colors flex items-center gap-1">
          <Home size={14} />
          <span>Clientes</span>
        </button>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {cliente?.name || "Cargando..."}
        </span>
        <ChevronRight size={14} />
        <span className="text-purple-600 font-medium">Sedes</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Sedes de {cliente?.name || "..."}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las sedes y ubicaciones de este cliente
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Nueva Sede
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o dirección..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-sm"
          />
        </div>
      </div>

      {/* Lista de sedes */}
      {filteredSedes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? "No se encontraron sedes" : "No hay sedes registradas"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : `Comienza creando la primera sede para ${cliente?.name}`
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              Nueva Sede
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredSedes.map((sede) => (
              <div
                key={sede.id}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                  {/* Información de la sede */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                      <Building2 size={22} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{sede.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{sede.address}</p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-auto">
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/clientes/${clienteId}/sedes/${sede.id}/niveles`)} 
                      className="hidden sm:flex items-center gap-1 ml-2 text-sm text-gray-400 hover:text-purple-600 transition-colors"
                      title="Ver detalles"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contador de resultados */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Mostrando {filteredSedes.length} de {sedes.length} {sedes.length === 1 ? 'sede' : 'sedes'}
            </p>
          </div>
        </>
      )}

      {/* Modal para crear sede */}
      <CrearSedeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateSede} 
        clientId={clienteId!} 
        clientName={cliente?.name || ""} 
        isPending={isPending} 
      />
    </div>
  );
}