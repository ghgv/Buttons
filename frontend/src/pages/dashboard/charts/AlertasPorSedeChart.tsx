// components/dashboard/charts/AlertasPorSedeChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

const ALERTAS_ORDER = [
  { key: 'sinPapel', name: '🧻 Sin Papel', color: '#f59e0b' },
  { key: 'sucio', name: '🧹 Sucio', color: '#ef4444' },
  { key: 'malOlor', name: '👃 Mal Olor', color: '#8b5cf6' },
  { key: 'sinJabon', name: '🧼 Sin Jabón', color: '#06b6d4' }
];

interface AlertasPorSedeChartProps {
  data: Array<{
    name: string;
    sinPapel: number;
    sucio: number;
    malOlor: number;
    sinJabon: number;
  }>;
  selectedSedes: string[];
}

export default function AlertasPorSedeChart({ data, selectedSedes }: AlertasPorSedeChartProps) {
  // ✅ Determinar el título basado en las sedes seleccionadas
  const getChartTitle = () => {
    if (selectedSedes.length === 0) {
      return "Alertas por Sede";
    }
    if (selectedSedes.length === 1) {
      return `Alertas por Baño - ${selectedSedes[0]}`;
    }
    return "Alertas por Sede";
  };

  const getChartSubtitle = () => {
    if (selectedSedes.length === 0) {
      return "Distribución de alertas por sede";
    }
    if (selectedSedes.length === 1) {
      return "Distribución de alertas por baño en la sede seleccionada";
    }
    if (selectedSedes.length === 2) {
      return `Comparativa entre: ${selectedSedes.join(' y ')}`;
    }
    return `Comparativa entre ${selectedSedes.length} sedes seleccionadas`;
  };

  const isEmpty = data.length === 0 || data.every(
    s => s.sinPapel === 0 && s.sucio === 0 && s.malOlor === 0 && s.sinJabon === 0
  );

  // ✅ Si hay una sola sede, mostrar el nombre en el gráfico
  const chartData = data.map(item => {
    if (selectedSedes.length === 1 && item.name.includes(' - ')) {
      const parts = item.name.split(' - ');
      return {
        ...item,
        displayName: parts[1] || item.name
      };
    }
    return {
      ...item,
      displayName: item.name
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{getChartTitle()}</h3>
          <p className="text-sm text-gray-500">{getChartSubtitle()}</p>
        </div>
        <AlertTriangle size={20} className="text-gray-400" />
      </div>
      {isEmpty ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay alertas registradas
          {selectedSedes.length === 1 && ` para la sede "${selectedSedes[0]}"`}
          {selectedSedes.length > 1 && ` para las sedes seleccionadas`}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="displayName" 
              stroke="#9ca3af" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              formatter={(value: any, name: any) => [`${value} alertas`, name]}
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            
            {/* ✅ Configuración de radius: solo la última barra (sinJabon) tiene border radius superior */}
            {ALERTAS_ORDER.map((alerta, index) => {
              // Determinar si es la última barra (la de arriba)
              const isLastBar = index === ALERTAS_ORDER.length - 1;
              
              return (
                <Bar 
                  key={alerta.key}
                  dataKey={alerta.key} 
                  stackId="a" 
                  fill={alerta.color} 
                  name={alerta.name}
                  // ✅ Solo la última barra tiene border radius superior
                  radius={isLastBar ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}