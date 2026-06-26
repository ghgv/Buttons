// hooks/useSubcliente.ts
import { useQuery } from "@tanstack/react-query";
import { subclienteService } from "../services/subcliente.service";
import type { SubclienteResponse } from "../types/subcliente.types";

// ✅ Hook para obtener subclientes por client_local_id
export const useGetSubclientesByClientLocalId = (clientLocalId: number) => {
  return useQuery<SubclienteResponse[], Error>({
    queryKey: ["subclientes", clientLocalId],
    queryFn: () => subclienteService.getByClientLocalId(clientLocalId),
    enabled: !!clientLocalId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};