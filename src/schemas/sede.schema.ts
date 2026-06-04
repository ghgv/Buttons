// schemas/sede.schema.ts (Mantenlo simple)
import { z } from "zod";

export const createSedeSchema = z.object({
  client_id: z.string().min(1, { message: "El ID del cliente es requerido" }),
  name: z
    .string()
    .min(1, { message: "El nombre de la sede es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  address: z
    .string()
    .min(1, { message: "La dirección es requerida" })
    .min(5, { message: "Dirección demasiado corta" }),
});

export type CreateSedeRequest = z.infer<typeof createSedeSchema>;

// Tipo para la respuesta del backend
export interface SedeResponse {
  id: string;
  client_id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}