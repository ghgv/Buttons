// types/dashboard.types.ts
export interface EventoDashboard {
  fecha_hora: string;
  sede: string;
  nivel: string;
  genero_bano: string;
  dispositivo_serie: number;
  tipo_evento: "ingreso" | "alerta";
  detalle_evento: string;
  valor: number;
}

export interface SedeInfo {
  id: number;
  name: string;
  eventos: EventoDashboard[];
}

export interface ResumenInfraestructura {
  total_sedes: number;
  total_levels: number;
  total_bathrooms: number;
}

export interface DashboardMetricsResponse {
  client_id: number;
  resumen_infraestructura: ResumenInfraestructura;
  total_eventos: number;
  sedes_info: SedeInfo[];  // ← Ahora viene agrupado por sede
}