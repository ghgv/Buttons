import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { clienteService } from "../services/cliente.service";
import type { CreateClienteRequest } from "../zod/cliente.zod";
import type { SedeResponse } from "../types/sede.types";
import type { ClienteResponse } from "../types/cliente.types";

/**
 * Hook para la creación de un nuevo cliente corporativo.
 * Maneja los estados globales de la mutación y la invalidación de caché.
 */
export const useCreateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation<ClienteResponse, Error, CreateClienteRequest>({
    mutationFn: (data) => clienteService.create(data),
    onSuccess: (data) => {
      // Notificación flotante rápida de éxito
      toast.success(`¡Cliente ${data.name} creado exitosamente!`);
      
      // Invalidación inmediata del caché para forzar un fetch limpio en segundo plano
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error) => {
      // Alerta bloqueante para errores críticos devueltos por el backend controlado en el servicio
      Swal.fire({
        title: "Error al crear cliente",
        text: error.message,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#830AD1" // Color morado de identidad corporativa
      });
    },
  });
};

/**
 * Hook para obtener la nómina completa de clientes registrados.
 * Tipado explícitamente <ClienteResponse[], Error> para evitar inconsistencias en la UI.
 */
export const useGetClientes = () => {
  return useQuery<ClienteResponse[], Error>({
    queryKey: ["clientes"],
    queryFn: () => clienteService.getAll(),
    // Opcional: puedes agregar propiedades de resiliencia como staleTime o retry aquí si producción lo exige
  });
};

/**
 * Hook para obtener las sedes asociadas a un cliente específico.
 * Se ejecuta de manera perezosa (lazy) únicamente si el clientId es válido.
 */
export const useGetSedesByCliente = (clientId: string) => {
  return useQuery<SedeResponse[], Error>({
    queryKey: ["clientes", clientId, "sedes"],
    queryFn: () => clienteService.getSedesByClientId(clientId),
    enabled: Boolean(clientId), // Cast explícito a booleano, más limpio y legible que !!
  });
};