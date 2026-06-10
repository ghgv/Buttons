// hooks/useCreateNivel.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { nivelService } from "../services/nivel.service";
import type { NivelResponse } from "../types/nivel.types";
import type { CreateNivelTypeSchema } from "../schemas/nivel.schema";

export const useCreateNivel = () => {
  const queryClient = useQueryClient();

  return useMutation<NivelResponse, Error, CreateNivelTypeSchema>({
    mutationFn: (data) => nivelService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Nivel ${data.name} creado exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["niveles", data.sede_id] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al crear nivel",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

export const useGetNivelesBySede = (sedeId: string) => {
  return useQuery<NivelResponse[], Error>({
    queryKey: ["niveles", sedeId],
    queryFn: () => nivelService.getBySedeId(sedeId),
    enabled: !!sedeId,
  });
};