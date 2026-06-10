

interface LoadingProps {
  text?: string;
}


function Loading({ text }: LoadingProps) {
  return (
     <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">{text || "Cargando datos..."}</p>
        </div>
      </div>
  )
}

export default Loading