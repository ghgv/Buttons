import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";


function BackButton() {
  const navigate = useNavigate();

  return (
     <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>
  )
}

export default BackButton