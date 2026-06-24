// pages/dashboard/ClienteSedesNivelesBanios.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Search, Plus, Droplets, ChevronRight, Trash2, Cpu, 
  Radio, Activity, AlertTriangle, Edit3, X, Building2,
} from "lucide-react";
import type { CreateBanoRequest } from "../../zod/bano.zod";
import type { ContadorResponse } from "../../types/contador.types"; 
import AsignarContadorModal from "../../components/banos/AsignarContadorModal";
import AsignarBotoneraModal from "../../components/banos/AsignarBotoneraModal";
import CrearBanoModal from "../../components/banos/CrearBanoModal";
import { 
  useCreateBano, 
  useCreateBotonera, 
  useCreateContador, 
  useDeleteContador, 
  useDeleteBotonera, 
  useGetBanosByLevel, 
  useGetBotonerasByBathroom, 
  useGetContadoresByBathroom, 
  useGetNivelesBySede,
  useGetSedesByCliente,
  useGetClientes,
  useUpdateContador,
  useUpdateBotonera
} from "../../hooks";
import Loading from "../../components/ui/Loading";
import Breadcrumb from "../../components/ui/Breadcrumb";
import type { BotoneraResponse } from "../../types/botonera.types";

interface Bano {
  id: string;
  name: string;
  gender: "male" | "female" | "mixed" | "unisex";
  description?: string;
}

