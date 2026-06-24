// components/dashboard/charts/FlujoPersonasChart.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { AreaChart as AreaChartIcon } from "lucide-react";

interface FlujoPersonasChartProps {
  data: Array<{ name: string; personas: number }>;
  selectedSedes: string[];
  fechaInicio: string;
  fechaFin: string;
}

export default function FlujoPersonasChart({
  data,
  selectedSedes,
  fechaInicio,
  fechaFin,
}: FlujoPersonasChartProps) {
  const getSedesText = () => {
    if (selectedSedes.length === 0) return 'Ninguna sede';
    if (selectedSedes.length === 1) return selectedSedes[0];
    if (selectedSedes.length === 2) return selectedSedes.join(' y ');
    return `${selectedSedes.length} sedes seleccionadas`;
  };

  // ✅ Función para renderizar etiquetas personalizadas con mejor posicionamiento
  const renderCustomLabel = (props: any) => {
    const { x, y, value } = props;
    // Solo mostrar etiquetas si el valor es mayor a 0
    if (value === 0) return null;
    
    return (
      <text 
        x={x} 
        y={y - 12} // ✅ Más espacio arriba del punto
        fill="#0891b2" 
        fontSize={12} 
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="system-ui"
        className="drop-shadow-sm"
      >
        {value}
      </text>
    );
  };

  // ✅ Función para renderizar puntos con círculos más visibles
  const renderDot = (props: any) => {
    const { cx, cy } = props;
    
    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={5} 
          fill="#06b6d4" 
          stroke="white" 
          strokeWidth={2} 
        />
      </g>
    );
  };

  // ✅ Calcular el valor máximo para ajustar el dominio del YAxis
  const maxValue = Math.max(...data.map(d => d.personas), 0);
  const yAxisMax = Math.ceil(maxValue / 50) * 50 + 50; // Redondear al siguiente múltiplo de 50

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Flujo de Personas</h3>
          <p className="text-sm text-gray-500">
            {selectedSedes.length > 0 ? `Sedes: ${getSedesText()}` : 'Ingresos diarios'}
            {fechaInicio && fechaFin && ` (${fechaInicio} al ${fechaFin})`}
          </p>
        </div>
        <AreaChartIcon size={20} className="text-gray-400" />
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No hay datos de ingresos para el período seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart 
            data={data}
            margin={{
              top: 30,      // ✅ Espacio superior para los números
              right: 20,    // ✅ Espacio derecho
              left: 0,      // ✅ Espacio izquierdo (ya lo da el YAxis)
              bottom: 5,    // ✅ Espacio inferior
            }}
          >
            <defs>
              <linearGradient id="colorPersonas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            {/* ✅ XAxis con mayor separación */}
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              dy={5} // ✅ Separación de los ticks
            />
            
            {/* ✅ YAxis con dominio dinámico para dar espacio arriba */}
            <YAxis 
              stroke="#9ca3af"
              domain={[0, yAxisMax]}
              tick={{ fontSize: 11 }}
            />
            
            <Tooltip
              formatter={(value: any) => [`${value} personas`, 'Ingresos']}
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                borderRadius: '8px',
              }}
            />
            
            <Area
              type="monotone"
              dataKey="personas"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#colorPersonas)"
              name="Personas"
              dot={renderDot} // ✅ Agregar puntos visibles
              activeDot={{ r: 6 }}
            >
              {/* ✅ Etiquetas personalizadas con más espacio */}
              <LabelList 
                dataKey="personas" 
                position="top" 
                content={renderCustomLabel}
                offset={10} // ✅ Espacio extra entre el punto y la etiqueta
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}