// zod/nubewareCliente.zod.ts
import { z } from "zod";

export const createNubewareClienteSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  nit: z.number().int().positive("El NIT debe ser un número positivo"),
});

export type CreateNubewareClienteRequest = z.infer<typeof createNubewareClienteSchema>;