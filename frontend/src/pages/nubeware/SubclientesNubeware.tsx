// pages/nubeware/SubclientesNubeware.tsx
import { useState, useMemo, useDeferredValue } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Search, Building2, 
  Users, Mail, MapPin, AlertCircle, ArrowLeft,
  ChevronDown, ChevronUp, Home
} from "lucide-react";
import Loading from "../../components/ui/Loading";
import { useGetSubclientesByClientLocalId } from "../../hooks/useSubcliente";

export default function SubclientesNubeware() {
  const { clientLocalId } = useParams<{ clientLocalId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [expandedSedes, setExpandedSedes] = useState<number[]>([]);

  // ✅ Convertir a número
  const clientId = Number(clientLocalId);

  // ✅ Obtener subclientes
  const { data: subclientes = [], isLoading, isError, error } = useGetSubclientesByClientLocalId(clientId);

  // ✅ Filtrar subclientes
  const filteredSubclientes = useMemo(() => {
    const cleanTerm = deferredSearchTerm.trim().toLowerCase();
    if (!cleanTerm) return subclientes;

    return subclientes.filter((s) => {
      const nameMatch = (s.name || "").toLowerCase().includes(cleanTerm);
      const nitMatch = String(s.nit || "").includes(cleanTerm);
      const emailMatch = (s.email || "").toLowerCase().includes(cleanTerm);
      const idMatch = String(s.id || "").includes(cleanTerm);
      
      return nameMatch || nitMatch || emailMatch || idMatch;
    });
  }, [subclientes, deferredSearchTerm]);

  // ✅ Toggle sedes
  const toggleSedes = (id: number) => {
    setExpandedSedes(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // ✅ Contar sedes totales
  const totalSedes = subclientes.reduce((acc, s) => acc + s.sedes.length, 0);

  if (isLoading) {
    return <Loading text="Cargando subclientes..." />;
  }

  if (isError) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center bg-red-50 rounded-2xl border border-red-200 mt-10">
        <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900">Error al cargar subclientes</h3>
        <p className="text-sm text-red-700 mt-1">{error?.message || "Error de conexión con el servidor"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header con botón de volver */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-gray-400 hover:text-purple-600"
              title="Volver"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                Subclientes
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-14">
                Clientes asociados al ID: #{clientId} • {subclientes.length} subclientes • {totalSedes} sedes
              </p>
            </div>
          </div>
        </div>
        {/* ✅ SIN BOTÓN de "Nuevo Subcliente" - Solo lectura */}
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

      {/* Lista de subclientes */}
      {filteredSubclientes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? "No se encontraron subclientes" : "No hay subclientes registrados"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : "No hay subclientes disponibles para este cliente"
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredSubclientes.map((subcliente) => {
              const hasSedes = subcliente.sedes.length > 0;
              const isExpanded = expandedSedes.includes(subcliente.id);

              return (
                <div
                  key={subcliente.id}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200"
                >
                  {/* Cabecera del subcliente */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                        <Building2 size={22} className="text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 truncate capitalize">
                            {subcliente.name}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">
                            #{subcliente.id}
                          </span>
                          {hasSedes && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                              <Home size={12} />
                              {subcliente.sedes.length} sedes
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="font-mono font-medium text-gray-400">NIT:</span> {subcliente.nit}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {subcliente.email}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="font-mono font-medium text-gray-400">Cliente Local:</span> #{subcliente.client_local_id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-auto">
                      {/* ✅ Botón toggle sedes - SOLO LECTURA */}
                      {hasSedes && (
                        <button
                          onClick={() => toggleSedes(subcliente.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={16} />
                              Ocultar sedes
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              Ver sedes ({subcliente.sedes.length})
                            </>
                          )}
                        </button>
                      )}
                      {/* ✅ SIN botones de Editar/Eliminar - Solo lectura */}
                    </div>
                  </div>

                  {/* Lista de sedes (expandible) */}
                  {isExpanded && hasSedes && (
                    <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                      <div className="p-4 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Sedes ({subcliente.sedes.length})
                        </h4>
                        {subcliente.sedes.map((sede) => (
                          <div
                            key={sede.id}
                            className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Home size={16} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">{sede.name}</p>
                              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {sede.address}
                              </p>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">
                              #{sede.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer con estadísticas */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-xs text-gray-400 border-t border-gray-100 mt-4 gap-2">
            <span>
              Mostrando {filteredSubclientes.length} de {subclientes.length} subclientes
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Total: {subclientes.length}
              </span>
              <span className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Sedes: {totalSedes}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}