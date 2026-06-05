// hooks/useBano.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { banoService } from "../services/bano.service";
import type { CreateBanoRequest, BanoResponse } from "../schemas/bano.schema";

// Hook para crear un baño
export const useCreateBano = () => {
  const queryClient = useQueryClient();

  return useMutation<BanoResponse, Error, CreateBanoRequest>({
    mutationFn: (data) => banoService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Baño ${data.name} creado exitosamente!`);
      // Invalida la query para refrescar la lista de baños de este nivel
      queryClient.invalidateQueries({ queryKey: ["levels", data.level_id, "banos"] });
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

// ✅ Hook para obtener TODOS los baños por level_id
export const useGetBanosByLevel = (levelId: string) => {
  return useQuery<BanoResponse[], Error>({
    queryKey: ["levels", levelId, "banos"],
    queryFn: () => banoService.getByLevelId(levelId),
    enabled: !!levelId, // Solo se ejecuta si hay un levelId
  });
};

// ✅ Hook para obtener UN baño por ID (opcional)
export const useGetBanoById = (id: string) => {
  return useQuery<BanoResponse, Error>({
    queryKey: ["banos", id],
    queryFn: () => banoService.getById(id),
    enabled: !!id,
  });
};

// ✅ Hook para actualizar un baño
export const useUpdateBano = () => {
  const queryClient = useQueryClient();

  return useMutation<BanoResponse, Error, { id: string; data: Partial<CreateBanoRequest> }>({
    mutationFn: ({ id, data }) => banoService.update(id, data),
    onSuccess: (data) => {
      toast.success(`¡Baño ${data.name} actualizado exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["levels", data.level_id, "banos"] });
      queryClient.invalidateQueries({ queryKey: ["banos", data.id] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al actualizar baño",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

// ✅ Hook para eliminar un baño
export const useDeleteBano = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => banoService.delete(id),
    onSuccess: (_, id) => {
      toast.success("Baño eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["banos"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al eliminar baño",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};