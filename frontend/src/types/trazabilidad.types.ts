// types/trazabilidad.types.ts

export type TraceabilityValue = Record<string, string | number | boolean | null> | null;

export interface TrazabilidadType {
    user_name: string;
    table_name: string;
    action: string;
    previous_values: string | null | TraceabilityValue;
    new_values: TraceabilityValue;
    created_at: string;
}

// El backend devuelve directamente un array
export type TrazabilidadResponse = TrazabilidadType[];