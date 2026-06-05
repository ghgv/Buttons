// hooks/useBotonera.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { botoneraService } from "../services/botonera.service";
import type { CreateBotoneraRequest, BotoneraResponse } from "../schemas/botonera.schema";

// Hook para crear una botonera
export const useCreateBotonera = () => {
  const queryClient = useQueryClient();
  return useMutation<BotoneraResponse, Error, CreateBotoneraRequest>({
    mutationFn: (data) => botoneraService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Botonera ${data.serie} creada exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["botoneras", data.bathroom_id] });
    },
    onError: (error) => {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    },
  });
};

// ✅ Hook para obtener TODAS las botoneras de un baño
export const useGetBotonerasByBathroom = (bathroomId: string) => {
  return useQuery<BotoneraResponse[], Error>({
    queryKey: ["botoneras", bathroomId],
    queryFn: () => botoneraService.getByBathroomId(bathroomId),
    enabled: !!bathroomId, // Solo se ejecuta si hay bathroomId
  });
};

// Hook para eliminar una botonera
export const useDeleteBotonera = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => botoneraService.delete(id),
    onSuccess: () => {
      toast.success("Botonera eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["botoneras"] });
    },
    onError: (error) => {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    },
  });
};