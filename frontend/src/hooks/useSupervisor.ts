import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { supervisorService } from "../services/supervisor.service";

import type {
  CreateSupervisorRequest,
  UpdateSupervisorRequest,
} from "../types/supervisor.types";


export const useGetSupervisors = () => {
  return useQuery({
    queryKey: ["supervisors"],
    queryFn: supervisorService.getSupervisors,
  });
};


export const useCreateSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupervisorRequest) =>
      supervisorService.createSupervisor(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supervisors"],
      });
    },
  });
};

export const useUpdateSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      supervisorId,
      data,
    }: {
      supervisorId: number;
      data: UpdateSupervisorRequest;
    }) =>
      supervisorService.updateSupervisor(
        supervisorId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supervisors"],
      });
    },
  });
};