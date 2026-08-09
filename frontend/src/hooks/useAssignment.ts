import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { assignmentService } from "../services/assignment.service";

import type {
  CreateAssignmentRequest,
  UpdateTechnicianRequest,
} from "../types/assignment.types";


export const useGetAssignmentTechnicians = () => {
  return useQuery({
    queryKey: ["assignment-technicians"],
    queryFn: assignmentService.getTechnicians,
  });
};


export const useGetAssignmentBathrooms = () => {
  return useQuery({
    queryKey: ["assignment-bathrooms"],
    queryFn: assignmentService.getBathrooms,
  });
};


export const useGetAssignments = () => {
  return useQuery({
    queryKey: ["bathroom-assignments"],
    queryFn: assignmentService.getAssignments,
  });
};


export const useCreateAssignment = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateAssignmentRequest
    ) => assignmentService.createAssignment(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bathroom-assignments"],
      });
    },
  });
};


export const useRemoveAssignment = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) =>
      assignmentService.removeAssignment(assignmentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bathroom-assignments"],
      });
    },
  });
};

export const useCreateTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
    }) => assignmentService.createTechnician(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignment-technicians"],
      });
    },
  });
};

export const useUpdateTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      technicianId,
      data,
    }: {
      technicianId: number;
      data: UpdateTechnicianRequest;
    }) =>
      assignmentService.updateTechnician(
        technicianId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignment-technicians"],
      });
    },
  });
};