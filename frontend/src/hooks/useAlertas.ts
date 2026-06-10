// hooks/useAlertas.ts
import { useQuery } from "@tanstack/react-query";
import { alertasService, type AlertasResponse } from "../services/alertas.service";

export const useGetAlertas = (limit: number = 100, offset: number = 0) => {
  return useQuery<AlertasResponse, Error>({
    queryKey: ["alertas", limit, offset],
    queryFn: () => alertasService.getAlertas(limit, offset),
    staleTime: 30000, // 30 segundos
  });
};