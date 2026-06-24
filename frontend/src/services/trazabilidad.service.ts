// services/trazabilidad.service.ts
import { api } from "../api/axios.client";
import axios from 'axios';
import type { TrazabilidadResponse } from "../types/trazabilidad.types";

export const trazabilidadService = {
    getTrazabilidad: async (limit: number = 50, offset: number = 0): Promise<TrazabilidadResponse> => {
        try {
            const { data } = await api.get<TrazabilidadResponse>(`/traceability?limit=${limit}&offset=${offset}`);
            console.log('trazabilidad datos:', data);
            return data; // data es directamente el array
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.detail || "Error al obtener la trazabilidad");
            }
            throw new Error("No se pudo conectar con el servidor");
        }
    }
};