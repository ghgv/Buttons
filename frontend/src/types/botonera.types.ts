/**
 * Representa la respuesta base de una botonera desde FastAPI.
 */
export interface BotoneraResponse {
  id: number;
  bathroom_id: number;
  serie: number;        // ⚠️ OJO: Viene como número entero (int)
  install_time: string; // ⚠️ OJO: Se llama install_time
}
/**
 * Entrada individual para el historial de eventos de la botonera.
 */
export interface BotoneraLog {
  id: number;
  evento: string;
  descripcion: string;
  created_at: string;
}

/**
 * Respuesta compuesta para auditoría detallada de la botonera.
 */
export interface BotoneraWithLogsResponse extends BotoneraResponse {
  logs: BotoneraLog[];
}

/**
 * Parámetros de consulta opcionales para paginar el historial.
 */
export interface GetBotoneraLogsParams {
  limit?: number;
  offset?: number;
}