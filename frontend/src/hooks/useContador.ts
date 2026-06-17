// hooks/useContador.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { contadorService } from "../services/contador.service";
import type { CreateContadorRequest } from "../zod/contador.zod";
import type { 
  ContadorResponse,
} from "../types/contador.types";

const STALE_TIME_DEFAULT = 1000 * 60 * 5; // 5 minutos de caché fresco

// ==========================================
// 1. HOOKS DE LECTURA (QUERIES)
// ==========================================

/**
 * Obtiene la lista completa de contadores asignados a un baño específico.
 */
export const useGetContadoresByBathroom = (bathroomId: number | null) => {
  return useQuery<ContadorResponse[], Error>({
    queryKey: ["contadores", "bathroom", bathroomId],
    queryFn: () => contadorService.getByBathroomId(bathroomId!),
    enabled: bathroomId !== null && !isNaN(bathroomId),
    staleTime: STALE_TIME_DEFAULT,
  });
};

/**
 * Obtiene los detalles de un único contador mediante su código único identificador.
 */
export const useGetContadorById = (id: number | null) => {
  return useQuery<ContadorResponse, Error>({
    queryKey: ["contadores", "detail", id],
    queryFn: () => contadorService.getById(id!),
    enabled: id !== null && !isNaN(id),
    staleTime: STALE_TIME_DEFAULT,
  });
};

/**
 * Obtiene un contador junto con su historial de logs paginado.
 */
// export const useGetContadorWithLogs = (
//   id: number, 
//   pagination: GetContadorLogsParams,
//   deviceType?: string // 👁️ Evita ejecuciones en paralelo erróneas en modales compartidos
// ) => {
//   const { limit = 50, offset = 0 } = pagination;

//   return useQuery<ContadorWithLogsResponse, Error>({
//     queryKey: ["contadores", "detail", id, "logs", { limit, offset }],
//     queryFn: () => contadorService.getByIdWithLogs(id, { limit, offset }),
//     // 🛠️ CORRECCIÓN: Solo se activa si el ID es válido Y si el dispositivo visualizado es un contador
//     enabled: id !== null && !isNaN(id) && (!deviceType || deviceType === "contador"),
//     staleTime: 1000 * 30,
//   });
// };

// ==========================================
// 2. HOOKS DE ESCRITURA (MUTATIONS)
// ==========================================

/**
 * Registra un nuevo contador e invalida selectivamente la lista del baño afectado.
 */
export const useCreateContador = () => {
  const queryClient = useQueryClient();

  return useMutation<ContadorResponse, Error, CreateContadorRequest>({
    mutationFn: (data) => contadorService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Contador de serie [${data.serie}] creado con éxito!`);
      queryClient.invalidateQueries({ 
        queryKey: ["contadores", "bathroom", data.bathroom_id] 
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al crear el contador",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

/**
 * Actualiza la información o estado de un contador basándose en su ID único.
 */
export const useUpdateContador = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<ContadorResponse, Error, Partial<CreateContadorRequest>>({
    mutationFn: (data) => contadorService.update(id, data),
    onSuccess: (data) => {
      toast.success(`Contador de serie [${data.serie}] actualizado correctamente.`);
      queryClient.invalidateQueries({ queryKey: ["contadores"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error de actualización",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

/**
 * Elimina físicamente un contador del sistema mediante su código numérico único.
 */
export const useDeleteContador = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => contadorService.delete(id),
    onSuccess: () => {
      toast.success("Contador removido del sistema de forma permanente");
      queryClient.invalidateQueries({ queryKey: ["contadores"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "No se pudo eliminar",
        text: error.message,
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};