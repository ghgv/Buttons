// pages/dashboard/ClienteSedesNivelesBanios.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, Droplets, ChevronRight, Home, Trash2, Cpu, Radio, Activity, AlertTriangle } from "lucide-react";
import { useGetNivelesBySede } from "../../hooks/useNivel";
import { useGetSedesByCliente } from "../../hooks/useCliente";
import { useGetClientes } from "../../hooks/useCliente";
import { useGetBanosByLevel, useCreateBano } from "../../hooks/useBano";
import { useGetContadoresByBathroom, useCreateContador, useDeleteContador } from "../../hooks/useContador";
import { useGetBotonerasByBathroom, useCreateBotonera, useDeleteBotonera } from "../../hooks/useBotonera";
import type { CreateBanoRequest } from "../../schemas/bano.schema";
import type { CreateContadorRequest } from "../../schemas/contador.schema";
import type { CreateBotoneraRequest } from "../../schemas/botonera.schema";
import AsignarContadorModal from "../../components/banos/AsignarContadorModal";
import AsignarBotoneraModal from "../../components/banos/AsignarBotoneraModal";
import CrearBanoModal from "../../components/banos/CrearBanoModal";

export default function ClienteSedesNivelesBanios() {
  const { clienteId, sedeId, nivelId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBano, setSelectedBano] = useState<any>(null);
  const [isContadorModalOpen, setIsContadorModalOpen] = useState(false);
  const [isBotoneraModalOpen, setIsBotoneraModalOpen] = useState(false);
  const [expandedBano, setExpandedBano] = useState<string | null>(null);
  
  const { data: banos = [], isLoading: isLoadingBanos, refetch: refetchBanos } = useGetBanosByLevel(nivelId!);
  const { data: niveles = [] } = useGetNivelesBySede(sedeId!);
  const { data: sedes = [] } = useGetSedesByCliente(clienteId!);
  const { data: clientes = [] } = useGetClientes();
  const { mutate: createBano, isPending } = useCreateBano();
  const { mutate: createContador, isPending: isContadorPending } = useCreateContador();
  const { mutate: createBotonera, isPending: isBotoneraPending } = useCreateBotonera();
  const { mutate: deleteContador } = useDeleteContador();
  const { mutate: deleteBotonera } = useDeleteBotonera();

  // Obtener dispositivos para cada baño cuando se expande
  const bathroomIdNumber = expandedBano ? parseInt(expandedBano) : null;
  const { data: contadores = [], refetch: refetchContadores } = useGetContadoresByBathroom(bathroomIdNumber);
  const { data: botoneras = [], refetch: refetchBotoneras } = useGetBotonerasByBathroom(bathroomIdNumber);

  // Refrescar dispositivos cuando se expande un baño
  useEffect(() => {
    if (expandedBano) {
      refetchContadores();
      refetchBotoneras();
    }
  }, [expandedBano, refetchContadores, refetchBotoneras]);

  const cliente = clientes.find(c => c.id === clienteId);
  const sede = sedes.find(s => s.id === sedeId);
  const nivel = niveles.find(n => n.id === sedeId);

  const filteredBanos = banos.filter((bano) =>
    bano.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bano.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bano.description && bano.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateBano = (data: CreateBanoRequest) => {
    createBano(data, { 
      onSuccess: () => {
        setIsModalOpen(false);
        refetchBanos();
      } 
    });
  };

  const handleAsignarContador = (data: CreateContadorRequest) => {
    createContador(data, { 
      onSuccess: () => { 
        setIsContadorModalOpen(false); 
        setSelectedBano(null);
        refetchContadores();
      } 
    });
  };

  const handleAsignarBotonera = (data: CreateBotoneraRequest) => {
    createBotonera(data, { 
      onSuccess: () => { 
        setIsBotoneraModalOpen(false); 
        setSelectedBano(null);
        refetchBotoneras();
      } 
    });
  };

  const handleDeleteContador = (id: string) => {
    deleteContador(id, {
      onSuccess: () => {
        refetchContadores();
      }
    });
  };

  const handleDeleteBotonera = (id: string) => {
    deleteBotonera(id, {
      onSuccess: () => {
        refetchBotoneras();
      }
    });
  };

  const getGenderColor = (gender: string) => {
    switch(gender) {
      case "male": return "bg-blue-100 text-blue-700";
      case "female": return "bg-pink-100 text-pink-700";
      case "mixed": return "bg-green-100 text-green-700";
      case "unisex": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getGenderIcon = (gender: string) => {
    switch(gender) {
      case "male": return "🚹";
      case "female": return "🚺";
      case "mixed": return "👥";
      case "unisex": return "🔄";
      default: return "🚽";
    }
  };

  const getGenderLabel = (gender: string) => {
    switch(gender) {
      case "male": return "Hombres";
      case "female": return "Mujeres";
      case "mixed": return "Mixto";
      case "unisex": return "Unisex";
      default: return gender;
    }
  };

  if (isLoadingBanos) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando baños...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate("/clientes")} className="hover:text-purple-600 transition-colors flex items-center gap-1">
          <Home size={14} />
          <span>Clientes</span>
        </button>
        <ChevronRight size={14} />
        <button onClick={() => navigate(`/clientes/${clienteId}/sedes`)} className="hover:text-purple-600 transition-colors truncate max-w-[150px]">
          {cliente?.name || "Cargando..."}
        </button>
        <ChevronRight size={14} />
        <button onClick={() => navigate(`/clientes/${clienteId}/sedes`)} className="hover:text-purple-600 transition-colors truncate max-w-[150px]">
          {sede?.name || "Cargando..."}
        </button>
        <ChevronRight size={14} />
        <button onClick={() => navigate(`/clientes/${clienteId}/sedes/${sedeId}/niveles`)} className="hover:text-purple-600 transition-colors truncate max-w-[150px]">
          {nivel?.name || "Cargando..."}
        </button>
        <ChevronRight size={14} />
        <span className="text-purple-600 font-medium">Baños</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Baños de {nivel?.name || "..."}</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los baños y sus dispositivos</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl">
          <Plus size={18} /> Nuevo Baño
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, género o descripción..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>
      </div>

      {/* Lista de baños */}
      {filteredBanos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? "No se encontraron baños" : "No hay baños registrados"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : `Comienza creando el primer baño para ${nivel?.name}`
            }
          </p>
          {!searchTerm && (
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl">
              <Plus size={16} /> Nuevo Baño
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBanos.map((bano) => (
            <div key={bano.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center text-xl">
                    {getGenderIcon(bano.gender)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{bano.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getGenderColor(bano.gender)}`}>
                        {getGenderLabel(bano.gender)}
                      </span>
                    </div>
                    {bano.description && <p className="text-sm text-gray-500 mt-1">{bano.description}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => { setSelectedBano(bano); setIsContadorModalOpen(true); }} 
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                      title="Asignar Contador"
                    >
                      <Cpu size={18} />
                    </button>
                    <button 
                      onClick={() => { setSelectedBano(bano); setIsBotoneraModalOpen(true); }} 
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                      title="Asignar Botonera"
                    >
                      <Radio size={18} />
                    </button>
                    <button 
                      onClick={() => setExpandedBano(expandedBano === bano.id ? null : bano.id)} 
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-transform"
                    >
                      <ChevronRight size={18} className={`transition-transform duration-200 ${expandedBano === bano.id ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Dispositivos expandidos */}
                {expandedBano === bano.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contadores */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-purple-600" />
                            <h4 className="font-medium text-gray-900">Contadores</h4>
                          </div>
                          <button 
                            onClick={() => { setSelectedBano(bano); setIsContadorModalOpen(true); }} 
                            className="text-xs text-purple-600 hover:text-purple-700"
                          >
                            + Agregar
                          </button>
                        </div>
                        {contadores.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">Sin contadores asignados</p>
                        ) : (
                          <div className="space-y-2">
                            {contadores.map((contador) => (
                              <div key={contador.id} className="flex items-center justify-between bg-white rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <Activity size={14} className="text-green-600" />
                                  <span className="text-sm font-mono">{contador.serie}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => handleDeleteContador(contador.id)} 
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Eliminar"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Botoneras */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Radio size={16} className="text-purple-600" />
                            <h4 className="font-medium text-gray-900">Botoneras</h4>
                          </div>
                          <button 
                            onClick={() => { setSelectedBano(bano); setIsBotoneraModalOpen(true); }} 
                            className="text-xs text-purple-600 hover:text-purple-700"
                          >
                            + Agregar
                          </button>
                        </div>
                        {botoneras.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">Sin botoneras asignadas</p>
                        ) : (
                          <div className="space-y-2">
                            {botoneras.map((botonera) => (
                              <div key={botonera.id} className="flex items-center justify-between bg-white rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle size={14} className="text-yellow-600" />
                                  <span className="text-sm font-mono">{botonera.serie}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => handleDeleteBotonera(botonera.id)} 
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Eliminar"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Contador de resultados */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Mostrando {filteredBanos.length} de {banos.length} {banos.length === 1 ? 'baño' : 'baños'}
            </p>
          </div>
        </div>
      )}

      {/* Modales */}
      <CrearBanoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateBano} 
        levelId={nivelId!} 
        levelName={nivel?.name || ""} 
        isPending={isPending} 
      />
      
      <AsignarContadorModal 
        isOpen={isContadorModalOpen} 
        onClose={() => {
          setIsContadorModalOpen(false);
          setSelectedBano(null);
        }} 
        onCreate={handleAsignarContador} 
        bathroomId={selectedBano?.id ? parseInt(selectedBano.id) : null}
        bathroomName={selectedBano?.name || ""} 
        isPending={isContadorPending} 
      />
      
      <AsignarBotoneraModal 
        isOpen={isBotoneraModalOpen} 
        onClose={() => {
          setIsBotoneraModalOpen(false);
          setSelectedBano(null);
        }} 
        onCreate={handleAsignarBotonera} 
        bathroomId={selectedBano?.id ? parseInt(selectedBano.id) : null}
        bathroomName={selectedBano?.name || ""} 
        isPending={isBotoneraPending} 
      />
    </div>
  );
}