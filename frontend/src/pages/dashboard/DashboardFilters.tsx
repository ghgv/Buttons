// components/dashboard/DashboardFilters.tsx
import { X, Filter, RefreshCw, Check, Calendar, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface DashboardFiltersProps {
  isOpen: boolean;
  selectedSedes: string[];
  fechaInicio: string;
  fechaFin: string;
  sedesList: string[];
  onClose: () => void;
  onSedesChange: (sedes: string[]) => void;
  onFechaInicioChange: (value: string) => void;
  onFechaFinChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const DashboardFilters = ({
  isOpen,
  selectedSedes,
  fechaInicio,
  fechaFin,
  sedesList,
  onClose,
  onSedesChange,
  onFechaInicioChange,
  onFechaFinChange,
  onApply,
}: DashboardFiltersProps) => {
  // Estado local para filtros temporales
  const [tempSelectedSedes, setTempSelectedSedes] = useState<string[]>(selectedSedes);
  const [tempFechaInicio, setTempFechaInicio] = useState<string>(fechaInicio);
  const [tempFechaFin, setTempFechaFin] = useState<string>(fechaFin);

  // Sincronizar estado local cuando se abren los filtros
  useEffect(() => {
    if (isOpen) {
      setTempSelectedSedes(selectedSedes);
      setTempFechaInicio(fechaInicio);
      setTempFechaFin(fechaFin);
    }
  }, [isOpen, selectedSedes, fechaInicio, fechaFin]);

  // Manejar toggle de sede (SOLO TEMPORAL)
  const handleSedeToggle = (sede: string) => {
    if (tempSelectedSedes.includes(sede)) {
      setTempSelectedSedes(tempSelectedSedes.filter(s => s !== sede));
    } else {
      setTempSelectedSedes([...tempSelectedSedes, sede]);
    }
  };

  // Seleccionar todas las sedes (SOLO TEMPORAL)
  const handleSelectAll = () => {
    if (tempSelectedSedes.length === sedesList.length) {
      setTempSelectedSedes([]);
    } else {
      setTempSelectedSedes([...sedesList]);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    onSedesChange(tempSelectedSedes);
    onFechaInicioChange(tempFechaInicio);
    onFechaFinChange(tempFechaFin);
    onApply();
    onClose();
  };

  // Limpiar filtros
  const handleResetAndClose = () => {
    setTempSelectedSedes([...sedesList]);
    setTempFechaInicio("");
    setTempFechaFin("");
    onSedesChange([...sedesList]);
    onFechaInicioChange("");
    onFechaFinChange("");
    onApply();
    onClose();
  };

  // Cerrar sin aplicar cambios
  const handleCloseWithoutApply = () => {
    onClose();
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseWithoutApply();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevenir scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ✅ Variantes corregidas - SIN strings para 'type' y 'ease'
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // ✅ Variantes corregidas - Usando solo propiedades numéricas
  const modalVariants = {
    hidden: { 
      x: "100%", 
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4
      }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { 
        duration: 0.3
      }
    }
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempSelectedSedes.length > 0 && tempSelectedSedes.length < sedesList.length) count++;
    if (tempFechaInicio) count++;
    if (tempFechaFin) count++;
    return count;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con blur */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={handleCloseWithoutApply}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal lateral - 70% de la pantalla */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[70%] lg:w-[70%] xl:w-[70%] 2xl:w-[60%] bg-gradient-to-br from-white to-gray-50/80 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-gray-200/50 flex-shrink-0 bg-gradient-to-r from-purple-50 to-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-200/50">
                  <Filter size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Filtros avanzados</h3>
                  <p className="text-sm text-gray-500">
                    {getActiveFiltersCount() > 0 
                      ? `${getActiveFiltersCount()} filtros activos` 
                      : 'Selecciona los filtros deseados'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWithoutApply}
                className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Cerrar filtros"
              >
                <X size={22} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* ✅ Contenido en 2 columnas */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                
                {/* ✅ Columna 1: Sedes con scroll vertical */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-purple-600" />
                      <label className="text-sm font-semibold text-gray-700">
                        Sedes
                      </label>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {tempSelectedSedes.length}/{sedesList.length}
                      </span>
                    </div>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors hover:underline whitespace-nowrap"
                    >
                      {tempSelectedSedes.length === sedesList.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                    </button>
                  </div>
                  
                  {/* ✅ Scroll vertical para sedes */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                    {sedesList.map((sede) => {
                      const isChecked = tempSelectedSedes.includes(sede);
                      return (
                        <label
                          key={sede}
                          className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                            isChecked 
                              ? 'bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-300 shadow-sm' 
                              : 'hover:bg-gray-100/80 border border-transparent hover:border-gray-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSedeToggle(sede)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isChecked 
                              ? 'bg-purple-600 border-purple-600 shadow-md shadow-purple-200/50' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className={`text-sm truncate ${isChecked ? 'text-purple-700 font-medium' : 'text-gray-600'}`}>
                            {sede}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ✅ Columna 2: Fechas y resumen */}
                <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                  
                  {/* Fechas */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={18} className="text-purple-600" />
                      <label className="text-sm font-semibold text-gray-700">
                        Rango de fechas
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Fecha de inicio
                        </label>
                        <input
                          type="date"
                          value={tempFechaInicio}
                          onChange={(e) => setTempFechaInicio(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Fecha de fin
                        </label>
                        <input
                          type="date"
                          value={tempFechaFin}
                          onChange={(e) => setTempFechaFin(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resumen de filtros activos */}
                  {(tempSelectedSedes.length > 0 || tempFechaInicio || tempFechaFin) && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        Filtros a aplicar
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tempSelectedSedes.length > 0 && tempSelectedSedes.length < sedesList.length && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                            <Building2 size={12} />
                            {tempSelectedSedes.length} sedes
                          </span>
                        )}
                        {tempSelectedSedes.length === sedesList.length && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                            <Building2 size={12} />
                            Todas las sedes
                          </span>
                        )}
                        {tempFechaInicio && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                            <Calendar size={12} />
                            Desde: {new Date(tempFechaInicio).toLocaleDateString()}
                          </span>
                        )}
                        {tempFechaFin && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                            <Calendar size={12} />
                            Hasta: {new Date(tempFechaFin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="flex gap-3 p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
              <button
                onClick={handleResetAndClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm hover:shadow-md"
              >
                <RefreshCw size={16} />
                Limpiar filtros
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50"
              >
                <Filter size={16} />
                Aplicar filtros
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DashboardFilters;