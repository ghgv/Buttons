// pages/dashboard/Reportes.tsx
import { useState, useMemo } from "react";

import { exportToExcel } from "../../utils/exportExcel";
import TablaPrevisualizacion from "../../components/reportes/TablaPrevisualizacion";
import Loading from "../../components/ui/Loading";
import { useGetClientes, useGetReporteMetrics } from "../../hooks";
import FiltrosReportes from "../../components/reportes/FiltrosReportes";

export default function Reportes() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  const { data: metrics, isLoading, error, refetch } = useGetReporteMetrics(
    selectedClientId ? parseInt(selectedClientId) : null
  );

  // Obtener lista única de sedes
  const sedesList = useMemo(() => {
    if (!metrics?.eventos) return [];
    const sedes = new Set<string>();
    metrics.eventos.forEach((evento: any) => {
      if (evento.sede) sedes.add(evento.sede);
    });
    return Array.from(sedes);
  }, [metrics?.eventos]);

  // Filtrar eventos por sede y fechas
  const filteredEventos = useMemo(() => {
    if (!metrics?.eventos) return [];
    
    let eventos = [...metrics.eventos];
    
    if (selectedSede) {
      eventos = eventos.filter(e => e.sede === selectedSede);
    }
    
    if (fechaInicio) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) >= new Date(fechaInicio));
    }
    
    if (fechaFin) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) <= new Date(fechaFin));
    }
    
    return eventos.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
  }, [metrics?.eventos, selectedSede, fechaInicio, fechaFin]);

  const handleGenerar = () => {
    if (selectedClientId) {
      refetch();
    }
  };

  const handleExportar = () => {
    if (!metrics?.eventos) return;
    
    const selectedCliente = clientes.find(c => c.id === selectedClientId);
    
    exportToExcel({
      eventos: filteredEventos,
      resumen: metrics.resumen_infraestructura,
      clienteNombre: selectedCliente?.name || "Cliente",
      fechaInicio,
      fechaFin,
    });
  };

  const selectedCliente = clientes.find(c => c.id === selectedClientId);
  const hasData = filteredEventos.length > 0;

  if (isLoadingClientes) {
    return <Loading text="Cargando Datos..." />;
  }

  return (
    <div className=" max-w-8xl mx-auto">
      {/* Botón Volver */}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-1">Exporta métricas de clientes a Excel</p>
      </div>

      {/* Filtros */}
      <FiltrosReportes
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        selectedSede={selectedSede}
        setSelectedSede={setSelectedSede}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        sedesList={sedesList}
        clientes={clientes}
        onGenerar={handleGenerar}
        onExportar={handleExportar}
        isLoading={isLoading}
        hasData={hasData}
      />

      {/* Información del cliente seleccionado */}
      {selectedClientId && selectedCliente && (
        <div className="mt-4 p-3 bg-purple-50 rounded-xl">
          <p className="text-sm text-gray-600">
            Cliente: <span className="font-semibold text-purple-600">{selectedCliente.name}</span>
            {selectedSede && <span className="ml-2">| Sede: <span className="font-semibold text-cyan-600">{selectedSede}</span></span>}
          </p>
        </div>
      )}

      {/* Resultados */}
      {isLoading ? (
        <div className="mt-8">
          <Loading text="Cargando métricas..." />
        </div>
      ) : error ? (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Error al cargar los datos: {error.message}</p>
          <button onClick={handleGenerar} className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg">
            Reintentar
          </button>
        </div>
      ) : selectedClientId ? (
        <div className="mt-8">
          <TablaPrevisualizacion
            eventos={filteredEventos}
            resumen={metrics?.resumen_infraestructura}
            clienteNombre={selectedCliente?.name || "Cliente"}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </div>
      ) : null}
    </div>
  );
}