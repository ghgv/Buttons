export interface Supervisor {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export interface CreateSupervisorRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateSupervisorResponse {
  message: string;
  supervisor: Supervisor;
}

export interface UpdateSupervisorRequest {
  name: string;
  email: string;
}