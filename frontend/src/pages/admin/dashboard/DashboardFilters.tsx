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

  // Manejar toggle de sede
  const handleSedeToggle = (sede: string) => {
    if (tempSelectedSedes.includes(sede)) {
      setTempSelectedSedes(tempSelectedSedes.filter(s => s !== sede));
    } else {
      setTempSelectedSedes([...tempSelectedSedes, sede]);
    }
  };

  // Seleccionar todas las sedes
  const handleSelectAll = () => {
    if (tempSelectedSedes.length === sedesList.length) {
      setTempSelectedSedes([]);
    } else {
      setTempSelectedSedes([...sedesList]);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    console.log("✅ Aplicando filtros:", {
      sedes: tempSelectedSedes,
      fechaInicio: tempFechaInicio,
      fechaFin: tempFechaFin
    });
    onSedesChange(tempSelectedSedes);
    onFechaInicioChange(tempFechaInicio);
    onFechaFinChange(tempFechaFin);
    onApply();
    onClose();
  };

  // Limpiar filtros
  const handleResetAndClose = () => {
    console.log("🔄 Limpiando filtros");
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
    console.log("❌ Cerrando filtros sin aplicar");
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

  // ✅ Variantes corregidas - SIN strings en ease
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // ✅ Variantes corregidas - Usando solo duración, sin ease
  const modalVariants = {
    hidden: { 
      x: "100%", 
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3
      }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { 
        duration: 0.25
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
          {/* Overlay transparente - SOLO para cerrar al hacer clic fuera, SIN oscurecer */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={handleCloseWithoutApply}
            className="fixed inset-0 z-40"
          />

          {/* Modal lateral */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[50%] md:w-[45%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 border-b border-gray-200/50 flex-shrink-0 bg-gradient-to-r from-purple-50 to-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg shadow-purple-200/50">
                  <Filter size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Filtros</h3>
                  <p className="text-xs text-gray-500">
                    {getActiveFiltersCount() > 0 
                      ? `${getActiveFiltersCount()} filtros activos` 
                      : 'Selecciona los filtros'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWithoutApply}
                className="p-1.5 hover:bg-white/80 rounded-lg transition-all duration-200"
                aria-label="Cerrar filtros"
              >
                <X size={18} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Contenido - CON MÁS ESPACIO PARA SEDES */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Área de sedes - CON MÁS ESPACIO */}
              <div className="flex-1 p-4 pb-2 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-purple-600" />
                    <label className="text-sm font-semibold text-gray-700">
                      Sedes
                    </label>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {tempSelectedSedes.length}/{sedesList.length}
                    </span>
                  </div>
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors hover:underline"
                  >
                    {tempSelectedSedes.length === sedesList.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                </div>
                
                {/* Scroll vertical para sedes - MÁS ESPACIO */}
                <div className="h-[calc(100%-32px)] overflow-y-auto pr-2 space-y-1 rounded-lg border border-gray-100 p-1.5 custom-scrollbar">
                  {sedesList.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No hay sedes disponibles</p>
                  ) : (
                    sedesList.map((sede) => {
                      const isChecked = tempSelectedSedes.includes(sede);
                      return (
                        <label
                          key={sede}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSedeToggle(sede)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isChecked 
                              ? 'bg-purple-600 border-purple-600' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isChecked && <Check size={10} className="text-white" />}
                          </div>
                          <span className={`text-sm truncate ${isChecked ? 'text-gray-600 font-semibold' : 'text-gray-600 '}`}>
                            {sede}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Área de fechas y botones - PEGADA ABAJO */}
              <div className="flex-shrink-0 border-t border-gray-200/50 bg-white/50">
                {/* Fechas */}
                <div className="p-4 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={15} className="text-purple-600" />
                    <label className="text-sm font-semibold text-gray-700">
                      Rango de fechas
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Fecha inicio
                      </label>
                      <input
                        type="date"
                        value={tempFechaInicio}
                        onChange={(e) => {
                          console.log("📅 Fecha inicio seleccionada:", e.target.value);
                          setTempFechaInicio(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Fecha fin
                      </label>
                      <input
                        type="date"
                        value={tempFechaFin}
                        onChange={(e) => {
                          console.log("📅 Fecha fin seleccionada:", e.target.value);
                          setTempFechaFin(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Resumen de filtros activos */}
                  {(tempSelectedSedes.length > 0 || tempFechaInicio || tempFechaFin) && (
                    <div className="mt-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg p-2.5 border border-gray-200/50">
                      <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                        Filtros a aplicar
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {tempSelectedSedes.length > 0 && tempSelectedSedes.length < sedesList.length && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                            <Building2 size={10} />
                            {tempSelectedSedes.length} sedes
                          </span>
                        )}
                        {tempSelectedSedes.length === sedesList.length && sedesList.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                            <Building2 size={10} />
                            Todas
                          </span>
                        )}
                        {tempFechaInicio && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                            <Calendar size={10} />
                            Desde: {new Date(tempFechaInicio).toLocaleDateString()}
                          </span>
                        )}
                        {tempFechaFin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                            <Calendar size={10} />
                            Hasta: {new Date(tempFechaFin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones - PEGADOS ABAJO */}
                <div className="flex gap-2 p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                  <button
                    onClick={handleResetAndClose}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200 text-sm hover:shadow-md"
                  >
                    <RefreshCw size={14} />
                    Limpiar
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50"
                  >
                    <Filter size={14} />
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DashboardFilters;