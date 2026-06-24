// components/dashboard/charts/AlertasPorDiaChart.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

const ALERTAS_COLORS = {
  sinPapel: '#f59e0b',
  sucio: '#ef4444',
  malOlor: '#8b5cf6',
  sinJabon: '#06b6d4'
};



export default function AlertasPorDiaChart({
  data,
  selectedSedes,
  fechaInicio,
  fechaFin,
}: AlertasPorDiaChartProps) {
  const getSedesText = () => {
    if (selectedSedes.length === 0) return 'Ninguna sede';
    if (selectedSedes.length === 1) return selectedSedes[0];
    if (selectedSedes.length === 2) return selectedSedes.join(' y ');
    return `${selectedSedes.length} sedes seleccionadas`;
  };

  // ✅ Calcular el valor máximo para ajustar el dominio del YAxis
  const maxValue = Math.max(...data.map(d => d.total), 0);
  const yAxisMax = Math.ceil((maxValue + 5) / 10) * 10 + 10;

  // ✅ Renderizar etiquetas personalizadas para el total
  // const renderCustomLabel = (props: any) => {
  //   const { x, y, value } = props;
  //   if (value === 0) return null;
    
  //   return (
  //     <g>
  //       <rect
  //         x={x - 15}
  //         y={y - 22}
  //         width={30}
  //         height={18}
  //         fill="white"
  //         rx={4}
  //         opacity={0.9}
  //       />
  //       <text 
  //         x={x} 
  //         y={y - 10} 
  //         fill="#dc2626" 
  //         fontSize={11} 
  //         fontWeight="bold"
  //         textAnchor="middle"
  //         fontFamily="system-ui"
  //       >
  //         {value}
  //       </text>
  //     </g>
  //   );
  // };

  // ✅ Renderizar puntos personalizados
  // const renderDot = (props: any) => {
  //   const { cx, cy } = props;
  //   return (
  //     <circle 
  //       cx={cx} 
  //       cy={cy} 
  //       r={4} 
  //       fill="#ef4444" 
  //       stroke="white" 
  //       strokeWidth={2} 
  //     />
  //   );
  // };

  // ✅ Renderizar puntos para las alertas individuales (más pequeños)
  const renderAlertDot = (color: string) => (props: any) => {
    const { cx, cy } = props;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={3} 
        fill={color} 
        stroke="white" 
        strokeWidth={1.5} 
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Alertas por Día</h3>
          <p className="text-sm text-gray-500">
            {selectedSedes.length > 0 ? `Sedes: ${getSedesText()}` : 'Todas las sedes'}
            {fechaInicio && fechaFin && ` (${fechaInicio} al ${fechaFin})`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-gray-400" />
          <Calendar size={20} className="text-gray-400" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay alertas registradas para el período seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart 
            data={data}
            margin={{
              top: 35,
              right: 30,
              left: 10,
              bottom: 15,
            }}
          >
            <defs>
              {/* ✅ Gradiente para el área del total */}
             {/* <linearGradient id="colorAlertasTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02}/>
              </linearGradient> 
              */}
              {/* ✅ Gradientes para cada tipo de alerta */}
              <linearGradient id="colorSinPapel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorSucio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorMalOlor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorSinJabon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              dy={8}
              height={40}
            />
            
            <YAxis 
              stroke="#9ca3af"
              domain={[0, yAxisMax]}
              tick={{ fontSize: 11 }}
              width={40}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: any, name: any) => {
                const names: Record<string, string> = {
                  total: 'Total Alertas',
                  sinPapel: 'Sin Papel',
                  sucio: 'Sucio',
                  malOlor: 'Mal Olor',
                  sinJabon: 'Sin Jabón'
                };
                return [`${value} alertas`, names[name] || name];
              }}
            />
            
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => {
                const names: Record<string, string> = {
                  total: 'Total',
                  sinPapel: '🧻 Sin Papel',
                  sucio: '🧹 Sucio',
                  malOlor: '👃 Mal Olor',
                  sinJabon: '🧼 Sin Jabón'
                };
                return names[value] || value;
              }}
            />

            {/* ✅ Área del total con línea principal */}
            {/* <Area
              type="monotone"
              dataKey="total"
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#colorAlertasTotal)"
              name="total"
              dot={renderDot}
              activeDot={{ r: 6 }}
            >
              <LabelList 
                dataKey="total" 
                position="top" 
                content={renderCustomLabel}
                offset={15}
              />
            </Area> */}

            {/* ✅ Áreas para cada tipo de alerta (líneas suaves) */}
            <Area
              type="monotone"
              dataKey="sinPapel"
              stroke={ALERTAS_COLORS.sinPapel}
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#colorSinPapel)"
              name="sinPapel"
              dot={renderAlertDot(ALERTAS_COLORS.sinPapel)}
            />
            
            <Area
              type="monotone"
              dataKey="sucio"
              stroke={ALERTAS_COLORS.sucio}
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#colorSucio)"
              name="sucio"
              dot={renderAlertDot(ALERTAS_COLORS.sucio)}
            />
            
            <Area
              type="monotone"
              dataKey="malOlor"
              stroke={ALERTAS_COLORS.malOlor}
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#colorMalOlor)"
              name="malOlor"
              dot={renderAlertDot(ALERTAS_COLORS.malOlor)}
            />
            
            <Area
              type="monotone"
              dataKey="sinJabon"
              stroke={ALERTAS_COLORS.sinJabon}
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#colorSinJabon)"
              name="sinJabon"
              dot={renderAlertDot(ALERTAS_COLORS.sinJabon)}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}