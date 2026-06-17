// components/banos/AsignarContadorModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Hash } from "lucide-react";
import { useEffect } from "react";
import { createContadorSchema, type CreateContadorRequest } from "../../zod/contador.zod";

interface AsignarContadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateContadorRequest) => void;
  bathroomId: number | null;
  bathroomName: string;
  isPending?: boolean;
}

export default function AsignarContadorModal({ 
  isOpen, onClose, onCreate, bathroomId, bathroomName, isPending = false 
}: AsignarContadorModalProps) {
  


  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateContadorRequest>({
    resolver: zodResolver(createContadorSchema),
    defaultValues: { 
      serie: "", 
      bathroom_id: bathroomId || 0 
    },
  });

  useEffect(() => {
    if (bathroomId) {
      console.log("✅ Actualizando bathroom_id en el formulario:", bathroomId);
      setValue("bathroom_id", bathroomId);
    }
  }, [bathroomId, setValue]);

  const onSubmit = (data: CreateContadorRequest) => {
    console.log("🎯 SUBMIT EJECUTADO");
    console.log("📤 Enviando datos del contador:", data);
    onCreate(data);
    reset();
    onClose();
  };

  const onError = (errors: any) => {
    console.log("❌ ERRORES DE VALIDACIÓN:", errors);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Asignar Contador</h2>
            <p className="text-sm text-gray-500">
              Baño: <span className="font-semibold text-purple-600">{bathroomName}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ID del baño: {bathroomId}
            </p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4">
          <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
            Baño ID: {bathroomId}
          </div>
          
          <input type="hidden" {...register("bathroom_id")} value={bathroomId || 0} />
          
          <div>
            <label className="block text-sm font-medium mb-1">Número de Serie *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Ej: CTR-001" 
                className={`w-full pl-10 pr-3 py-2 border rounded-xl ${errors.serie ? "border-red-500" : "border-gray-200"}`} 
                {...register("serie")} 
              />
            </div>
            {errors.serie && <p className="text-red-500 text-xs mt-1">{errors.serie.message}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-2 border rounded-xl">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending || !bathroomId} 
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Asignando..." : "Asignar Contador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}