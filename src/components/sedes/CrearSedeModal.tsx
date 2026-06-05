// components/sedes/CrearSedeModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Building2, MapPin } from "lucide-react";
import { useEffect } from "react";
import { createSedeSchema, type CreateSedeRequest } from "../../schemas/sede.schema";

interface CrearSedeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateSedeRequest) => void;
  clientId: string | number; // ← Acepta ambos
  clientName: string;
  isPending?: boolean;
}

export default function CrearSedeModal({ 
  isOpen, 
  onClose, 
  onCreate,
  clientId,
  clientName,
  isPending = false 
}: CrearSedeModalProps) {
  
  // ✅ Convertir a string para el formulario
  const clientIdString = String(clientId);
  
 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSedeRequest>({
    resolver: zodResolver(createSedeSchema),
    defaultValues: {
      client_id: clientIdString, // ← Usar string
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    if (isOpen && clientIdString) {
      reset({
        client_id: clientIdString,
        name: "",
        address: "",
      });
    }
  }, [isOpen, clientIdString, reset]);

  const onSubmit = (data: CreateSedeRequest) => {
    console.log("📝 Datos enviados:", data);
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
            <h2 className="text-xl font-bold text-gray-900">Crear Sede</h2>
            <p className="text-sm text-gray-500 mt-1">
              Cliente: <span className="font-semibold text-purple-600">{clientName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Campo oculto con el valor convertido a string */}
          <input type="hidden" {...register("client_id")} value={clientIdString} />

          <div className="bg-purple-50 p-2 rounded text-xs text-purple-700 font-mono">
            🔑 ID Cliente: {clientIdString}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Sede *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Ej: Sede Principal"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${errors.name ? "border-red-500" : "border-gray-300"}`}
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Calle 123, Ciudad"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${errors.address ? "border-red-500" : "border-gray-300"}`}
                {...register("address")}
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
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
              {isPending ? "Creando..." : "Crear Sede"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}