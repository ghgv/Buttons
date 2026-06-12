// components/niveles/CrearNivelModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Building2, Hash } from "lucide-react";
import { useEffect } from "react";
import { createNivelSchema, type CreateNivelTypeSchema } from "../../zod/nivel.zod";

interface CrearNivelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateNivelTypeSchema) => void;
  sedeId: string;
  sedeName: string;
  isPending?: boolean;
}

export default function CrearNivelModal({ 
  isOpen, 
  onClose, 
  onCreate,
  sedeId,
  sedeName,
  isPending = false 
}: CrearNivelModalProps) {
  
  const sedeIdString = String(sedeId);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNivelTypeSchema>({
    resolver: zodResolver(createNivelSchema),
    defaultValues: {
      sede_id: sedeIdString,
      name: "",
      floor: 0,
    },
  });

  useEffect(() => {
    if (isOpen && sedeIdString) {
      reset({
        sede_id: sedeIdString,
        name: "",
        floor: 0,
      });
    }
  }, [isOpen, sedeIdString, reset]);

  const onSubmit = (data: CreateNivelTypeSchema) => {
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Crear Nivel/Piso</h2>
            <p className="text-sm text-gray-500 mt-1">
              Sede: <span className="font-semibold text-purple-600">{sedeName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <input type="hidden" {...register("sede_id")} value={sedeIdString} />

          <div className="bg-purple-50 p-2 rounded text-xs text-purple-700 font-mono">
            🔑 ID Sede: {sedeIdString}
          </div>

          {/* Nombre del Nivel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Nivel *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Ej: Piso Principal, Mezzanine, Terraza"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${errors.name ? "border-red-500" : "border-gray-300"}`}
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Número de Piso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Piso *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                disabled={isPending}
                placeholder="Ej: 1, 2, 3, 0 para sótano"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${errors.floor ? "border-red-500" : "border-gray-300"}`}
                {...register("floor", { valueAsNumber: true })}
              />
            </div>
            {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isPending ? "Creando..." : "Crear Nivel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}