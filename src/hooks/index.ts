import { useCreateSede, useGetSedesByClient } from "./useSede";
import { useCreateNivel, useGetNivelesBySede } from "./useNivel";
import { useGetClientes, useGetSedesByCliente, useCreateCliente } from "./useCliente";
import { useCreateBano, useGetBanosByLevel } from "./useBano";
import { useGetContadoresByBathroom, useCreateContador, useDeleteContador } from "./useContador";
import { useGetBotonerasByBathroom, useCreateBotonera, useDeleteBotonera } from "./useBotonera";
import { useGetReporteMetrics } from "./useReportes";
import { useAuth } from "./useAuth";

export { useCreateCliente, useCreateSede, useGetSedesByClient, useCreateNivel, useGetNivelesBySede, useGetClientes, useGetSedesByCliente, useAuth, useCreateBano, useGetBanosByLevel, useGetContadoresByBathroom, useCreateContador, useDeleteContador, useGetBotonerasByBathroom, useCreateBotonera, useDeleteBotonera, useGetReporteMetrics };