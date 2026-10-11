import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { CheckCircle2 } from "lucide-react";

interface Props {
  data: Array<{
    name: string;
    resoluciones: number;
  }>;
}

export default function ResolucionesPorDiaChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Resoluciones por Día
          </h3>

          <p className="text-sm text-gray-500">
            Alarmas resueltas
          </p>
        </div>

        <CheckCircle2
          size={20}
          className="text-gray-400"
        />
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay resoluciones en el período seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              stroke="#9ca3af"
            />

            <YAxis
              stroke="#9ca3af"
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="resoluciones"
              name="Resueltas"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}