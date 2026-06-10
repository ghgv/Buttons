// components/banos/AsignarBotoneraModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Hash } from "lucide-react";
import { useEffect } from "react";
import { createBotoneraSchema, type CreateBotoneraRequest } from "../../schemas/botonera.schema";

interface AsignarBotoneraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateBotoneraRequest) => void;
  bathroomId: number;
  bathroomName: string;
  isPending?: boolean;
}

export default function AsignarBotoneraModal({ 
  isOpen, onClose, onCreate, bathroomId, bathroomName, isPending = false 
}: AsignarBotoneraModalProps) {

  console.log("🟣 AsignarBotoneraModal - MODAL RENDERIZADO");
  console.log("🟣 bathroomId recibido:", bathroomId);
  console.log("🟣 bathroomName recibido:", bathroomName);
  console.log("🟣 isPending:", isPending);
  console.log("🟣 isOpen:", isOpen);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<CreateBotoneraRequest>({
    resolver: zodResolver(createBotoneraSchema),
    defaultValues: { 
      serie: "", 
      bathroom_id: bathroomId 
    },
  });

  // Actualizar el formulario cuando cambia bathroomId
  useEffect(() => {
    if (bathroomId) {
      console.log("🔄 useEffect - Actualizando bathroom_id en el formulario:", bathroomId);
      setValue("bathroom_id", bathroomId);
    }
  }, [bathroomId, setValue]);

  const onSubmit = (data: CreateBotoneraRequest) => {
    console.log("🎯 SUBMIT EJECUTADO");
    console.log("📝 Datos del formulario:", data);
    console.log("📝 serie:", data.serie);
    console.log("📝 bathroom_id:", data.bathroom_id);
    console.log("📝 Tipo de bathroom_id:", typeof data.bathroom_id);
    
    // Verificar si los datos son válidos
    if (!data.serie) {
      console.error("❌ Error: La serie está vacía");
      return;
    }
    
    if (!data.bathroom_id) {
      console.error("❌ Error: bathroom_id está vacío");
      return;
    }
    
    console.log("✅ Datos válidos, llamando a onCreate");
    onCreate(data);
    console.log("✅ onCreate llamado, reseteando formulario y cerrando modal");
    reset();
    onClose();
  };

  const onError = (errors: any) => {
    console.log("❌ ERRORES DE VALIDACIÓN:", errors);
  };

  const handleClose = () => {
    console.log("❌ Cerrando modal manualmente");
    reset();
    onClose();
  };

  

  if (!isOpen) {
    console.log("🚪 Modal cerrado, no renderizando contenido");
    return null;
  }

  console.log("✅ Modal abierto, renderizando formulario");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Asignar Botonera</h2>
            <p className="text-sm text-gray-500">
              Baño: <span className="font-semibold text-purple-600">{bathroomName}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ID del baño: {bathroomId}
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-gray-100 rounded-lg"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4">
          {/* Campo visible para debug */}
          <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
            Baño ID: {bathroomId}
          </div>
          
          <input 
            type="hidden" 
            {...register("bathroom_id")} 
            value={bathroomId}
          />
          
          <div>
            <label className="block text-sm font-medium mb-1">Número de Serie *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Ej: BTN-001" 
                className={`w-full pl-10 pr-3 py-2 border rounded-xl ${errors.serie ? "border-red-500" : "border-gray-200"}`} 
                {...register("serie")}
                onChange={(e) => console.log("📝 Serie cambiada:", e.target.value)}
              />
            </div>
            {errors.serie && <p className="text-red-500 text-xs mt-1">{errors.serie.message}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={handleClose} 
              className="flex-1 px-4 py-2 border rounded-xl"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending} 
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Asignando..." : "Asignar Botonera"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}