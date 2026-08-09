import { api } from "../api/axios.client";

import type {
  Supervisor,
  CreateSupervisorRequest,
  CreateSupervisorResponse,
  UpdateSupervisorRequest,
} from "../types/supervisor.types";

export const supervisorService = {
  getSupervisors: async (): Promise<Supervisor[]> => {
    const { data } = await api.get<Supervisor[]>(
      "/supervisors"
    );

    return data;
  },

  createSupervisor: async (
    supervisor: CreateSupervisorRequest
  ): Promise<CreateSupervisorResponse> => {
    const { data } = await api.post<CreateSupervisorResponse>(
      "/supervisors",
      supervisor
    );

    return data;
  },

    updateSupervisor: async (
    supervisorId: number,
    supervisor: UpdateSupervisorRequest
    ): Promise<CreateSupervisorResponse> => {
    const { data } = await api.put<CreateSupervisorResponse>(
        `/supervisors/${supervisorId}`,
        supervisor
    );

    return data;
    },
};