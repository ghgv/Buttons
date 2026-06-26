import { useCreateSede, useGetSedesByClient } from "./useSede";
import { useCreateNivel, useGetNivelesBySede } from "./useNivel";
import { useGetClientes, useGetSedesByCliente, useCreateCliente } from "./useCliente";
import { useCreateBano, useGetBanosByLevel } from "./useBano";
import { useGetContadoresByBathroom, useCreateContador, useDeleteContador,useUpdateContador } from "./useContador";
import { useGetBotonerasByBathroom, useCreateBotonera, useDeleteBotonera, useUpdateBotonera } from "./useBotonera";
import { useGetReporteMetrics } from "./useReportes";
import { useAuth } from "./useAuth";

// ... imports anteriores
import { useGetSubclientesByClientLocalId } from "./useSubcliente";

// ✅ Importamos los hooks de Nubeware
import { useGetNubewareClientes, useCreateNubewareCliente  } from "./useNubewareCliente";

export { useCreateCliente, useCreateSede, useGetSedesByClient, useCreateNivel, useGetNivelesBySede, useGetClientes, useGetSedesByCliente, useAuth, useCreateBano, useGetBanosByLevel, useGetContadoresByBathroom, useCreateContador, useDeleteContador, useGetBotonerasByBathroom, useCreateBotonera, useDeleteBotonera, useGetReporteMetrics, useUpdateContador, useUpdateBotonera,


     // ✅ Exportamos los hooks de Nubeware
  useGetNubewareClientes,
  useCreateNubewareCliente,
  useGetSubclientesByClientLocalId
 };