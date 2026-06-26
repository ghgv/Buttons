// components/nubeware/CrearNubewareClienteModal.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Building2, Mail, MapPin, Hash, Phone, Loader2 } from "lucide-react";
import { createNubewareClienteSchema, type CreateNubewareClienteRequest } from "../../zod/nubewareCliente.zod";

interface CrearNubewareClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateNubewareClienteRequest) => void;
  isPending?: boolean;
}

export default function CrearNubewareClienteModal({ 
  isOpen, 
  onClose, 
  onCreate,
  isPending = false 
}: CrearNubewareClienteModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNubewareClienteRequest>({
    resolver: zodResolver(createNubewareClienteSchema),
    defaultValues: {
      nit: 0,
      name: "",
      email: "",
      phone_number: "",
      address: "",
    },
  });

  // Resetear formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateNubewareClienteRequest) => {
    onCreate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nuevo Cliente Nubeware</h2>
            <p className="text-sm text-gray-500 mt-1">Ingresa los datos del cliente</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Campo NIT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIT *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                disabled={isPending}
                placeholder="901234567"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm
                  ${errors.nit ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                {...register("nit", { valueAsNumber: true })}
              />
            </div>
            {errors.nit && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.nit.message}</p>
            )}
          </div>

          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre o Razón Social *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Nombre de la empresa"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm
                  ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Corporativo *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                disabled={isPending}
                placeholder="contacto@empresa.com"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm
                  ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="+56 9 1234 5678"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm"
                {...register("phone_number")}
              />
            </div>
          </div>

          {/* Campo Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Calle 123 # 45 - 67"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm"
                {...register("address")}
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Cliente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}