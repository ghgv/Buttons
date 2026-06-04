// hooks/useCreateBano.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type { BanoResponse, CreateBanoRequest } from "../schemas/bano.schema";
import { banoService } from "../services/bano.service";

export const useCreateBano = () => {
  const queryClient = useQueryClient();

  return useMutation<BanoResponse, Error, CreateBanoRequest>({
    mutationFn: (data) => banoService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Baño ${data.name} creado exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["niveles", data.nivel_id, "banos"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al crear baño",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};