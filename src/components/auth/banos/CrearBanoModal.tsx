// components/auth/banos/CrearBanoModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Droplets, Users, Tag, Home } from "lucide-react";
import { createBanoSchema, type CreateBanoRequest } from "../../../schemas/bano.schema";

interface CrearBanoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateBanoRequest) => void;
  nivelId: string;
  nivelName: string;
  isPending?: boolean;
}

export default function CrearBanoModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  nivelId, 
  nivelName, 
  isPending = false 
}: CrearBanoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBanoRequest>({
    resolver: zodResolver(createBanoSchema),
    defaultValues: {
      nivel_id: nivelId,
      name: "",
      tipo: "MIXTO",
      capacidad: 1,
    },
  });

  const onSubmit = (data: CreateBanoRequest) => {
    console.log("📝 Datos del baño a crear:", data);
    onCreate(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nuevo Baño</h2>
            <p className="text-sm text-gray-500 mt-1">
              Nivel: <span className="font-semibold text-purple-600">{nivelName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Campo oculto nivel_id */}
          <input type="hidden" {...register("nivel_id")} value={nivelId} />

          {/* Mostrar información del nivel */}
          <div className="bg-purple-50 p-3 rounded-xl flex items-center gap-3">
            <Home size={18} className="text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Creando baño para</p>
              <p className="text-sm font-medium text-purple-700">{nivelName}</p>
            </div>
          </div>

          {/* Campo Nombre del Baño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Baño *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Ej: Baño Principal, Baño Ejecutivos, Baño Público"
                className={`
                  w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed transition-all
                  ${errors.name ? "border-red-500 bg-red-50" : "border-gray-200"}
                `}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Tipo de Baño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Baño *
            </label>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                disabled={isPending}
                className={`
                  w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed transition-all appearance-none
                  ${errors.tipo ? "border-red-500 bg-red-50" : "border-gray-200"}
                `}
                {...register("tipo")}
              >
                <option value="HOMBRES">🚹 Hombres</option>
                <option value="MUJERES">🚺 Mujeres</option>
                <option value="MIXTO">👥 Mixto</option>
                <option value="PCD">♿ PCD (Discapacitados)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.tipo && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.tipo.message}</p>
            )}
          </div>

          {/* Campo Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad (número de personas) *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                disabled={isPending}
                min="1"
                step="1"
                placeholder="Ej: 5, 10, 20"
                className={`
                  w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed transition-all
                  ${errors.capacidad ? "border-red-500 bg-red-50" : "border-gray-200"}
                `}
                {...register("capacidad", { valueAsNumber: true })}
              />
            </div>
            {errors.capacidad && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.capacidad.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </span>
              ) : (
                "Crear Baño"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}