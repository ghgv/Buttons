// pages/dashboard/ClienteSedesNiveles.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Hash, ChevronRight, Home } from "lucide-react";
import { useCreateNivel, useGetNivelesBySede } from "../../hooks/useNivel";
import { useGetSedesByCliente } from "../../hooks/useCliente";
import { useGetClientes } from "../../hooks/useCliente";
import type { CreateNivelRequest } from "../../schemas/nivel.schema";
import CrearNivelModal from "../../components/niveles/CrearNivelModal";

export default function ClienteSedesNiveles() {
  const { clienteId, sedeId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: niveles = [], isLoading } = useGetNivelesBySede(sedeId!);
  const { data: sedes = [] } = useGetSedesByCliente(clienteId!);
  const { data: clientes = [] } = useGetClientes();
  const { mutate: createNivel, isPending } = useCreateNivel();

  // Obtener nombres
  const cliente = clientes.find(c => c.id === clienteId);
  const sede = sedes.find(s => s.id === sedeId);

  // Filtrar niveles por nombre o número de piso
  const filteredNiveles = niveles.filter((nivel) =>
    nivel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(nivel.floor).includes(searchTerm)
  );

  const handleCreateNivel = (data: CreateNivelRequest) => {
    createNivel(data, { onSuccess: () => setIsModalOpen(false) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando niveles...</p>
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
        <button 
          onClick={() => navigate(`/clientes/${clienteId}/sedes`)} 
          className="hover:text-purple-600 transition-colors truncate max-w-[150px]"
        >
          {cliente?.name || "Cargando..."}
        </button>
        <ChevronRight size={14} />
        <button 
          onClick={() => navigate(`/clientes/${clienteId}/sedes`)} 
          className="hover:text-purple-600 transition-colors truncate max-w-[150px]"
        >
          {sede?.name || "Cargando..."}
        </button>
        <ChevronRight size={14} />
        <span className="text-purple-600 font-medium">Niveles</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Niveles de {sede?.name || "..."}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los pisos y niveles de esta sede
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Nuevo Nivel
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o número de piso..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-sm"
          />
        </div>
      </div>

      {/* Lista de niveles */}
      {filteredNiveles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? "No se encontraron niveles" : "No hay niveles registrados"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : `Comienza creando el primer nivel para ${sede?.name}`
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              Nuevo Nivel
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredNiveles.map((nivel) => (
              <div
                key={nivel.id}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                  {/* Información del nivel */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0">
                      <Hash size={22} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{nivel.name}</h3>
                      <p className="text-sm text-gray-500">Piso {nivel.floor}</p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-auto">
                    <button 
                      onClick={() => navigate(`/clientes/${clienteId}/sedes/${sedeId}/niveles/${nivel.id}/banos`)} 
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                      title="Ver Baños"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/clientes/${clienteId}/sedes/${sedeId}/niveles/${nivel.id}/banos`)} 
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
              Mostrando {filteredNiveles.length} de {niveles.length} {niveles.length === 1 ? 'nivel' : 'niveles'}
            </p>
          </div>
        </>
      )}

      {/* Modal para crear nivel */}
      <CrearNivelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateNivel} 
        sedeId={sedeId!} 
        sedeName={sede?.name || ""} 
        isPending={isPending} 
      />
    </div>
  );
}