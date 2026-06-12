// schemas/cliente.schema.ts
import { z } from "zod";

/**
 * Esquema estricto de validación en tiempo de ejecución para el formulario de creación.
 */
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

/**
 * Tipo inferido de Zod para tipar la mutación de envío (Payload de la petición).
 */
export type CreateClienteRequest = z.infer<typeof createClienteSchema>;