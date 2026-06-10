// components/reportes/TablaPrevisualizacion.tsx
import { Building2, AlertTriangle, Users, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import type { EventoReporte, ResumenInfraestructura } from "../../services/reporte.service";

interface TablaPrevisualizacionProps {
  eventos: EventoReporte[];
  resumen: ResumenInfraestructura;
  clienteNombre: string;
  fechaInicio?: string;
  fechaFin?: string;
}

const getTipoAlertaLabel = (detalle: string): string => {
  const alertas: Record<string, string> = {
    "Baño sin papel": "🧻 Sin Papel",
    "Baño sucio": "🧹 Sucio",
    "Baño con mal olor": "👃 Mal Olor",
    "Baño sin jabon": "🧼 Sin Jabón",
    "flujo de personas": "🚪 Ingreso"
  };
  return alertas[detalle] || detalle;
};

const getTipoAlertaColor = (detalle: string): string => {
  const colores: Record<string, string> = {
    "Baño sin papel": "bg-yellow-100 text-yellow-800",
    "Baño sucio": "bg-orange-100 text-orange-800",
    "Baño con mal olor": "bg-red-100 text-red-800",
    "Baño sin jabon": "bg-blue-100 text-blue-800",
  };
  return colores[detalle] || "bg-gray-100 text-gray-800";
};

const getGeneroLabel = (genero: string): string => {
  const generos: Record<string, string> = {
    "men": "🚹 Hombres",
    "women": "🚺 Mujeres",
    "mixed": "👥 Mixto",
    "disabled": "♿ Discapacitados",
  };
  return generos[genero] || genero;
};

export default function TablaPrevisualizacion({ 
  eventos, 
  clienteNombre,
  fechaInicio, 
  fechaFin
}: TablaPrevisualizacionProps) {
  
  const totalIngresos = eventos.filter(e => e.tipo_evento === "ingreso").reduce((acc, e) => acc + e.valor, 0);
  const totalAlertas = eventos.filter(e => e.tipo_evento === "alerta").length;

  if (eventos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos</h3>
        <p className="text-gray-500">No se encontraron eventos para los filtros seleccionados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">Cliente</p>
              <p className="font-bold text-gray-900 text-lg">{clienteNombre}</p>
            </div>
            <Building2 size={24} className="text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Total Ingresos</p>
              <p className="font-bold text-gray-900 text-2xl">{totalIngresos}</p>
              <p className="text-xs text-green-600">personas</p>
            </div>
            <TrendingUp size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">Total Alertas</p>
              <p className="font-bold text-gray-900 text-2xl">{totalAlertas}</p>
              <p className="text-xs text-orange-600">incidentes</p>
            </div>
            <AlertTriangle size={24} className="text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Período</p>
              <p className="font-semibold text-gray-900 text-xs">
                {fechaInicio ? new Date(fechaInicio).toLocaleDateString() : "Inicio"}
              </p>
              <p className="font-semibold text-gray-900 text-xs">
                {fechaFin ? new Date(fechaFin).toLocaleDateString() : "Fin"}
              </p>
            </div>
            <Calendar size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabla de eventos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Eventos Registrados</h3>
          <p className="text-sm text-gray-500">Mostrando {eventos.length} eventos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Baño</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eventos.map((evento, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(evento.fecha_hora).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {evento.sede}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{evento.nivel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getGeneroLabel(evento.genero_bano)}</td>
                  <td className="px-4 py-3">
                    {evento.tipo_evento === "ingreso" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        <Users size={12} />
                        Ingreso
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getTipoAlertaColor(evento.detalle_evento)}`}>
                        <AlertCircle size={12} />
                        Alerta
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {evento.tipo_evento === "ingreso" 
                      ? `${evento.valor} persona(s)`
                      : getTipoAlertaLabel(evento.detalle_evento)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}