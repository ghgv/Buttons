export interface Technician {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export interface UpdateTechnicianRequest {
  name: string;
  email: string;
}

export interface AssignmentBathroom {
  id: number;
  name: string;
  gender: string;
  description: string | null;
  level: {
    id: number;
    name: string;
    floor: number;
  };
  sede: {
    id: number;
    name: string;
  };
}

export interface BathroomAssignment {
  id: number;

  bathroom: {
    id: number;
    name: string;
    gender: string;
  };

  level: {
    id: number;
    name: string;
    floor: number;
  };

  sede: {
    id: number;
    name: string;
  };

  technician: {
    id: number;
    name: string;
    email: string;
  };

  assigned_at: string;
}

export interface CreateAssignmentRequest {
  bathroom_id: number;
  technician_id: number;
}