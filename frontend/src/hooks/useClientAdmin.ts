import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import Swal from "sweetalert2";

import { clientAdminService } from "../services/clientAdmin.service";

import type {
  ClientAdminResponse,
  CreateClientAdminRequest,
  UpdateClientAdminRequest,
} from "../types/clientAdmin.types";


export const useGetClientAdmins = () => {
  return useQuery<ClientAdminResponse[], Error>({
    queryKey: ["clientAdmins"],
    queryFn: () => clientAdminService.getAll(),
  });
};


export const useCreateClientAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ClientAdminResponse,
    Error,
    CreateClientAdminRequest
  >({
    mutationFn: (data) => clientAdminService.create(data),

    onSuccess: (data) => {
      toast.success(
        `Administrador ${data.name} creado correctamente`
      );

      queryClient.invalidateQueries({
        queryKey: ["clientAdmins"],
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Error al crear administrador",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#830AD1",
      });
    },
  });
};


export const useUpdateClientAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ClientAdminResponse,
    Error,
    {
      id: number;
      data: UpdateClientAdminRequest;
    }
  >({
    mutationFn: ({ id, data }) =>
      clientAdminService.update(id, data),

    onSuccess: () => {
      toast.success(
        "Administrador actualizado correctamente"
      );

      queryClient.invalidateQueries({
        queryKey: ["clientAdmins"],
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Error al actualizar administrador",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#830AD1",
      });
    },
  });
};


export const useDeleteClientAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => clientAdminService.delete(id),

    onSuccess: () => {
      toast.success(
        "Administrador eliminado correctamente"
      );

      queryClient.invalidateQueries({
        queryKey: ["clientAdmins"],
      });
    },

    onError: (error) => {
      Swal.fire({
        title: "Error al eliminar administrador",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#830AD1",
      });
    },
  });
};