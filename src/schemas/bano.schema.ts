// schemas/bano.schema.ts
import { z } from "zod";

export const createBanoSchema = z.object({
  nivel_id: z.string().min(1, { message: "El nivel es requerido" }),
  name: z
    .string()
    .min(1, { message: "El nombre del baño es requerido" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  tipo: z.enum(["HOMBRES", "MUJERES", "MIXTO", "PCD"], {
    message: "Tipo de baño inválido",
  }),
  capacidad: z
    .number()
    .min(1, { message: "La capacidad debe ser al menos 1" }),
});

export type CreateBanoRequest = z.infer<typeof createBanoSchema>;

export interface BanoResponse {
  id: string;
  nivel_id: string;
  name: string;
  tipo: "HOMBRES" | "MUJERES" | "MIXTO" | "PCD";
  capacidad: number;
  created_at: string;
  updated_at?: string;
}