export default function ClienteSedesNivelesBanios() {
  const { clienteId, sedeId, nivelId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedBano, setSelectedBano] = useState<Bano | null>(null);
  const [isContadorModalOpen, setIsContadorModalOpen] = useState(false);
  const [isBotoneraModalOpen, setIsBotoneraModalOpen] = useState(false);
  
  const [expandedBano, setExpandedBano] = useState<string | null>(null);
  const [editingDevice, setEditingDevice] = useState<{ id: number; serie: string; tipo: "contador" | "botonera" } | null>(null);
  
  const { data: banos = [], isLoading: isLoadingBanos, refetch: refetchBanos } = useGetBanosByLevel(nivelId!);
  const { data: niveles = [], isLoading: isLoadingNiveles } = useGetNivelesBySede(sedeId!);
  const { data: sedes = [], isLoading: isLoadingSedes } = useGetSedesByCliente(clienteId!);
  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  
  const { mutate: createBano, isPending } = useCreateBano();
  const { mutate: createContador, isPending: isContadorPending } = useCreateContador();
  const { mutate: createBotonera, isPending: isBotoneraPending } = useCreateBotonera();
  const { mutate: deleteContador } = useDeleteContador();
  const { mutate: deleteBotonera } = useDeleteBotonera();

  // Obtener nombres para el breadcrumb
  const cliente = clientes.find(c => String(c.id) === clienteId);
  const sede = sedes.find(s => String(s.id) === sedeId);
  const nivel = niveles.find(n => String(n.id) === nivelId);



  // ✅ Breadcrumb items - Jerarquía completa
  const breadcrumbItems = [
    { 
      label: 'Listado de clientes', 
      path: '/admin/clientes',
      icon: <Building2 size={14} />
    },
    
   { 
  label: `Listado de sedes del cliente ${cliente?.name || 'Cliente'}`, 
  path: `/admin/clientes/${clienteId}/sedes`,
  isActive: true
},
    { 
      label: `Listado de niveles de la sede ${sede?.name || 'sede'}`, 
      path: `/admin/clientes/${clienteId}/sedes/${sedeId}/niveles`,
    },
    { 
      label: `Listado de baños de el nivel ${nivel?.name || 'nivel'}`, 
      path: `/admin/clientes/${clienteId}/sedes/${sedeId}/niveles/${nivelId}/banos`,
      isActive: true
    }
  ];

  const currentBanoIdNumeric = expandedBano ? parseInt(expandedBano, 10) : null;
  const targetBanoIdNumeric = selectedBano ? parseInt(selectedBano.id, 10) : 0;

  const { data: contadores = [] } = useGetContadoresByBathroom(currentBanoIdNumeric);
  const { data: botoneras = [] } = useGetBotonerasByBathroom(currentBanoIdNumeric);

  const filteredBanos = (banos as Bano[]).filter((bano) =>
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

  if (isLoadingBanos || isLoadingNiveles || isLoadingSedes || isLoadingClientes) {
    return <Loading text="Cargando baños..." />;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Breadcrumb - Navegación jerárquica */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header con información del cliente, sede y nivel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 ">
            <Droplets size={28} className="text-cyan-600" />
            Baños
          </h1>
         
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors">
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
              : `Comienza creando el primer baño para ${nivel?.name || 'este nivel'}`
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              Nuevo Baño
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
                    {bano.gender === "male" ? "🚹" : bano.gender === "female" ? "🚺" : "👥"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{bano.name}</h3>
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
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                    >
                      <ChevronRight size={18} className={`transition-transform duration-200 ${expandedBano === bano.id ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Acordeón de sub-recursos */}
                {expandedBano === bano.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Lista Contadores */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Cpu size={16} className="text-purple-600" /> Contadores
                        </h4>
                        {contadores.length === 0 ? (
                          <p className="text-xs text-gray-400 py-2">Sin contadores</p>
                        ) : (
                          <div className="space-y-2">
                            {(contadores as ContadorResponse[]).map((c) => (
                              <div key={c.id} className="flex items-center justify-between bg-white rounded-lg p-2.5 border border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Activity size={14} className="text-green-600" />
                                  <span className="text-sm font-mono font-medium">{c.serie}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => setEditingDevice({ id: c.id, serie: String(c.serie), tipo: "contador" })} 
                                    className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded" 
                                    title="Editar"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => deleteContador(c.id)} 
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" 
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

                      {/* Lista Botoneras */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Radio size={16} className="text-purple-600" /> Botoneras
                        </h4>
                        {botoneras.length === 0 ? (
                          <p className="text-xs text-gray-400 py-2">Sin botoneras</p>
                        ) : (
                          <div className="space-y-2">
                            {(botoneras as BotoneraResponse[]).map((b) => (
                              <div key={b.id} className="flex items-center justify-between bg-white rounded-lg p-2.5 border border-gray-100">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle size={14} className="text-yellow-600" />
                                  <span className="text-sm font-mono font-medium">{b.serie}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => setEditingDevice({ id: b.id, serie: String(b.serie), tipo: "botonera" })} 
                                    className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded" 
                                    title="Editar"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => deleteBotonera(b.id)} 
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" 
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
        </div>
      )}

      {/* MODAL GLOBAL DE EDICIÓN RAPIDA */}
      {editingDevice && (
        <EditDeviceModal device={editingDevice} onClose={() => setEditingDevice(null)} />
      )}

      {/* Modales de asignación base */}
      <CrearBanoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateBano} levelId={nivelId!} levelName={nivel?.name || ""} isPending={isPending} />
      <AsignarContadorModal isOpen={isContadorModalOpen} onClose={() => { setIsContadorModalOpen(false); setSelectedBano(null); }} onCreate={createContador} bathroomId={targetBanoIdNumeric} bathroomName={selectedBano?.name || ""} isPending={isContadorPending} />
      <AsignarBotoneraModal isOpen={isBotoneraModalOpen} onClose={() => { setIsBotoneraModalOpen(false); setSelectedBano(null); }} onCreate={createBotonera} bathroomId={targetBanoIdNumeric} bathroomName={selectedBano?.name || ""} isPending={isBotoneraPending} />
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTE: MODAL DE EDICIÓN DE DISPOSITIVOS
// ============================================================================
function EditDeviceModal({ device, onClose }: { device: { id: number; serie: string; tipo: "contador" | "botonera" }; onClose: () => void }) {
  const [serie, setSerie] = useState<string>(device.serie);
  const mutationContador = useUpdateContador(device.id);
  const mutationBotonera = useUpdateBotonera(device.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (device.tipo === "contador") {
      mutationContador.mutate({ serie: serie }, { onSuccess: onClose });
    } else {
      mutationBotonera.mutate({ serie: serie }, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Edit3 size={18} className="text-amber-500" /> Editar {device.tipo === "contador" ? "Contador" : "Botonera"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Número de Serie único</label>
            <input 
              type="text" 
              value={serie} 
              onChange={(e) => setSerie(e.target.value)} 
              required 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:outline-none focus:border-purple-500 focus:bg-white" 
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={mutationContador.isPending || mutationBotonera.isPending} className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}