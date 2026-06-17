// pages/dashboard/Dashboard.tsx
import { useState, useMemo, useEffect } from "react";
import { useGetClientes } from "../../hooks/useCliente";
import { useGetDashboardMetrics } from "../../hooks/useDashboard";
import { Building2, AlertTriangle, RefreshCw } from "lucide-react";

// Importar componentes
import DashboardHeader from "./DashboardHeader";
import DashboardFilters from "./DashboardFilters";
import DashboardStats from "./DashboardStats";
import FlujoPersonasChart from "./charts/FlujoPersonasChart";
import AlertasPorSedeChart from "./charts/AlertasPorSedeChart";
import EventosDiariosChart from "./charts/EventosDiariosChart";
import AlertasPorDiaChart from "./charts/AlertasPorDiaChart";
import UsoGeneroChart from "./charts/UsoGeneroChart";

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedSedes, setSelectedSedes] = useState<string[]>([]);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [filtrosModalOpen, setFiltrosModalOpen] = useState(false);

  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  const { data: metrics, isLoading, error, refetch } = useGetDashboardMetrics(
    selectedClientId ? parseInt(selectedClientId) : null
  );

  // Obtener lista de todas las sedes
  const sedesList = useMemo(() => {
    if (!metrics?.sedes_info) return [];
    return metrics.sedes_info.map(sede => sede.name);
  }, [metrics?.sedes_info]);

  // Auto-seleccionar todas las sedes cuando se carga el cliente
  useEffect(() => {
    if (sedesList.length > 0 && selectedSedes.length === 0) {
      setSelectedSedes([...sedesList]);
    }
  }, [sedesList]);

  // Obtener todos los eventos
  const allEventos = useMemo(() => {
    if (!metrics?.sedes_info) return [];
    return metrics.sedes_info.flatMap(sede => sede.eventos);
  }, [metrics?.sedes_info]);

  // Filtrar eventos por múltiples sedes y fechas
  const filteredEventos = useMemo(() => {
    if (!allEventos.length) return [];
    
    let eventos = allEventos;
    
    if (selectedSedes.length > 0) {
      eventos = eventos.filter(e => selectedSedes.includes(e.sede));
    }
    
    if (fechaInicio) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) >= new Date(fechaInicio));
    }
    
    if (fechaFin) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) <= new Date(fechaFin));
    }
    
    return eventos;
  }, [allEventos, selectedSedes, fechaInicio, fechaFin]);

  // Handlers
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(e.target.value);
    setSelectedSedes([]);
    setFechaInicio("");
    setFechaFin("");
  };

  const handleFilterApply = () => {
    if (selectedClientId) {
      refetch();
    }
  };

  const handleResetFilters = () => {
    setSelectedSedes([...sedesList]);
    setFechaInicio("");
    setFechaFin("");
  };

  // Calcular estadísticas filtradas
  const getFilteredStats = () => {
    if (!filteredEventos.length) {
      return { totalIngresos: 0, totalAlertas: 0 };
    }
    
    let totalIngresos = 0;
    let totalAlertas = 0;
    
    filteredEventos.forEach(evento => {
      if (evento.tipo_evento === 'ingreso') {
        totalIngresos += evento.valor;
      } else {
        totalAlertas += 1;
      }
    });
    
    return { totalIngresos, totalAlertas };
  };

  // Procesar datos para gráficos
  const getEventsByDay = () => {
    if (!filteredEventos.length) return [];

    const eventsByDay: { [key: string]: { ingresos: number; alertas: number } } = {};

    filteredEventos.forEach(evento => {
      const dateKey = evento.fecha_hora.split('T')[0];
      if (!eventsByDay[dateKey]) {
        eventsByDay[dateKey] = { ingresos: 0, alertas: 0 };
      }
      if (evento.tipo_evento === 'ingreso') {
        eventsByDay[dateKey].ingresos += evento.valor;
      } else {
        eventsByDay[dateKey].alertas += 1;
      }
    });

    return Object.entries(eventsByDay)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7)
      .map(([fechaKey, data]) => {
        const [year, month, day] = fechaKey.split('-');
        return {
          name: `${parseInt(day)}/${parseInt(month)}/${year}`,
          ingresos: data.ingresos,
          alertas: data.alertas
        };
      });
  };

  // ✅ Nueva función para procesar alertas por día
  const getAlertasPorDia = () => {
    if (!filteredEventos.length) return [];

    const alertasByDay: { 
      [key: string]: { 
        total: number; 
        sinPapel: number; 
        sucio: number; 
        malOlor: number; 
        sinJabon: number;
      } 
    } = {};

    filteredEventos.forEach(evento => {
      if (evento.tipo_evento === 'alerta') {
        const dateKey = evento.fecha_hora.split('T')[0];
        
        if (!alertasByDay[dateKey]) {
          alertasByDay[dateKey] = { 
            total: 0, 
            sinPapel: 0, 
            sucio: 0, 
            malOlor: 0, 
            sinJabon: 0 
          };
        }

        alertasByDay[dateKey].total += 1;

        switch (evento.detalle_evento) {
          case 'Baño sin papel':
            alertasByDay[dateKey].sinPapel += 1;
            break;
          case 'Baño sucio':
            alertasByDay[dateKey].sucio += 1;
            break;
          case 'Baño con mal olor':
            alertasByDay[dateKey].malOlor += 1;
            break;
          case 'Baño sin jabon':
            alertasByDay[dateKey].sinJabon += 1;
            break;
          default:
            break;
        }
      }
    });

    return Object.entries(alertasByDay)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([fechaKey, data]) => {
        const [year, month, day] = fechaKey.split('-');
        return {
          name: `${parseInt(day)}/${parseInt(month)}/${year}`,
          total: data.total,
          sinPapel: data.sinPapel,
          sucio: data.sucio,
          malOlor: data.malOlor,
          sinJabon: data.sinJabon
        };
      });
  };

  const getUsoByGenero = () => {
    if (!filteredEventos.length) return [];

    const usoByGenero: { [key: string]: number } = {
      'Hombres': 0,
      'Mujeres': 0,
      'Mixto': 0,
      'Discapacitados': 0
    };

    filteredEventos.forEach(evento => {
      if (evento.tipo_evento === 'ingreso') {
        switch (evento.genero_bano) {
          case 'men':
            usoByGenero['Hombres'] += evento.valor;
            break;
          case 'women':
            usoByGenero['Mujeres'] += evento.valor;
            break;
          case 'mixed':
            usoByGenero['Mixto'] += evento.valor;
            break;
          case 'disabled':
            usoByGenero['Discapacitados'] += evento.valor;
            break;
          default:
            break;
        }
      }
    });

    return Object.entries(usoByGenero)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  const getFlujoPersonas = () => {
    if (!filteredEventos.length) return [];

    const ingresosByDay: { [key: string]: number } = {};

    filteredEventos.forEach(evento => {
      if (evento.tipo_evento === 'ingreso') {
        const dateKey = evento.fecha_hora.split('T')[0];
        ingresosByDay[dateKey] = (ingresosByDay[dateKey] || 0) + evento.valor;
      }
    });

    const fechasOrdenadas = Object.keys(ingresosByDay).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    
    const ultimasFechas = fechasOrdenadas.slice(-7);
    
    return ultimasFechas.map(fechaKey => {
      const [year, month, day] = fechaKey.split('-');
      return {
        name: `${parseInt(day)}/${parseInt(month)}/${year}`,
        personas: ingresosByDay[fechaKey]
      };
    });
  };

  const getSedesOBanosAlertasData = () => {
    if (!metrics?.sedes_info) return [];

    let sedesFiltradas = metrics.sedes_info;
    if (selectedSedes.length > 0) {
      sedesFiltradas = sedesFiltradas.filter(s => selectedSedes.includes(s.name));
    }

    if (selectedSedes.length === 1) {
      const sedeSeleccionada = metrics.sedes_info.find(s => s.name === selectedSedes[0]);
      if (!sedeSeleccionada || !sedeSeleccionada.eventos) return [];

      const banosMap = new Map<string, { sinPapel: number; sucio: number; malOlor: number; sinJabon: number }>();

      sedeSeleccionada.eventos.forEach(evento => {
        if (evento.tipo_evento === 'alerta') {
          const generoLabel = evento.genero_bano === 'men' ? 'Hombres' :
                              evento.genero_bano === 'women' ? 'Mujeres' :
                              evento.genero_bano === 'mixed' ? 'Mixto' : 'Discapacitados';
          const banoKey = `${evento.nivel} - ${generoLabel}`;
          
          if (!banosMap.has(banoKey)) {
            banosMap.set(banoKey, { sinPapel: 0, sucio: 0, malOlor: 0, sinJabon: 0 });
          }

          const stats = banosMap.get(banoKey)!;
          switch (evento.detalle_evento) {
            case 'Baño sin papel':
              stats.sinPapel++;
              break;
            case 'Baño sucio':
              stats.sucio++;
              break;
            case 'Baño con mal olor':
              stats.malOlor++;
              break;
            case 'Baño sin jabon':
              stats.sinJabon++;
              break;
            default:
              break;
          }
        }
      });

      return Array.from(banosMap.entries())
        .map(([bano, stats]) => ({
          name: bano,
          sinPapel: stats.sinPapel,
          sucio: stats.sucio,
          malOlor: stats.malOlor,
          sinJabon: stats.sinJabon
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return sedesFiltradas.map(sede => {
      if (!sede.eventos || sede.eventos.length === 0) {
        return {
          name: sede.name,
          sinPapel: 0,
          sucio: 0,
          malOlor: 0,
          sinJabon: 0
        };
      }

      let eventosSede = sede.eventos;
      if (fechaInicio) {
        eventosSede = eventosSede.filter(e => new Date(e.fecha_hora) >= new Date(fechaInicio));
      }
      if (fechaFin) {
        eventosSede = eventosSede.filter(e => new Date(e.fecha_hora) <= new Date(fechaFin));
      }

      const alertas = eventosSede.filter(e => e.tipo_evento === 'alerta');
      
      const sinPapel = alertas.filter(a => a.detalle_evento === 'Baño sin papel').length;
      const sucio = alertas.filter(a => a.detalle_evento === 'Baño sucio').length;
      const malOlor = alertas.filter(a => a.detalle_evento === 'Baño con mal olor').length;
      const sinJabon = alertas.filter(a => a.detalle_evento === 'Baño sin jabon').length;

      return {
        name: sede.name,
        sinPapel,
        sucio,
        malOlor,
        sinJabon
      };
    });
  };

  // Datos procesados
  const eventosPorDia = getEventsByDay();
  const alertasPorDia = getAlertasPorDia(); // ✅ Nuevo dato
  const usoPorGenero = getUsoByGenero();
  const flujoPersonas = getFlujoPersonas();
  const sedesOBanosAlertasData = getSedesOBanosAlertasData();
  const { totalIngresos, totalAlertas } = getFilteredStats();

  const selectedCliente = clientes.find(c => c.id === selectedClientId);
  
  const hasActiveFilters = Boolean(
    (selectedSedes.length > 0 && selectedSedes.length < sedesList.length) || 
    fechaInicio || 
    fechaFin
  );

  const getSedesText = () => {
    if (selectedSedes.length === 0) return 'Ninguna sede';
    if (selectedSedes.length === sedesList.length) return 'Todas las sedes';
    if (selectedSedes.length === 1) return selectedSedes[0];
    return `${selectedSedes.length} sedes seleccionadas`;
  };

  // Renderizado condicional inicial
  if (isLoadingClientes) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado sin cliente seleccionado
  if (!selectedClientId) {
    return (
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          selectedClientId={selectedClientId}
          clientes={clientes}
          selectedCliente={selectedCliente}
          selectedSedes={selectedSedes}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          hasActiveFilters={hasActiveFilters}
          onClientChange={handleClientChange}
          onFilterToggle={() => setFiltrosModalOpen(!filtrosModalOpen)}
          isLoadingClientes={isLoadingClientes}
        />
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un cliente</h3>
          <p className="text-gray-500">Selecciona un cliente de la lista para ver sus métricas</p>
        </div>
      </div>
    );
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          selectedClientId={selectedClientId}
          clientes={clientes}
          selectedCliente={selectedCliente}
          selectedSedes={selectedSedes}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          hasActiveFilters={hasActiveFilters}
          onClientChange={handleClientChange}
          onFilterToggle={() => setFiltrosModalOpen(!filtrosModalOpen)}
          isLoadingClientes={isLoadingClientes}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando métricas...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="p-4 max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          selectedClientId={selectedClientId}
          clientes={clientes}
          selectedCliente={selectedCliente}
          selectedSedes={selectedSedes}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          hasActiveFilters={hasActiveFilters}
          onClientChange={handleClientChange}
          onFilterToggle={() => setFiltrosModalOpen(!filtrosModalOpen)}
          isLoadingClientes={isLoadingClientes}
        />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizado completo
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <DashboardHeader
        selectedClientId={selectedClientId}
        clientes={clientes}
        selectedCliente={selectedCliente}
        selectedSedes={selectedSedes}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        hasActiveFilters={hasActiveFilters}
        onClientChange={handleClientChange}
        onFilterToggle={() => setFiltrosModalOpen(!filtrosModalOpen)}
        isLoadingClientes={isLoadingClientes}
      />

      <DashboardFilters
        isOpen={filtrosModalOpen}
        selectedSedes={selectedSedes}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        sedesList={sedesList}
        onClose={() => setFiltrosModalOpen(false)}
        onSedesChange={setSelectedSedes}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onReset={handleResetFilters}
        onApply={handleFilterApply}
      />

      <DashboardStats
        totalSedes={selectedSedes.length > 0 ? selectedSedes.length : metrics?.resumen_infraestructura?.total_sedes || 0}
        totalNiveles={metrics?.resumen_infraestructura?.total_levels || 0}
        totalBanios={metrics?.resumen_infraestructura?.total_bathrooms || 0}
        totalIngresos={totalIngresos}
        totalAlertas={totalAlertas}
        selectedSedes={selectedSedes}
        sedesText={getSedesText()}
      />

      {/* ✅ Grid de 2 columnas para las primeras 4 gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlujoPersonasChart
          data={flujoPersonas}
          selectedSedes={selectedSedes}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
        />

        <AlertasPorSedeChart
          data={sedesOBanosAlertasData}
          selectedSedes={selectedSedes}
        />

        <EventosDiariosChart
          data={eventosPorDia}
          selectedSedes={selectedSedes}
        />

        <UsoGeneroChart data={usoPorGenero} />
      </div>

      {/* ✅ Nueva gráfica de Alertas por Día - Ocupa todo el ancho */}
      <AlertasPorDiaChart
        data={alertasPorDia}
        selectedSedes={selectedSedes}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
      />
    </div>
  );
}