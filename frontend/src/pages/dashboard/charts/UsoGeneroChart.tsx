// components/dashboard/charts/UsoGeneroChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

interface UsoGeneroChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function UsoGeneroChart({ data }: UsoGeneroChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Uso por Género</h3>
          <p className="text-sm text-gray-500">
            Distribución de ingresos
          </p>
        </div>
        <PieChartIcon size={20} className="text-gray-400" />
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay datos de género
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8b5cf6"
              dataKey="value"
              nameKey="name"
            >
              {data.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${value} ingresos`, 'Total']}
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}