// components/clientes/CrearClienteModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Building2, Mail, MapPin, Hash } from "lucide-react";
import { createClienteSchema, type CreateClienteRequest } from "../../../schemas/cliente.schema";

interface CrearClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateClienteRequest) => void;
  isPending?: boolean;
}

export default function CrearClienteModal({ 
  isOpen, 
  onClose, 
  onCreate,
  isPending = false 
}: CrearClienteModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClienteRequest>({
    resolver: zodResolver(createClienteSchema),
    defaultValues: {
      nit: "",
      name: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = (data: CreateClienteRequest) => {
    onCreate(data); // Envía JSON puro al padre
    reset(); // Limpia el formulario
  };

  const handleClose = () => {
    reset(); // Limpia el formulario al cerrar
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nuevo Cliente</h2>
            <p className="text-sm text-gray-500 mt-1">Ingresa los datos del cliente</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
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
                type="text"
                disabled={isPending}
                placeholder="901234567"
                className={`
                  w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.nit ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                `}
                {...register("nit")}
              />
            </div>
            {errors.nit && (
              <p className="text-red-500 text-xs mt-1">{errors.nit.message}</p>
            )}
          </div>

          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                disabled={isPending}
                placeholder="Nombre de la empresa"
                className={`
                  w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                `}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                disabled={isPending}
                placeholder="contacto@empresa.com"
                className={`
                  w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                `}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Dirección */}
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
                className={`
                  w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                `}
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}