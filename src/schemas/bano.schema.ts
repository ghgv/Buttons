// schemas/bano.schema.ts
import { z } from "zod";

export const createBanoSchema = z.object({
  level_id: z.string().min(1, { message: "El nivel es requerido" }),
  name: z
      .string()
    .min(1, { message: "El nombre del baño es requerido" }), 
  gender: z.enum(["men", "female", "mixed", "unisex"], {
    message: "Género de baño inválido",
  }),
  description: z.string().optional(),
});

export type CreateBanoRequest = z.infer<typeof createBanoSchema>;

export interface BanoResponse {
  id: string;
  level_id: string;
  name: string;
  gender: "men" | "women" | "mixed" | "disabled";
  description?: string;
  created_at: string;
  updated_at?: string;
}