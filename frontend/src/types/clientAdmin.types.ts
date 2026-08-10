export interface ClientAdminResponse {
  id: number;
  client_id: number;
  client_name: string;
  name: string;
  email: string;
  is_active: boolean;
}

export interface CreateClientAdminRequest {
  client_id: number;
  name: string;
  email: string;
  password: string;
}

export interface UpdateClientAdminRequest {
  client_id: number;
  name: string;
  email: string;
}