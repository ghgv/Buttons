import { z } from "zod";
import { loginSchema } from "../schemas/auth.schema";

// Inferimos el tipo desde el esquema que está en la otra carpeta
export type LoginRequest = z.infer<typeof loginSchema>;

export interface UserInfo {
  name: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_info: UserInfo;
}