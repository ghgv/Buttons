import { useState, useMemo, useDeferredValue } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Building2, Edit, Trash2, ChevronRight, AlertCircle } from "lucide-react";
import { useGetClientes, useCreateCliente } from "../../hooks";
import type { CreateClienteRequest } from "../../zod/cliente.zod";
import CrearClienteModal from "../../components/clientes/CrearClienteModal";
import Loading from "../../components/ui/Loading";
import type { ClienteResponse } from "../../types/cliente.types";

export default function Clientes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const deferredSearchTerm = useDeferredValue(searchTerm); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Gracias al tipado de tu hook, 'clientes' se infiere de manera estricta y segura
  const { data: clientes = [], isLoading, isError, error } = useGetClientes();
  const { mutate: createCliente, isPending } = useCreateCliente();

  // Memorizar el filtrado garantizando que no se procesen nulos o indefinidos
  const filteredClientes = useMemo<ClienteResponse[]>(() => {
    const cleanTerm = deferredSearchTerm.trim().toLowerCase();
    if (!cleanTerm) return clientes;

    return clientes.filter((c: ClienteResponse) => {
      const nameMatch = (c.name || "").toLowerCase().includes(cleanTerm);
      const nitMatch = String(c.nit || "").includes(cleanTerm);
      const emailMatch = (c.email || "").toLowerCase().includes(cleanTerm);
      // Indexamos también el ID único en el motor de búsqueda local
      const codeMatch = (c.id || "").toLowerCase().includes(cleanTerm);
      
      return nameMatch || nitMatch || emailMatch || codeMatch;
    });
  }, [clientes, deferredSearchTerm]);

  const handleCreateCliente = (data: CreateClienteRequest) => {
    createCliente(data, { 
      onSuccess: () => setIsModalOpen(false) 
    });
  };

  if (isLoading) return <Loading text="Cargando Clientes..." />;

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
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona la información de tus clientes</p>
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
            placeholder="Buscar por nombre, NIT, código o email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-sm"
          />
        </div>
      </div>

      {/* Lista de clientes */}
      {filteredClientes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-gray-400" />
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
            {filteredClientes.map((cliente: ClienteResponse) => (
              <div
                key={cliente.id}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                      <Building2 size={22} className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate capitalize">{cliente.name}</h3>
                        {/* ✅ Código Único Requerido por la regla de negocio */}
                       
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-gray-500 font-mono">NIT: {cliente.nit}</span>
                        <span className="text-xs text-gray-500">{cliente.email}</span>
                        <span className="text-xs text-gray-500 truncate max-w-xs">{cliente.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-auto">
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/clientes/${cliente.id}/sedes`)} 
                      className="hidden sm:flex items-center gap-1 ml-2 text-sm text-gray-400 hover:text-purple-600 transition-colors"
                      title="Ver sedes"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Mostrando {filteredClientes.length} de {clientes.length} clientes
            </p>
          </div>
        </>
      )}

      <CrearClienteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateCliente} 
        isPending={isPending} 
      />
    </div>
  );
}