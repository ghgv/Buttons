// hooks/useCreateSede.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { sedeService } from "../services/sede.service";
import type { CreateSedeRequest, SedeResponse } from "../schemas/sede.schema";

export const useCreateSede = () => {
  const queryClient = useQueryClient();

  return useMutation<SedeResponse, Error, CreateSedeRequest>({
    mutationFn: (data) => sedeService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Sede ${data.name} creada exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["sedes", data.client_id] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al crear sede",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};

// Hook para obtener sedes por cliente
export const useGetSedesByClient = (clientId: string) => {
  return useQuery<SedeResponse[], Error>({
    queryKey: ["sedes", clientId],
    queryFn: () => sedeService.getByClientId(clientId),
    enabled: !!clientId, // Solo ejecuta si hay clientId
  });
};

// ✅ Añadir esta función al final del archivo useSede.ts
// export const useGetNivelesBySede = (sedeId: string) => {
//   return useQuery<NivelResponse[], Error>({
//     queryKey: ["sedes", sedeId, "niveles"],
//     queryFn: () => sedeService.getNivelesBySedeId(sedeId),
//     enabled: !!sedeId,
//   });
// };