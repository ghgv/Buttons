// types/nubewareCliente.types.ts
// types/nubewareCliente.types.ts
export interface NubewareClienteResponse {
  id: number;                    // ✅ number, no string
  name: string;           // ✅ Puede ser null
  email: string;
  phone_number: string;          // ✅ string, no opcional
  address: string;              // ✅ string, no opcional
  nit: number;
}

export interface NubewareClienteListResponse {
  data: NubewareClienteResponse[];
  total: number;
  page: number;
  limit: number;
}