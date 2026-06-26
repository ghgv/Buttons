// types/subcliente.types.ts
export interface SedeSubcliente {
  id: number;
  name: string;
  address: string;
}

export interface SubclienteResponse {
  id: number;
  name: string;
  nit: number;
  email: string;
  client_local_id: number;
  sedes: SedeSubcliente[];
}