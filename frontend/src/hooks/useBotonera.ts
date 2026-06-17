import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { botoneraService } from "../services/botonera.service";
import type { CreateBotoneraRequest } from "../zod/botonera.zod";
import type { 
  BotoneraResponse,
} from "../types/botonera.types";

const STALE_TIME_DEFAULT = 1000 * 60 * 5; // 5 minutos de caché limpio

// ==========================================
// QUERIES (LECTURAS)
// ==========================================

export const useGetBotonerasByBathroom = (bathroomId: number | null) => {
  return useQuery<BotoneraResponse[], Error>({
    queryKey: ["botoneras", "bathroom", bathroomId],
    queryFn: () => botoneraService.getByBathroomId(bathroomId!),
    enabled: bathroomId !== null && !isNaN(bathroomId),
    staleTime: STALE_TIME_DEFAULT,
  });
};

export const useGetBotoneraById = (id: number | null) => {
  return useQuery<BotoneraResponse, Error>({
    queryKey: ["botoneras", "detail", id],
    queryFn: () => botoneraService.getById(id!),
    enabled: id !== null && !isNaN(id),
    staleTime: STALE_TIME_DEFAULT,
  });
};

// export const useGetBotoneraWithLogs = (
//   id: number, 
//   pagination: GetBotoneraLogsParams,
//   deviceType?: string // 👁️ Agregamos el tipo de dispositivo como parámetro opcional
// ) => {
//   const { limit = 50, offset = 0 } = pagination;

//   return useQuery<BotoneraWithLogsResponse, Error>({
//     queryKey: ["botoneras", "detail", id, "logs", { limit, offset }],
//     queryFn: () => botoneraService.getByIdWithLogs(id, { limit, offset }),
//     // 🛠️ Cambiado: Solo se ejecuta si el ID es válido Y si no hay tipo o el tipo es estrictamente botonera
//     enabled: id !== null && !isNaN(id) && (!deviceType || deviceType === "botonera"),
//     staleTime: 1000 * 30, 
//   });
// };

// ==========================================
// MUTATIONS (ESCRITURAS)
// ==========================================

export const useCreateBotonera = () => {
  const queryClient = useQueryClient();

  return useMutation<BotoneraResponse, Error, CreateBotoneraRequest>({
    mutationFn: (data) => botoneraService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Botonera de serie [${data.serie}] asignada con éxito!`);
      queryClient.invalidateQueries({ 
        queryKey: ["botoneras", "bathroom", data.bathroom_id] 
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al asignar botonera",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

export const useUpdateBotonera = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<BotoneraResponse, Error, Partial<CreateBotoneraRequest>>({
    mutationFn: (data) => botoneraService.update(id, data),
    onSuccess: (data) => {
      toast.success(`Botonera serie [${data.serie}] actualizada correctamente.`);
      queryClient.invalidateQueries({ queryKey: ["botoneras"] });
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

export const useDeleteBotonera = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => botoneraService.delete(id),
    onSuccess: () => {
      toast.success("Botonera removida del baño exitosamente");
      queryClient.invalidateQueries({ queryKey: ["botoneras"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "No se pudo desvincular",
        text: error.message,
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};