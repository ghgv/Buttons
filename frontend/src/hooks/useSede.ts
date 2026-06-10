// hooks/useCreateSede.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { sedeService } from "../services/sede.service";
import type { CreateSedeRequest } from "../schemas/sede.schema";
import type { SedeResponse } from "../types/sede.types";

export const useCreateSede = () => {
  const queryClient = useQueryClient();

  return useMutation<SedeResponse, Error, CreateSedeRequest>({
    mutationFn: (data) => sedeService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Sede ${data.name} creada exitosamente!`);
      // ✅ Convertir client_id a string para que coincida con la query key
      queryClient.invalidateQueries({ queryKey: ["sedes", String(data.client_id)] });
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
    queryKey: ["sedes", clientId],  // ← clientId es string
    queryFn: () => sedeService.getByClientId(clientId),
    enabled: !!clientId,
  });
};