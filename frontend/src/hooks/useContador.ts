// hooks/useContador.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { contadorService } from "../services/contador.service";
import type { CreateContadorRequest } from "../zod/contador.zod";
import type { ContadorResponse } from "../types/contador.types";

// Hook para CREAR un contador
export const useCreateContador = () => {
  const queryClient = useQueryClient();

  return useMutation<ContadorResponse, Error, CreateContadorRequest>({
    mutationFn: (data) => contadorService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Contador ${data.serie} creado exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["contadores", data.bathroom_id] });
    },
    onError: (error) => {
      console.error("❌ Error en mutación:", error);
      Swal.fire({
        title: "Error al crear contador",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

// Hook para OBTENER todos los contadores de un baño
export const useGetContadoresByBathroom = (bathroomId: number | null) => {
  return useQuery<ContadorResponse[], Error>({
    queryKey: ["contadores", bathroomId],
    queryFn: () => contadorService.getByBathroomId(bathroomId!),
    enabled: !!bathroomId,
  });
};

// Hook para ELIMINAR un contador
export const useDeleteContador = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => contadorService.delete(id),
    onSuccess: () => {
      toast.success("Contador eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["contadores"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al eliminar contador",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};