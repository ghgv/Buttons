// types/cliente.types.ts

/**
 * Representa la respuesta exacta y cruda que expone el servidor.
 * Cumple con la directiva de poseer un código identificador único (id).
 */
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

/**
 * Modelo de dominio limpio utilizado en los componentes de la interfaz.
 * Úsalo si necesitas parsear fechas o transformar datos antes de renderizar.
 */
export interface Cliente {
  id: string;
  nit: string;
  name: string;
  email: string;
  address: string;
  sensores: number;
  estado: "Activo" | "Inactivo";
}