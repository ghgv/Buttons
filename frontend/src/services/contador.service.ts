// services/contador.service.ts
import { api } from "../api/axios.client";
import type { CreateContadorRequest } from "../zod/contador.zod";
import type { ContadorResponse} from "../types/contador.types";
import axios from "axios";

const handleServiceError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(error.response.data?.detail || defaultMessage);
  }
  throw new Error("No se pudo conectar con el servidor o el servicio no está disponible");
};

export const contadorService = {
  /**
   * Registra un nuevo contador en el sistema.
   */
  create: async (data: CreateContadorRequest): Promise<ContadorResponse> => {
    try {
      const { data: response } = await api.post<ContadorResponse>("/contadores/", data);
      return response;
    } catch (error) {
      return handleServiceError(error, "Error al crear el contador en el servidor");
    }
  },

  /**
   * Recupera los contadores asignados a un baño específico.
   */
  getByBathroomId: async (bathroomId: number): Promise<ContadorResponse[]> => {
    try {
      const { data } = await api.get<ContadorResponse[]>(`/contadores/bathroom/${bathroomId}`);
      return data;
    } catch (error) {
      return handleServiceError(error, `Error al recuperar los contadores del baño #${bathroomId}`);
    }
  },

  /**
   * Obtiene los datos de un contador por su ID.
   */
  getById: async (id: number): Promise<ContadorResponse> => {
    try {
      const { data } = await api.get<ContadorResponse>(`/contadores/${id}`);
      return data;
    } catch (error) {
      return handleServiceError(error, `No se encontró el contador con el código único: ${id}`);
    }
  },

  /**
   * Obtiene un contador junto con su historial de logs paginado.
   */
//  getByIdWithLogs: async (
//   id: number,
//   pagination?: GetContadorLogsParams
// ): Promise<ContadorWithLogsResponse> => {
//   try {
//     console.log('🔍 [getByIdWithLogs] Iniciando petición para contador ID:', id);
//     console.log('📋 [getByIdWithLogs] Parámetros de paginación:', pagination);
    
//     // 🛠️ CORRECCIÓN: Se agrega la barra '/' explícita para evitar rutas corruptas como /contadores/8logs
//     const url = `/contadores/${id}/logs`;
//     console.log('🌐 [getByIdWithLogs] URL construida:', url);
    
//     const config = {
//       params: {
//         limit: pagination?.limit,
//         offset: pagination?.offset,
//       },
//     };
//     console.log('⚙️ [getByIdWithLogs] Configuración de la petición:', config);
    
//     const { data } = await api.get<ContadorWithLogsResponse>(url, config);
    
//     console.log('✅ [getByIdWithLogs] Respuesta recibida exitosamente');
//     console.log('📦 [getByIdWithLogs] Estructura completa de la respuesta:', JSON.stringify(data, null, 2));
//     console.log('📊 [getByIdWithLogs] Tipo de data:', typeof data);
//     console.log('🔎 [getByIdWithLogs] Keys de data:', Object.keys(data));
    
//     // Logs específicos para verificar la estructura de logs
//     if (data && typeof data === 'object') {
//       // Si data tiene una propiedad 'logs'
//       if ('logs' in data) {
//         console.log('📝 [getByIdWithLogs] Propiedad "logs" encontrada');
//         console.log('📝 [getByIdWithLogs] Tipo de logs:', typeof data.logs);
//         console.log('📝 [getByIdWithLogs] ¿Es array?', Array.isArray(data.logs));
//         console.log('📝 [getByIdWithLogs] Cantidad de logs:', data.logs?.length || 0);
        
//         if (Array.isArray(data.logs) && data.logs.length > 0) {
//           console.log('📝 [getByIdWithLogs] Primer log (muestra):', JSON.stringify(data.logs[0], null, 2));
//           console.log('📝 [getByIdWithLogs] Keys del primer log:', Object.keys(data.logs[0]));
//         } else {
//           console.log('📝 [getByIdWithLogs] No hay logs o el array está vacío');
//         }
//       } else {
//         console.warn('⚠️ [getByIdWithLogs] La propiedad "logs" NO existe en la respuesta');
//         console.log('🔍 [getByIdWithLogs] Propiedades disponibles:', Object.keys(data));
//       }
//     }
    
//     return data;
//   } catch (error) {
//     console.error('❌ [getByIdWithLogs] Error al recuperar el historial del contador');
//     console.error('❌ [getByIdWithLogs] ID del contador:', id);
//     console.error('❌ [getByIdWithLogs] Error completo:', error);
    
//     if (error && typeof error === 'object' && 'response' in error) {
//       const err = error as any;
//       console.error('❌ [getByIdWithLogs] Status del error:', err.response?.status);
//       console.error('❌ [getByIdWithLogs] Data del error:', err.response?.data);
//     }
    
//     return handleServiceError(
//       error, 
//       `Error al recuperar el historial del contador con código único: ${id}`
//     );
//   }
// },

  /**
   * Actualiza las propiedades de un contador.
   */
  update: async (id: number, data: Partial<CreateContadorRequest>): Promise<ContadorResponse> => {
    try {
      const { data: response } = await api.put<ContadorResponse>(`/contadores/${id}`, data);
      return response;
    } catch (error) {
      return handleServiceError(error, `Error al actualizar la configuración del contador #${id}`);
    }
  },

  /**
   * Remueve permanentemente un contador del sistema.
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/contadores/${id}`);
    } catch (error) {
      return handleServiceError(error, `Error al intentar eliminar el contador #${id}`);
    }
  },
};