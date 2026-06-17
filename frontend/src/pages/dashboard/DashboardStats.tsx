// components/dashboard/DashboardStats.tsx
import { Building2, Users, Droplets, Activity, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  totalSedes: number;
  totalNiveles: number;
  totalBanios: number;
  totalIngresos: number;
  totalAlertas: number;
  selectedSedes: string[];
  sedesText: string;
}

export default function DashboardStats({
  totalSedes,
  totalNiveles,
  totalBanios,
  totalIngresos,
  totalAlertas,
  selectedSedes,
  sedesText,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Sedes",
      value: totalSedes,
      subtitle: selectedSedes.length > 0 ? sedesText : undefined,
      icon: Building2,
      color: "purple",
    },
    {
      label: "Total Niveles",
      value: totalNiveles,
      icon: Activity,
      color: "blue",
    },
    {
      label: "Total Baños",
      value: totalBanios,
      icon: Droplets,
      color: "cyan",
    },
    {
      label: "Total Ingresos",
      value: totalIngresos,
      icon: Users,
      color: "green",
    },
    {
      label: "Total Alertas",
      value: totalAlertas,
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  const colorClasses = {
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    cyan: { bg: "bg-cyan-100", text: "text-cyan-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400 mt-1 truncate max-w-[120px]">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <Icon size={20} className={colors.text} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}