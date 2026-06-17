/**
 * Representa la respuesta base de un contador en el sistema.
 * Mantiene consistencia con el identificador único numérico (int) exigido por FastAPI.
 */
export interface ContadorResponse {
  id: number;           // Código único numérico (int)
  bathroom_id: number;  // Relación con el baño
  serie: number;        // ⚠️ OJO: Viene como número entero (int), no como string
  install_time: string; // ⚠️ OJO: Se llama install_time, no created_at
}

/**
 * Representa una entrada individual en el historial de auditoría del dispositivo.
 */
export interface ContadorLog {
  id: number;
  evento: string;
  descripcion: string;
  install_time: string; // O el campo de fecha correspondiente en tu endpoint de logs
}

/**
 * Respuesta compuesta del endpoint GET /contadores/{counter_id}.
 * Hereda todas las propiedades de ContadorResponse y le anexa de forma estricta el array de logs.
 */
export interface ContadorWithLogsResponse extends ContadorResponse {
  logs: ContadorLog[];
}

/**
 * Parámetros de consulta opcionales para controlar la paginación de logs desde TanStack Query.
 */
export interface GetContadorLogsParams {
  limit?: number;
  offset?: number;
}