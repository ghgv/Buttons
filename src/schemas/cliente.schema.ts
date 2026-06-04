// schemas/cliente.schema.ts
import { z } from "zod";

export const createClienteSchema = z.object({
  nit: z
    .string()
    .min(1, { message: "El NIT es requerido" })
    .regex(/^\d{9,12}$/, { message: "NIT inválido (9-12 dígitos)" }),
  name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "Email inválido" }),
  address: z
    .string()
    .min(1, { message: "La dirección es requerida" })
    .min(5, { message: "Dirección demasiado corta" }),
});

export type CreateClienteRequest = z.infer<typeof createClienteSchema>;

// Tipo para la respuesta del backend
export interface ClienteResponse {
  id: string;
  nit: string;
  name: string;
  email: string;
  address: string;
  sensores: number;
  estado: "Activo" | "Inactivo";
  created_at: string;
}