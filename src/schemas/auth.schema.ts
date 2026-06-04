import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es requerido" })
    .email({ message: "Introduce un correo electrónico válido" })
    .trim(),
  password: z
    .string()
    .min(4, { message: "La contraseña debe tener al menos 4 caracteres" }),
});