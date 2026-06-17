// components/dashboard/DashboardFilters.tsx
import { X,  Filter, RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

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
  onReset,
  onApply,
}: DashboardFiltersProps) => {
  // ✅ Manejar toggle de sede
  const handleSedeToggle = (sede: string) => {
    if (selectedSedes.includes(sede)) {
      onSedesChange(selectedSedes.filter(s => s !== sede));
    } else {
      onSedesChange([...selectedSedes, sede]);
    }
  };

  // ✅ Seleccionar todas las sedes
  const handleSelectAll = () => {
    if (selectedSedes.length === sedesList.length) {
      onSedesChange([]);
    } else {
      onSedesChange([...sedesList]);
    }
  };

  // ✅ Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // ✅ Prevenir scroll del body cuando el modal está abierto
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


  // ✅ Overlay con blur pero sin oscurecer
  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con blur suave - no oscurece */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-white/10 backdrop-blur-[2px]"
          />

          {/* Modal lateral */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[480px] md:w-[560px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Filter size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                  {selectedSedes.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {selectedSedes.length} sedes seleccionadas
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar filtros"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Sedes */}
              {sedesList.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Sedes
                    </label>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      {selectedSedes.length === sedesList.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {sedesList.map((sede) => {
                      const isChecked = selectedSedes.includes(sede);
                      return (
                        <label
                          key={sede}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-purple-50 border border-purple-200' 
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSedeToggle(sede)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isChecked 
                              ? 'bg-purple-600 border-purple-600' 
                              : 'border-gray-300'
                          }`}>
                            {isChecked && <Check size={12} className="text-white" />}
                          </div>
                          <span className={`text-sm ${isChecked ? 'text-purple-700 font-medium' : 'text-gray-700'}`}>
                            {sede}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fechas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => onFechaInicioChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => onFechaFinChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-gray-700 text-sm"
                  />
                </div>
              </div>

              {/* Resumen de filtros activos */}
              {(selectedSedes.length > 0 || fechaInicio || fechaFin) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Filtros activos:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSedes.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {selectedSedes.length} sedes
                      </span>
                    )}
                    {fechaInicio && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Desde: {fechaInicio}
                      </span>
                    )}
                    {fechaFin && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Hasta: {fechaFin}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 text-sm"
              >
                <RefreshCw size={16} />
                Limpiar filtros
              </button>
              <button
                onClick={() => {
                  onApply();
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
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