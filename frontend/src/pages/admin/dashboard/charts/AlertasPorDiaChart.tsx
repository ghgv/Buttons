import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { AlertTriangle, Calendar } from "lucide-react";

interface AlertasPorDiaChartProps {
  data: Array<{
    name: string;
    total: number;
    sinPapel: number;
    sucio: number;
    malOlor: number;
    sinJabon: number;
  }>;
  selectedSedes: string[];
  fechaInicio: string;
  fechaFin: string;
}

export default function AlertasPorDiaChart({
  data,
  selectedSedes,
  fechaInicio,
  fechaFin,
}: AlertasPorDiaChartProps) {

  const getSedesText = () => {
    if (selectedSedes.length === 0) return "Todas las sedes";
    if (selectedSedes.length === 1) return selectedSedes[0];
    if (selectedSedes.length === 2) return selectedSedes.join(" y ");
    return `${selectedSedes.length} sedes seleccionadas`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Alarmas por Día
          </h3>

          <p className="text-sm text-gray-500">
            Sedes: {getSedesText()}
            {fechaInicio &&
              fechaFin &&
              ` (${fechaInicio} al ${fechaFin})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-gray-400" />
          <Calendar size={20} className="text-gray-400" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay alarmas registradas para el período seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: 15,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              stroke="#9ca3af"
              allowDecimals={false}
              tick={{ fontSize: 11 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e5e7eb",
                borderRadius: "8px",
              }}
            />

            <Legend />

            <Bar
              dataKey="malOlor"
              name="Olores"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />

            <Bar
              dataKey="sinJabon"
              name="Jabón"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="sucio"
              name="Sucio"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="sinPapel"
              name="Papel"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}