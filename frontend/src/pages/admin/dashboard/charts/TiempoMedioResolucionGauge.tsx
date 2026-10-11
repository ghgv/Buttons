
import { Clock3 } from "lucide-react";

interface TiempoMedioResolucionGaugeProps {
  minutos: number | null;
  umbral?: number;
}

const formatearTiempo = (minutos: number | null) => {
  if (minutos === null || Number.isNaN(minutos)) {
    return "Sin datos";
  }

  const totalMin = Math.round(minutos);

  if (totalMin < 60) {
    return `${totalMin} min`;
  }

  const horas = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  if (mins === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${mins}m`;
};

export default function TiempoMedioResolucionGauge({
  minutos,
  umbral = 15,
}: TiempoMedioResolucionGaugeProps) {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const porcentaje =
    minutos === null ? 0 : Math.min((minutos / umbral) * 100, 100);

  const dashOffset =
    circumference - (porcentaje / 100) * circumference;

  const color =
    minutos === null
      ? "#9ca3af"
      : minutos > umbral
      ? "#ef4444"
      : minutos > umbral * 0.75
      ? "#f59e0b"
      : "#10b981";

  const estadoTexto =
    minutos === null
      ? "Sin resoluciones"
      : minutos > umbral
      ? "Por encima del objetivo"
      : "Dentro del objetivo";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tiempo Medio de Atención
          </h3>
          <p className="text-sm text-gray-500">
            Objetivo: máximo {umbral} minutos
          </p>
        </div>
        <Clock3 size={20} className="text-gray-400" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {formatearTiempo(minutos)}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {minutos === null
                ? "0%"
                : `${Math.round(
                    Math.min((minutos / umbral) * 100, 100)
                  )}% del límite`}
            </span>
          </div>
        </div>

        <div className="mt-4 text-sm font-medium" style={{ color }}>
          {estadoTexto}
        </div>
      </div>
    </div>
  );
}