// pages/dashboard/Dashboard.tsx
import { useState, useMemo } from "react";
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
  Calendar,
  RefreshCw,
  Activity,
  ChevronDown,
  Filter,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  AlertTriangle,
  MapPin
} from "lucide-react";
import { useGetClientes } from "../../hooks/useCliente";

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  const { data: metrics, isLoading, error, refetch } = useGetDashboardMetrics(
    selectedClientId ? parseInt(selectedClientId) : null
  );

  // Obtener lista única de sedes de los eventos
  const sedesList = useMemo(() => {
    if (!metrics?.eventos) return [];
    const sedes = new Set<string>();
    metrics.eventos.forEach((evento: any) => {
      if (evento.sede) {
        sedes.add(evento.sede);
      }
    });
    return Array.from(sedes);
  }, [metrics?.eventos]);

  // Filtrar eventos por sede seleccionada
  const filteredEventos = useMemo(() => {
    if (!metrics?.eventos) return [];
    if (!selectedSede) return metrics.eventos;
    return metrics.eventos.filter((evento: any) => evento.sede === selectedSede);
  }, [metrics?.eventos, selectedSede]);

  // ✅ Calcular niveles y baños únicos de los eventos filtrados
  const getFilteredInfraestructura = useMemo(() => {
    if (!filteredEventos.length) {
      return { uniqueNiveles: 0, uniqueBanios: 0 };
    }
    
    const nivelesSet = new Set<string>();
    const baniosSet = new Set<string>();
    
    filteredEventos.forEach((evento: any) => {
      if (evento.nivel) {
        nivelesSet.add(evento.nivel);
      }
      // Usar una combinación de sede+nivel+genero para identificar baños únicos
      if (evento.sede && evento.nivel && evento.genero_bano) {
        const banoKey = `${evento.sede}-${evento.nivel}-${evento.genero_bano}`;
        baniosSet.add(banoKey);
      }
    });
    
    return {
      uniqueNiveles: nivelesSet.size,
      uniqueBanios: baniosSet.size
    };
  }, [filteredEventos]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(e.target.value);
    setSelectedSede(""); // Resetear sede al cambiar cliente
  };

  const handleFilterApply = () => {
    if (selectedClientId) {
      refetch();
    }
  };

  // Procesar datos para gráfico de eventos por día (Línea)
  const getEventsByDay = () => {
    if (!filteredEventos.length) return [];

    const eventsByDay: { [key: string]: { ingresos: number; alertas: number } } = {};

    filteredEventos.forEach((evento: any) => {
      const date = new Date(evento.fecha_hora).toLocaleDateString();
      if (!eventsByDay[date]) {
        eventsByDay[date] = { ingresos: 0, alertas: 0 };
      }
      if (evento.tipo_evento === 'ingreso') {
        eventsByDay[date].ingresos += evento.valor;
      } else {
        eventsByDay[date].alertas += 1;
      }
    });

    return Object.entries(eventsByDay).map(([fecha, data]) => ({
      name: fecha,
      ingresos: data.ingresos,
      alertas: data.alertas
    })).slice(-7);
  };

  // Procesar datos para gráfico de BOTONERAS (Alertas por tipo)
  const getAlertasByTipo = () => {
    if (!filteredEventos.length) return [];

    const alertasByTipo: { [key: string]: number } = {};

    filteredEventos.forEach((evento: any) => {
      if (evento.tipo_evento === 'alerta') {
        const tipo = evento.detalle_evento;
        alertasByTipo[tipo] = (alertasByTipo[tipo] || 0) + 1;
      }
    });

    const tipoMap: { [key: string]: string } = {
      'Baño sin papel': '🧻 Sin Papel',
      'Baño sucio': '🧹 Sucio',
      'mal olor': '👃 Mal Olor',
      'Baño sin jabon': '🧼 Sin Jabón'
    };

    return Object.entries(alertasByTipo).map(([tipo, cantidad]) => ({
      name: tipoMap[tipo] || tipo,
      cantidad
    }));
  };

  // Procesar datos para gráfico de uso por género (Pastel)
  const getUsoByGenero = () => {
    if (!filteredEventos.length) return [];

    const usoByGenero: { [key: string]: number } = {};

    filteredEventos.forEach((evento: any) => {
      if (evento.tipo_evento === 'ingreso') {
        const genero = evento.genero_bano === 'men' ? 'Hombres' :
                      evento.genero_bano === 'women' ? 'Mujeres' :
                      evento.genero_bano === 'mixed' ? 'Mixto' : 'Discapacitados';
        usoByGenero[genero] = (usoByGenero[genero] || 0) + evento.valor;
      }
    });

    return Object.entries(usoByGenero).map(([genero, total]) => ({
      name: genero,
      value: total
    }));
  };

  // Procesar datos para gráfico de ÁREA (Flujo de personas)
  const getFlujoPersonas = () => {
    if (!filteredEventos.length) return [];

    const ingresosByDay: { [key: string]: number } = {};

    filteredEventos.forEach((evento: any) => {
      if (evento.tipo_evento === 'ingreso') {
        const date = new Date(evento.fecha_hora).toLocaleDateString();
        ingresosByDay[date] = (ingresosByDay[date] || 0) + evento.valor;
      }
    });

    return Object.entries(ingresosByDay).map(([fecha, total]) => ({
      name: fecha,
      personas: total
    })).slice(-7);
  };

  // Calcular estadísticas filtradas
  const getFilteredStats = () => {
    if (!filteredEventos.length) {
      return { totalIngresos: 0, totalAlertas: 0 };
    }
    
    let totalIngresos = 0;
    let totalAlertas = 0;
    
    filteredEventos.forEach((evento: any) => {
      if (evento.tipo_evento === 'ingreso') {
        totalIngresos += evento.valor;
      } else {
        totalAlertas += 1;
      }
    });
    
    return { totalIngresos, totalAlertas };
  };

  const eventosPorDia = getEventsByDay();
  const alertasPorTipo = getAlertasByTipo();
  const usoPorGenero = getUsoByGenero();
  const flujoPersonas = getFlujoPersonas();
  const { totalIngresos, totalAlertas } = getFilteredStats();

  const selectedCliente = clientes.find(c => c.id === selectedClientId);

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
    <div className="space-y-6 p-4 md:p-8">
      {/* Header con selector de cliente */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
                    {cliente.name} - {cliente.nit}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* Filtro por Sede */}
            {selectedClientId && sedesList.length > 0 && (
              <div className="relative min-w-[180px]">
                <select
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                  className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 cursor-pointer"
                >
                  <option value="">Todas las sedes</option>
                  {sedesList.map((sede) => (
                    <option key={sede} value={sede}>
                      {sede}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            )}

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm"
              />
            </div>

            <button
              onClick={handleFilterApply}
              disabled={!selectedClientId}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter size={16} />
              Aplicar filtros
            </button>
          </div>
        </div>

        {selectedClientId && selectedCliente && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
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
            </div>
          </div>
        )}
      </div>

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

        {/* ✅ Card de Total Niveles - Ahora se actualiza con el filtro */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Niveles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {selectedSede ? getFilteredInfraestructura.uniqueNiveles : (metrics?.resumen_infraestructura?.total_levels || 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* ✅ Card de Total Baños - Ahora se actualiza con el filtro */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Baños</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {selectedSede ? getFilteredInfraestructura.uniqueBanios : (metrics?.resumen_infraestructura?.total_bathrooms || 0)}
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
                  {selectedSede ? `Sede: ${selectedSede}` : 'Ingresos diarios - Todas las sedes'}
                </p>
              </div>
              <AreaChartIcon size={20} className="text-gray-400" />
            </div>
            {flujoPersonas.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay datos de ingresos
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

          {/* Gráfico 2: BARRAS - Botoneras (Alertas) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Alertas de Botoneras</h3>
                <p className="text-sm text-gray-500">
                  {selectedSede ? `Sede: ${selectedSede}` : 'Reportes de los botones en los baños'}
                </p>
              </div>
              <AlertTriangle size={20} className="text-gray-400" />
            </div>
            {alertasPorTipo.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                No hay alertas registradas
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={alertasPorTipo} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" width={100} stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: any) => [`${value} alertas`, 'Cantidad']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderColor: '#e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="cantidad" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Alertas" />
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
                  {selectedSede ? `Sede: ${selectedSede}` : 'Comparativa de ingresos y alertas'}
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
                  {selectedSede ? `Sede: ${selectedSede}` : 'Distribución de ingresos por género'}
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
        </div>
      )}
    </div>
  );
}