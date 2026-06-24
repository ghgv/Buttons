// hooks/useTrazabilidad.ts
import { useQuery } from "@tanstack/react-query";
import { trazabilidadService } from "../services/trazabilidad.service";
import { useState } from "react";

export const useGetTrazabilidad = (limit: number = 10, offset: number = 0) => {
    return useQuery({
        queryKey: ['trazabilidad', limit, offset],
        queryFn: () => trazabilidadService.getTrazabilidad(limit, offset),
        staleTime: 1000 * 60 * 5,
    });
};

export const useTrazabilidadPagination = (initialLimit: number = 10) => {
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(initialLimit);

    const { data, isLoading, isError, error } = useGetTrazabilidad(limit, offset);

    const nextPage = () => {
        setOffset(offset + limit);
    };

    const prevPage = () => {
        setOffset(Math.max(0, offset - limit));
    };

    const goToPage = (page: number) => {
        setOffset(page * limit);
    };

    const changeLimit = (newLimit: number) => {
        setLimit(newLimit);
        setOffset(0);
    };

    // ✅ Aseguramos que siempre sean boolean
    const hasNextPage = data ? data.length === limit : false;
    const hasPrevPage = offset > 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalItems = data ? offset + data.length + (data.length === limit ? limit : 0) : 0;

    return {
        data,
        isLoading,
        isError,
        error,
        offset,
        limit,
        nextPage,
        prevPage,
        goToPage,
        changeLimit,
        hasNextPage,  // ✅ Siempre boolean
        hasPrevPage,  // ✅ Siempre boolean
        currentPage,
        totalItems,
    };
};