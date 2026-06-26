// pages/nubeware/ClientsNubeware.tsx
import { useState, useMemo, useDeferredValue } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Building2, Edit, Trash2, ChevronRight, Users, Mail, MapPin, Phone, AlertCircle } from "lucide-react";
import type { CreateNubewareClienteRequest } from "../../zod/nubewareCliente.zod";
import Loading from "../../components/ui/Loading";
import CrearNubewareClienteModal from "../../components/nubeware/CrearClienteNubewareModal";
import { useCreateNubewareCliente, useGetNubewareClientes } from "../../hooks";

export default function ClientsNubeware() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Hooks reales
  const { data: clientes = [], isLoading, isError, error } = useGetNubewareClientes();
  const { mutate: createCliente, isPending } = useCreateNubewareCliente();

  // ✅ Filtrar clientes (manejando null)
  const filteredClientes = useMemo(() => {
    const cleanTerm = deferredSearchTerm.trim().toLowerCase();
    if (!cleanTerm) return clientes;

    return clientes.filter((c) => {
      const nameMatch = (c.name || "").toLowerCase().includes(cleanTerm);
      const nitMatch = String(c.nit || "").includes(cleanTerm);
      const emailMatch = (c.email || "").toLowerCase().includes(cleanTerm);
      const idMatch = String(c.id || "").includes(cleanTerm);
      
      return nameMatch || nitMatch || emailMatch || idMatch;
    });
  }, [clientes, deferredSearchTerm]);

  // ✅ Manejador de creación
  const handleCreateCliente = (data: CreateNubewareClienteRequest) => {
    createCliente(data, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  if (isLoading) {
    return <Loading text="Cargando clientes Nubeware..." />;
  }

  if (isError) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center bg-red-50 rounded-2xl border border-red-200 mt-10">
        <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900">Error al cargar clientes</h3>
        <p className="text-sm text-red-700 mt-1">{error?.message || "Error de conexión con el servidor"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            Clientes Nubeware
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-14">Gestiona la información de tus clientes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, NIT o email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-sm"
          />
        </div>
      </div>

      {/* Lista de clientes */}
      {filteredClientes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : "Comienza creando tu primer cliente"
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              Crear Cliente
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                      <Building2 size={22} className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate capitalize">
                          {cliente.name || "Sin nombre"}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">
                          #{cliente.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="font-mono font-medium text-gray-400">NIT:</span> {cliente.nit}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {cliente.email}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {cliente.phone_number}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {cliente.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-auto">
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
<button 
  onClick={() => navigate(`/nubeware/clientes/${cliente.id}/subclientes`)}
  className="flex items-center gap-1 ml-2 text-sm text-gray-400 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
>
  <span className="text-xs">Subclientes</span>
  <ChevronRight size={16} />
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-gray-400 border-t border-gray-100 mt-4">
            <span>
              Mostrando {filteredClientes.length} de {clientes.length} clientes
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Total: {clientes.length}
            </span>
          </div>
        </>
      )}

      {/* Modal de creación CON FUNCIONALIDAD */}
      <CrearNubewareClienteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCliente}
        isPending={isPending}
      />
    </div>
  );
}