// schemas/dashboard.schema.ts
import { z } from "zod";

// Esquema para los eventos (logs)
export const eventoSchema = z.object({
  fecha_hora: z.string(),
  sede: z.string(),
  nivel: z.string(),
  genero_bano: z.string(),
  dispositivo_serie: z.string(),
  tipo_evento: z.enum(["ingreso", "alerta"]),
  detalle_evento: z.string(),
  valor: z.number(),
});

export type Evento = z.infer<typeof eventoSchema>;

// Esquema para el resumen de infraestructura
export const resumenInfraestructuraSchema = z.object({
  total_sedes: z.number(),
  total_levels: z.number(),
  total_bathrooms: z.number(),
});

export type ResumenInfraestructura = z.infer<typeof resumenInfraestructuraSchema>;

// Esquema para la respuesta completa del dashboard
export const dashboardMetricsSchema = z.object({
  client_id: z.number(),
  resumen_infraestructura: resumenInfraestructuraSchema,
  total_eventos: z.number(),
  eventos: z.array(eventoSchema),
});

export type DashboardMetricsResponse = z.infer<typeof dashboardMetricsSchema>;