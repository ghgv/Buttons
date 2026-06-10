// schemas/bano.schema.ts
import { z } from "zod";

export const createBanoSchema = z.object({
  level_id: z.string().min(1, { message: "El nivel es requerido" }),
  name: z
      .string()
    .min(1, { message: "El nombre del baño es requerido" }), 
  gender: z.enum(["men", "women", "mixed", "disabled"], {
    message: "Género de baño inválido",
  }),
  description: z.string().optional(),
});

export type CreateBanoRequest = z.infer<typeof createBanoSchema>;

