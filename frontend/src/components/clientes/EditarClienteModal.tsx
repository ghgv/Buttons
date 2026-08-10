import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Building2,
  Mail,
  MapPin,
  Hash,
  Loader2,
} from "lucide-react";

import {
  createClienteSchema,
  type CreateClienteRequest,
} from "../../zod/cliente.zod";

import type { ClienteResponse } from "../../types/cliente.types";


interface EditarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteResponse | null;
  onUpdate: (
    id: string,
    data: CreateClienteRequest
  ) => void;
  isPending?: boolean;
}


export default function EditarClienteModal({
  isOpen,
  onClose,
  cliente,
  onUpdate,
  isPending = false,
}: EditarClienteModalProps) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClienteRequest>({
    resolver: zodResolver(createClienteSchema),
  });

  useEffect(() => {
    if (isOpen && cliente) {
      reset({
        nit: String(cliente.nit ?? ""),
        name: cliente.name ?? "",
        email: cliente.email ?? "",
        address: cliente.address ?? "",
      });
    }
  }, [isOpen, cliente, reset]);


  if (!isOpen || !cliente) {
    return null;
  }


  const onSubmit = (
    data: CreateClienteRequest
  ) => {
    onUpdate(
      String(cliente.id),
      data
    );
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Cliente
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Modifica los datos del cliente
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>

        </div>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4"
        >

          {/* NIT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIT *
            </label>

            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                disabled={isPending}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.nit
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("nit")}
              />
            </div>

            {errors.nit && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nit.message}
              </p>
            )}
          </div>


          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre o Razón Social *
            </label>

            <div className="relative">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                disabled={isPending}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("name")}
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>


          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Corporativo
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="email"
                disabled={isPending}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>


          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección Principal
            </label>

            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                disabled={isPending}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.address
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("address")}
              />
            </div>

            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>


          <div className="flex gap-3 pt-4 border-t border-gray-100">

            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 disabled:bg-purple-400"
            >
              {isPending ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}