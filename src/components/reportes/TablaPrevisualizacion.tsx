// components/reportes/TablaPrevisualizacion.tsx
import {  Building2, Droplets, AlertTriangle, Users } from "lucide-react";
import type { EventoReporte } from "../../services/reporte.service";

interface TablaPrevisualizacionProps {
  eventos: EventoReporte[];
  resumen: any;
  clienteNombre: string;
  fechaInicio?: string;
  fechaFin?: string;
}

const getTipoAlertaLabel = (detalle: string): string => {
  switch (detalle) {
    case "Baño sin papel": return "🧻 Sin Papel";
    case "Baño sucio": return "🧹 Sucio";
    case "mal olor": return "👃 Mal Olor";
    case "Baño sin jabon": return "🧼 Sin Jabón";
    default: return detalle;
  }
};

const getTipoAlertaColor = (detalle: string): string => {
  switch (detalle) {
    case "Baño sin papel": return "bg-yellow-100 text-yellow-800";
    case "Baño sucio": return "bg-orange-100 text-orange-800";
    case "mal olor": return "bg-red-100 text-red-800";
    case "Baño sin jabon": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getGeneroLabel = (genero: string): string => {
  switch (genero) {
    case "men": return "🚹 Hombres";
    case "women": return "🚺 Mujeres";
    case "mixed": return "👥 Mixto";
    case "disabled": return "♿ Discapacitados";
    default: return genero;
  }
};

export default function TablaPrevisualizacion({ eventos,  clienteNombre, fechaInicio, fechaFin }: TablaPrevisualizacionProps) {
  const totalIngresos = eventos.filter(e => e.tipo_evento === "ingreso").reduce((acc, e) => acc + e.valor, 0);
  const totalAlertas = eventos.filter(e => e.tipo_evento === "alerta").length;

  if (eventos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos</h3>
        <p className="text-gray-500">Selecciona un cliente y genera un reporte</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Building2 size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="font-semibold text-gray-900">{clienteNombre}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Users size={20} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Ingresos</p>
              <p className="font-semibold text-gray-900">{totalIngresos} personas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Alertas</p>
              <p className="font-semibold text-gray-900">{totalAlertas} incidentes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Droplets size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Período</p>
              <p className="font-semibold text-gray-900 text-sm">
                {fechaInicio || "Inicio"} - {fechaFin || "Fin"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de eventos recientes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Eventos Recientes</h3>
          <p className="text-sm text-gray-500">Últimos 50 eventos registrados</p>
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
              {eventos.slice(0, 50).map((evento, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(evento.fecha_hora).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{evento.sede}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{evento.nivel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getGeneroLabel(evento.genero_bano)}</td>
                  <td className="px-4 py-3">
                    {evento.tipo_evento === "ingreso" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        🚪 Ingreso
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getTipoAlertaColor(evento.detalle_evento)}`}>
                        ⚠️ Alerta
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
        {eventos.length > 50 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-center text-sm text-gray-500">
            Mostrando 50 de {eventos.length} eventos. Exporta a Excel para ver todos.
          </div>
        )}
      </div>
    </div>
  );
}