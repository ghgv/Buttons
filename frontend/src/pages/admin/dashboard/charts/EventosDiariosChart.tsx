// components/dashboard/charts/EventosDiariosChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

interface EventosDiariosChartProps {
  data: Array<{ name: string; ingresos: number; alertas: number }>;
  selectedSedes: string[];
}

export default function EventosDiariosChart({ data, selectedSedes }: EventosDiariosChartProps) {
  // ✅ Texto de sedes seleccionadas
  const getSedesText = () => {
    if (selectedSedes.length === 0) return 'Todas las sedes';
    if (selectedSedes.length === 1) return selectedSedes[0];
    if (selectedSedes.length === 2) return selectedSedes.join(' y ');
    return `${selectedSedes.length} sedes`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Eventos por Día</h3>
          <p className="text-sm text-gray-500">
            {selectedSedes.length > 0 ? `Sedes: ${getSedesText()}` : 'Todas las sedes'} - Ingresos vs Alertas
          </p>
        </div>
        <LineChartIcon size={20} className="text-gray-400" />
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay eventos registrados para el período seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Ingresos"
            />
            <Line
              type="monotone"
              dataKey="alertas"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Alertas"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}