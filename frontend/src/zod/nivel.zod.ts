// schemas/nivel.schema.ts
import { z } from "zod";

export const createNivelSchema = z.object({
  sede_id: z.string().min(1, { message: "La sede es requerida" }),
  name: z
    .string()
    .min(1, { message: "El nombre del nivel es requerido" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  floor: z
    .number()
    .min(0, { message: "El número de piso es requerido" }),
});

export type CreateNivelTypeSchema = z.infer<typeof createNivelSchema>;

