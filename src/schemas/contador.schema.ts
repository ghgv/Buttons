// schemas/contador.schema.ts
import { z } from "zod";

export const createContadorSchema = z.object({
  serie: z.string().min(1, { message: "La serie es requerida" }),
  bathroom_id: z.number(), // ✅ El backend espera número
});

export type CreateContadorRequest = z.infer<typeof createContadorSchema>;

export interface ContadorResponse {
  id: string;
  serie: string;
  bathroom_id: number;
  created_at: string;
  updated_at?: string;
}