// pages/dashboard/ClienteSedesNivelesBanios.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Droplets, Users, ChevronRight, Home, Edit, Trash2 } from "lucide-react";
import { useGetNivelesBySede } from "../../hooks/useNivel";
import { useGetSedesByCliente } from "../../hooks/useCliente";
import { useGetClientes } from "../../hooks/useCliente";
import type { CreateBanoRequest, BanoResponse } from "../../schemas/bano.schema";
import CrearBanoModal from "../../components/auth/banos/CrearBanoModal";
import { useCreateBano } from "../../hooks/useBano";

// Datos de ejemplo para los baños mientras no hay backend
const mockBanos: BanoResponse[] = [
  {
    id: "1",
    nivel_id: "1",
    name: "Baño Principal",
    tipo: "MIXTO",
    capacidad: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    nivel_id: "1",
    name: "Baño Ejecutivos",
    tipo: "HOMBRES",
    capacidad: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    nivel_id: "1",
    name: "Baño Damas",
    tipo: "MUJERES",
    capacidad: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    nivel_id: "1",
    name: "Baño Accesible",
    tipo: "PCD",
    capacidad: 2,
    created_at: new Date().toISOString(),
  },
];

// Hook temporal para obtener baños
const useGetBanosByNivel = (nivelId: string) => {
  const [data, setData] = useState<BanoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setIsLoading(true);
    setTimeout(() => {
      // Filtrar baños por nivel_id
      const filtered = mockBanos.filter(b => b.nivel_id === nivelId);
      setData(filtered);
      setIsLoading(false);
    }, 500);
  }, [nivelId]);

  return { data, isLoading };
};

export default function ClienteSedesNivelesBanios() {
  const { clienteId, sedeId, nivelId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: banos = [], isLoading } = useGetBanosByNivel(nivelId!);
  const { data: niveles = [] } = useGetNivelesBySede(sedeId!);
  const { data: sedes = [] } = useGetSedesByCliente(clienteId!);
  const { data: clientes = [] } = useGetClientes();
  const { mutate: createBano, isPending } = useCreateBano();

  // Obtener nombres
  const cliente = clientes.find(c => c.id === clienteId);
  const sede = sedes.find(s => s.id === sedeId);
  const nivel = niveles.find(n => n.id === nivelId);

  const handleCreateBano = (data: CreateBanoRequest) => {
    createBano(data, { 
      onSuccess: () => {
        setIsModalOpen(false);
        // Aquí podrías refrescar la lista
      } 
    });
  };

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case "HOMBRES": return "bg-blue-100 text-blue-700";
      case "MUJERES": return "bg-pink-100 text-pink-700";
      case "MIXTO": return "bg-green-100 text-green-700";
      case "PCD": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case "HOMBRES": return "👨";
      case "MUJERES": return "👩";
      case "MIXTO": return "👥";
      case "PCD": return "♿";
      default: return "🚽";
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch(tipo) {
      case "HOMBRES": return "Hombres";
      case "MUJERES": return "Mujeres";
      case "MIXTO": return "Mixto";
      case "PCD": return "PCD";
      default: return tipo;
    }
  };

  if (isLoading) {
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
        <button 
          onClick={() => navigate(`/clientes/${clienteId}/sedes/${sedeId}/niveles`)} 
          className="hover:text-purple-600 transition-colors truncate max-w-[150px]"
        >
          {nivel?.name || "Cargando..."}
        </button>
        <ChevronRight size={14} />
        <span className="text-purple-600 font-medium">Baños</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Baños de {nivel?.name || "..."}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los baños de este nivel
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Nuevo Baño
        </button>
      </div>

      {/* Lista de baños */}
      {banos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay baños registrados</h3>
          <p className="text-sm text-gray-500 mb-4">
            Comienza creando el primer baño para {nivel?.name}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} />
            Nuevo Baño
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {banos.map((bano) => (
            <div
              key={bano.id}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                {/* Información del baño */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center flex-shrink-0 text-xl">
                    {getTipoIcon(bano.tipo)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{bano.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getTipoColor(bano.tipo)}`}>
                        {getTipoLabel(bano.tipo)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Users size={14} />
                      Capacidad: {bano.capacidad} {bano.capacidad === 1 ? 'persona' : 'personas'}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-auto">
                  <button 
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Contador de resultados */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              {banos.length} {banos.length === 1 ? 'baño' : 'baños'} registrados
            </p>
          </div>
        </div>
      )}

      {/* Modal para crear baño */}
      <CrearBanoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateBano} 
        nivelId={nivelId!} 
        nivelName={nivel?.name || ""} 
        isPending={isPending} 
      />
    </div>
  );
}