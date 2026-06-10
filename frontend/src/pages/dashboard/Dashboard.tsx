// pages/dashboard/Dashboard.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useGetClientes } from "../../hooks/useCliente";
import { useGetDashboardMetrics } from "../../hooks/useDashboard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  Building2,
  Users,
  Droplets,
  RefreshCw,
  Activity,
  ChevronDown,
  Filter,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  AlertTriangle,
  X
} from "lucide-react";

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// Orden fijo de los tipos de alertas
const ALERTAS_ORDER = [
  { key: 'sinPapel', name: '🧻 Sin Papel', color: '#f59e0b' },
  { key: 'sucio', name: '🧹 Sucio', color: '#ef4444' },
  { key: 'malOlor', name: '👃 Mal Olor', color: '#8b5cf6' },
  { key: 'sinJabon', name: '🧼 Sin Jabón', color: '#06b6d4' }
];

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [filtrosModalOpen, setFiltrosModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  const { data: metrics, isLoading, error, refetch } = useGetDashboardMetrics(
    selectedClientId ? parseInt(selectedClientId) : null
  );

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtrosModalOpen && 
          modalRef.current && 
          !modalRef.current.contains(event.target as Node) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target as Node)) {
        setFiltrosModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filtrosModalOpen]);

  // Obtener lista de todas las sedes (incluyendo las sin eventos)
  const sedesList = useMemo(() => {
    if (!metrics?.sedes_info) return [];
    return metrics.sedes_info.map(sede => sede.name);
  }, [metrics?.sedes_info]);

  // Obtener todos los eventos (aplanando sedes_info)
  const allEventos = useMemo(() => {
    if (!metrics?.sedes_info) return [];
    return metrics.sedes_info.flatMap(sede => sede.eventos);
  }, [metrics?.sedes_info]);

  // Filtrar eventos por sede seleccionada y fechas
  const filteredEventos = useMemo(() => {
    if (!allEventos.length) return [];
    
    let eventos = allEventos;
    
    if (selectedSede) {
      eventos = eventos.filter(e => e.sede === selectedSede);
    }
    
    if (fechaInicio) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) >= new Date(fechaInicio));
    }
    
    if (fechaFin) {
      eventos = eventos.filter(e => new Date(e.fecha_hora) <= new Date(fechaFin));
    }
    
    return eventos;
  }, [allEventos, selectedSede, fechaInicio, fechaFin]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(e.target.value);
    setSelectedSede("");
    setFechaInicio("");
    setFechaFin("");
    setFiltrosModalOpen(false);
  };

  const handleFilterApply = () => {
    if (selectedClientId) {
      refetch();
      setFiltrosModalOpen(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedSede("");
    setFechaInicio("");
    setFechaFin("");
    setFiltrosModalOpen(false);
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

  // Procesar datos para gráfico de eventos por día (Línea)
  // Procesar datos para gráfico de eventos por día (Línea) - CORREGIDO
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

  // Procesar datos para gráfico de ALERTAS POR TIPO
  const getAlertasByTipo = () => {
    if (!filteredEventos.length) return [];

    const alertasByTipo: { [key: string]: number } = {
      '🧻 Sin Papel': 0,
      '🧹 Sucio': 0,
      '👃 Mal Olor': 0,
      '🧼 Sin Jabón': 0
    };

    filteredEventos.forEach(evento => {
      if (evento.tipo_evento === 'alerta') {
        switch (evento.detalle_evento) {
          case 'Baño sin papel':
            alertasByTipo['🧻 Sin Papel']++;
            break;
          case 'Baño sucio':
            alertasByTipo['🧹 Sucio']++;
            break;
          case 'Baño con mal olor':
            alertasByTipo['👃 Mal Olor']++;
            break;
          case 'Baño sin jabon':
            alertasByTipo['🧼 Sin Jabón']++;
            break;
          default:
            break;
        }
      }
    });

    return Object.entries(alertasByTipo).map(([name, cantidad]) => ({
      name,
      cantidad
    }));
  };

  // Procesar datos para gráfico de uso por género (Pastel)
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

  // Procesar datos para gráfico de ÁREA (Flujo de personas) - CORREGIDO
  // Procesar datos para gráfico de ÁREA (Flujo de personas) - CORREGIDO
  const getFlujoPersonas = () => {
    if (!filteredEventos.length) return [];

    // Agrupamos usando el string de fecha truncado (YYYY-MM-DD) para evitar problemas de parseo
    const ingresosByDay: { [key: string]: number } = {};

    filteredEventos.forEach(evento => {
      if (evento.tipo_evento === 'ingreso') {
        const dateKey = evento.fecha_hora.split('T')[0]; // Obtiene '2026-05-31'
        ingresosByDay[dateKey] = (ingresosByDay[dateKey] || 0) + evento.valor;
      }
    });

    // Ordenar las llaves (fechas ISO) de menor a mayor de forma nativa
    const fechasOrdenadas = Object.keys(ingresosByDay).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    
    // Tomar los últimos 7 días
    const ultimasFechas = fechasOrdenadas.slice(-7);
    
    // Retornar los datos formateando la visualización al final
    return ultimasFechas.map(fechaKey => {
      const [year, month, day] = fechaKey.split('-');
      return {
        name: `${parseInt(day)}/${parseInt(month)}/${year}`, // Formato D/M/YYYY para el XAxis
        personas: ingresosByDay[fechaKey]
      };
    });
  };

  // Procesar datos para gráfico de BARRAS APILADAS (Alertas por Sede o por Baño)
  const getSedesOBanosAlertasData = () => {
    if (!metrics?.sedes_info) return [];

    // Si hay una sede seleccionada, mostrar baños de esa sede
    if (selectedSede) {
      const sedeSeleccionada = metrics.sedes_info.find(s => s.name === selectedSede);
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

    // Sin filtro de sede: mostrar todas las sedes
    return metrics.sedes_info.map(sede => {
      if (!sede.eventos || sede.eventos.length === 0) {
        return {
          name: sede.name,
          sinPapel: 0,
          sucio: 0,
          malOlor: 0,
          sinJabon: 0
        };
      }

      // Filtrar eventos por fechas si están seleccionadas
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

  const getChartTitle = () => {
    if (selectedSede) {
      return `Alertas por Baño - ${selectedSede}`;
    }
    return "Alertas por Sede";
  };

  const getChartSubtitle = () => {
    if (selectedSede) {
      return "Distribución de alertas por baño en la sede seleccionada";
    }
    return "Distribución de alertas por sede";
  };

  const eventosPorDia = getEventsByDay();
  const alertasPorTipo = getAlertasByTipo();
  const usoPorGenero = getUsoByGenero();
  const flujoPersonas = getFlujoPersonas();
  const sedesOBanosAlertasData = getSedesOBanosAlertasData();
  const { totalIngresos, totalAlertas } = getFilteredStats();

  const selectedCliente = clientes.find(c => c.id === selectedClientId);
  const hasActiveFilters = selectedSede || fechaInicio || fechaFin;

  if (isLoadingClientes) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header con selector de cliente y botón de filtros */}
      <div className="">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard de Métricas</h1>
            <p className="text-gray-600 mt-1">
              Visualiza estadísticas y métricas de los baños
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative min-w-[200px]">
              <select
                value={selectedClientId}
                onChange={handleClientChange}
                className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 cursor-pointer"
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <button
              ref={buttonRef}
              onClick={() => setFiltrosModalOpen(!filtrosModalOpen)}
              disabled={!selectedClientId}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter size={16} />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {selectedClientId && selectedCliente && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-500">Cliente seleccionado:</span>
              <span className="font-semibold text-purple-600">{selectedCliente.name}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">NIT: {selectedCliente.nit}</span>
              {selectedSede && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">Sede:</span>
                  <span className="font-semibold text-cyan-600">{selectedSede}</span>
                </>
              )}
              {(fechaInicio || fechaFin) && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">Período:</span>
                  <span className="font-semibold text-green-600">
                    {fechaInicio || "Inicio"} - {fechaFin || "Fin"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de filtros flotante - al lado del botón */}
      {filtrosModalOpen && (
        <div 
          ref={modalRef}
          className="fixed z-50 bg-white rounded-xl shadow-2xl w-80 overflow-hidden"
          style={{
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 'auto',
            right: buttonRef.current ? window.innerWidth - buttonRef.current.getBoundingClientRect().right : 'auto'
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Filtros</h3>
            </div>
            <button
              onClick={() => setFiltrosModalOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {sedesList.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sede</label>
                <div className="relative">
                  <select
                    value={selectedSede}
                    onChange={(e) => setSelectedSede(e.target.value)}
                    className="appearance-none w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 cursor-pointer text-sm"
                  >
                    <option value="">Todas las sedes</option>
                    {sedesList.map((sede) => (
                      <option key={sede} value={sede}>{sede}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleResetFilters}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 text-sm"
            >
              <RefreshCw size={14} />
              Limpiar
            </button>
            <button
              onClick={handleFilterApply}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
            >
              <Filter size={14} />
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sedes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {selectedSede ? 1 : (metrics?.resumen_infraestructura?.total_sedes || 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Building2 size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Niveles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {metrics?.resumen_infraestructura?.total_levels || 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Baños</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {metrics?.resumen_infraestructura?.total_bathrooms || 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Droplets size={20} className="text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {totalIngresos}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alertas</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {totalAlertas}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      {!selectedClientId ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un cliente</h3>
          <p className="text-gray-500">Selecciona un cliente de la lista para ver sus métricas</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando métricas...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: ÁREA - Flujo de personas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Flujo de Personas</h3>
                <p className="text-sm text-gray-500">
                  {selectedSede ? `Sede: ${selectedSede}` : 'Ingresos diarios'}
                  {fechaInicio && fechaFin && ` (${fechaInicio} al ${fechaFin})`}
                </p>
              </div>
              <AreaChartIcon size={20} className="text-gray-400" />
            </div>
            {flujoPersonas.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay datos de ingresos para el período seleccionado
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={flujoPersonas}>
                  <defs>
                    <linearGradient id="colorPersonas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: any) => [`${value} personas`, 'Ingresos']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="personas"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#colorPersonas)"
                    name="Personas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico 2: BARRAS VERTICALES - Alertas por Sede o por Baño */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getChartTitle()}</h3>
                <p className="text-sm text-gray-500">{getChartSubtitle()}</p>
              </div>
              <AlertTriangle size={20} className="text-gray-400" />
            </div>
            {sedesOBanosAlertasData.length === 0 || sedesOBanosAlertasData.every(s => s.sinPapel === 0 && s.sucio === 0 && s.malOlor === 0 && s.sinJabon === 0) ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay alertas registradas
                {selectedSede && ` para la sede "${selectedSede}"`}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={sedesOBanosAlertasData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} alertas`, name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  {ALERTAS_ORDER.map((alerta) => (
                    <Bar 
                      key={alerta.key}
                      dataKey={alerta.key} 
                      stackId="a" 
                      fill={alerta.color} 
                      name={alerta.name}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico 3: Línea - Eventos por Día */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eventos por Día</h3>
                <p className="text-sm text-gray-500">
                  {selectedSede ? `Sede: ${selectedSede}` : 'Ingresos vs Alertas'}
                </p>
              </div>
              <LineChartIcon size={20} className="text-gray-400" />
            </div>
            {eventosPorDia.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay eventos registrados
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Ingresos"
                  />
                  <Line
                    type="monotone"
                    dataKey="alertas"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Alertas"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico 4: Pastel - Uso por Género */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Uso por Género</h3>
                <p className="text-sm text-gray-500">
                  Distribución de ingresos
                </p>
              </div>
              <PieChartIcon size={20} className="text-gray-400" />
            </div>
            {usoPorGenero.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay datos de género
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usoPorGenero}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8b5cf6"
                    dataKey="value"
                    nameKey="name"
                  >
                    {usoPorGenero.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} ingresos`, 'Total']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico 5: Barras - Alertas por Tipo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Alertas por Tipo</h3>
                <p className="text-sm text-gray-500">
                  Distribución de tipos de alertas
                </p>
              </div>
              <AlertTriangle size={20} className="text-gray-400" />
            </div>
            {alertasPorTipo.length === 0 || alertasPorTipo.every(a => a.cantidad === 0) ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay alertas registradas
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={alertasPorTipo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: any) => [`${value} alertas`, 'Cantidad']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="cantidad" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Alertas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}