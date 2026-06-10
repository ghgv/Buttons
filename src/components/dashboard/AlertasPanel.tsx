// components/dashboard/AlertasPanel.tsx
import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Building2, 
  Droplets,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useGetAlertas } from "../../hooks/useAlertas";
import Loading from "../ui/Loading";

export default function AlertasPanel() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20; // Registros por página
  
  const offset = (currentPage - 1) * limit;
  const { data, isLoading, error, refetch } = useGetAlertas(limit, offset);

  const getAlertIcon = (detalle: string) => {
    switch(detalle) {
      case 'Baño sin papel': return '🧻';
      case 'Baño sucio': return '🧹';
      case 'Baño con mal olor': return '👃';
      case 'Baño sin jabon': return '🧼';
      default: return '⚠️';
    }
  };

  const getAlertColor = (detalle: string) => {
    switch(detalle) {
      case 'Baño sin papel': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baño sucio': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Baño con mal olor': return 'bg-red-100 text-red-800 border-red-200';
      case 'Baño sin jabon': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoLabel = (detalle: string) => {
    switch(detalle) {
      case 'Baño sin papel': return '🧻 Falta Papel';
      case 'Baño sucio': return '🧹 Baño Sucio';
      case 'Baño con mal olor': return '👃 Mal Olor';
      case 'Baño sin jabon': return '🧼 Falta Jabón';
      default: return detalle;
    }
  };

  const totalPages = data ? Math.ceil(data.registros_devueltos / limit) : 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <Loading text="Cargando alertas..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar alertas</h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button onClick={handleRefresh} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
          <RefreshCw size={16} /> Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.historial_eventos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
        <p className="text-gray-500">No hay alertas registradas en el sistema</p>
        <button onClick={handleRefresh} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>
    );
  }

  // Filtrar solo eventos de tipo alerta
  const alertas = data.historial_eventos.filter(evento => evento.tipo_evento === 'alerta');

  if (alertas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
        <p className="text-gray-500">No hay alertas registradas en el sistema</p>
        <button onClick={handleRefresh} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botón de recargar */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Recargar alertas"
        >
          <RefreshCw size={18} />
          <span className="text-sm">Recargar</span>
        </button>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3">
        {alertas.map((alerta, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all ${getAlertColor(alerta.detalle_evento)}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {getAlertIcon(alerta.detalle_evento)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {getTipoLabel(alerta.detalle_evento)}
                    </h4>
                    <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                      Serie: {alerta.dispositivo_serie}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 size={14} />
                      <span>{alerta.cliente}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{alerta.sede}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 size={14} />
                      <span>{alerta.nivel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets size={14} />
                      <span>
                        {alerta.genero_bano === 'men' ? '🚹 Hombres' :
                         alerta.genero_bano === 'women' ? '🚺 Mujeres' :
                         alerta.genero_bano === 'mixed' ? '👥 Mixto' : '🔄 Unisex'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(alerta.fecha_hora).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Urgencia:</span>
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                  Alta
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Mostrando {offset + 1} - {Math.min(offset + limit, data.registros_devueltos)} de {data.registros_devueltos} alertas
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Recargar"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}