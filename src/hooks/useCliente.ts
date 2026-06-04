// hooks/useCreateCliente.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { clienteService } from "../services/cliente.service";
import type { CreateClienteRequest, ClienteResponse } from "../schemas/cliente.schema";
import type { SedeResponse } from "../schemas/sede.schema";

export const useCreateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation<ClienteResponse, Error, CreateClienteRequest>({
    mutationFn: (data) => clienteService.create(data),
    onSuccess: (data) => {
      // Toast de éxito (como en login)
      toast.success(`¡Cliente ${data.name} creado exitosamente!`);
      
      // Invalida la query para refrescar la lista de clientes
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      // SweetAlert de error (como en login)
      Swal.fire({
        title: "Error al crear cliente",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1" // Tu color morado
      });
    },
  });
};

// Hook para obtener todos los clientes
export const useGetClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: () => clienteService.getAll(),
    
  });
};

// ✅ Hook para obtener las sedes de un cliente (ESTE ES EL QUE NECESITAS)
export const useGetSedesByCliente = (clientId: string) => {
  return useQuery<SedeResponse[], Error>({
    queryKey: ["clientes", clientId, "sedes"],
    queryFn: () => clienteService.getSedesByClientId(clientId),
    enabled: !!clientId, // Solo se ejecuta si hay un clientId
  });
};