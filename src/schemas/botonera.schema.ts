// schemas/botonera.schema.ts
import { z } from "zod";

export const createBotoneraSchema = z.object({
  serie: z.string().min(1, { message: "La serie es requerida" }),
  bathroom_id: z.number(), // ✅ El backend espera número
});

export type CreateBotoneraRequest = z.infer<typeof createBotoneraSchema>;

