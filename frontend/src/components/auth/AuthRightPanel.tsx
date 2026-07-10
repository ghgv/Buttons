// src/components/auth/AuthRightPanel.tsx
import { Users, Activity, TrendingUp } from "lucide-react";

interface AuthRightPanelProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

const defaultFeatures = [
  {
    icon: Users,
    title: "Conteo",
    description: "Cuántas personas ingresan y salen en tiempo real."
  },
  {
    icon: Activity,
    title: "Alertas",
    description: "Notificaciones cuando se requiera mantenimiento o reposición."
  },
  {
    icon: TrendingUp,
    title: "Métricas",
    description: "Análisis de afluencia para optimizar recursos y presupuestos."
  },
  
];



export default function AuthRightPanel({ 
  title = "",
  subtitle = "Monitoreo en tiempo real del conteo de personas, niveles de insumos y alertas automáticas para una gestión eficiente de los espacios.",
  features = defaultFeatures,
}: AuthRightPanelProps) {
  return (
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-950 via-[#1c0036] to-black p-16 items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-[#830AD1]/15 blur-[120px]" />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl" />
      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-pink-500/5 blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="max-w-xl w-full space-y-10 relative z-10">
     

        <div className="space-y-4">
          <h3 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
            {title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              sensores IoT
            </span>
          </h3>
          <p className="text-base text-purple-200/70 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-1 group hover:bg-white/10 transition-all"
            >
              <feature.icon className="text-purple-400 mb-2" size={20} />
              <h5 className="text-white font-bold text-sm">{feature.title}</h5>
              <p className="text-xs text-purple-200/50">{feature.description}</p>
            </div>
          ))}
        </div>

       
      </div>
    </div>
  );
}