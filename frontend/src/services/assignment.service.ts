import { api } from "../api/axios.client";

import type {
  Technician,
  AssignmentBathroom,
  BathroomAssignment,
  CreateAssignmentRequest,
  UpdateTechnicianRequest,
} from "../types/assignment.types";

export const assignmentService = {

  getTechnicians: async (): Promise<Technician[]> => {
    const { data } = await api.get<Technician[]>(
      "/bathroom-assignments/technicians"
    );

    return data;
  },

  getBathrooms: async (): Promise<AssignmentBathroom[]> => {
    const { data } = await api.get<AssignmentBathroom[]>(
      "/bathroom-assignments/bathrooms"
    );

    return data;
  },

  getAssignments: async (): Promise<BathroomAssignment[]> => {
    const { data } = await api.get<BathroomAssignment[]>(
      "/bathroom-assignments"
    );

    return data;


  },

  createAssignment: async (
    assignment: CreateAssignmentRequest
  ) => {
    const { data } = await api.post(
      "/bathroom-assignments",
      assignment
    );

    return data;
  },

  removeAssignment: async (
    assignmentId: number
  ) => {
    const { data } = await api.delete(
      `/bathroom-assignments/${assignmentId}`
    );

    return data;
  },

  createTechnician: async (technician: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post(
    "/bathroom-assignments/technicians",
    technician
  );

  return data;

},

updateTechnician: async (
  technicianId: number,
  technician: UpdateTechnicianRequest
) => {
  const { data } = await api.put(
    `/bathroom-assignments/technicians/${technicianId}`,
    technician
  );

  return data;
},
};

