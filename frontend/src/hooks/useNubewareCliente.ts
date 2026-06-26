// hooks/nubeware/useNubewareCliente.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type { NubewareClienteResponse } from "../types/nubewareCliente.types";
import { nubewareClienteService } from "../services/nubewareCliente.service";
import type { CreateNubewareClienteRequest } from "../zod/nubewareCliente.zod";


// ✅ Hook para obtener TODOS los clientes Nubeware
export const useGetNubewareClientes = () => {
  return useQuery<NubewareClienteResponse[], Error>({
    queryKey: ["nubewareClientes"],
    queryFn: () => nubewareClienteService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// ✅ Hook para CREAR un cliente Nubeware (con recarga automática)
export const useCreateNubewareCliente = () => {
  const queryClient = useQueryClient();

  return useMutation<NubewareClienteResponse, Error, CreateNubewareClienteRequest>({
    mutationFn: (data) => nubewareClienteService.create(data),
    onSuccess: (data) => {
      toast.success(`¡Cliente ${data.name} creado exitosamente!`);
      // ✅ Recarga automática de la lista de clientes
      queryClient.invalidateQueries({ queryKey: ["nubewareClientes"] });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error al crear cliente",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1"
      });
    },
  });
};