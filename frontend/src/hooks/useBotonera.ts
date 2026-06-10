// hooks/useBotonera.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { botoneraService } from "../services/botonera.service";
import type { CreateBotoneraRequest } from "../schemas/botonera.schema";
import type { BotoneraResponse } from "../types/botonera.types";

// Hook para CREAR una botonera
export const useCreateBotonera = () => {
  const queryClient = useQueryClient();

  return useMutation<BotoneraResponse, Error, CreateBotoneraRequest>({
    mutationFn: (data) => botoneraService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Botonera ${data.serie} creada exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["botoneras", data.bathroom_id] });
    },
    onError: (error) => {
      console.error("❌ Error en mutación:", error);
      Swal.fire({
        title: "Error al crear botonera",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

// Hook para OBTENER todas las botoneras de un baño
export const useGetBotonerasByBathroom = (bathroomId: number | null) => {
  return useQuery<BotoneraResponse[], Error>({
    queryKey: ["botoneras", bathroomId],
    queryFn: () => botoneraService.getByBathroomId(bathroomId!),
    enabled: !!bathroomId,
  });
};

// Hook para ELIMINAR una botonera
export const useDeleteBotonera = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => botoneraService.delete(id),
    onSuccess: () => {
      toast.success("Botonera eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["botoneras"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al eliminar botonera",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};