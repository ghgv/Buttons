// components/banos/AsignarBotoneraModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Hash } from "lucide-react";
import { createBotoneraSchema, type CreateBotoneraRequest } from "../../schemas/botonera.schema";

interface AsignarBotoneraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateBotoneraRequest) => void;
  bathroomId: string;
  bathroomName: string;
  isPending?: boolean;
}

export default function AsignarBotoneraModal({ 
  isOpen, onClose, onCreate, bathroomId, bathroomName, isPending = false 
}: AsignarBotoneraModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBotoneraRequest>({
    resolver: zodResolver(createBotoneraSchema),
    defaultValues: { serie: "", bathroom_id: bathroomId },
  });

  const onSubmit = (data: CreateBotoneraRequest) => {
    onCreate(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Asignar Botonera</h2>
            <p className="text-sm text-gray-500">Baño: <span className="font-semibold text-purple-600">{bathroomName}</span></p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <input type="hidden" {...register("bathroom_id")} value={bathroomId} />
          
          <div>
            <label className="block text-sm font-medium mb-1">Número de Serie *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Ej: BTN-001" className={`w-full pl-10 pr-3 py-2 border rounded-xl ${errors.serie ? "border-red-500" : "border-gray-200"}`} {...register("serie")} />
            </div>
            {errors.serie && <p className="text-red-500 text-xs mt-1">{errors.serie.message}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-xl">Cancelar</button>
            <button type="submit" disabled={isPending} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl">{isPending ? "Asignando..." : "Asignar Botonera"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}