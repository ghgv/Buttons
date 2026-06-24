// pages/dashboard/Alertas.tsx
import AlertasPanel from "../../components/dashboard/AlertasPanel";

export default function Alertas() {
  return (
    <div className=" max-w-7xl mx-auto">

      <div className="mb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alertas</h1>
        <p className="text-gray-600 mt-1">
          Monitoreo de incidentes en tiempo real
        </p>
      </div>

      <AlertasPanel />
    </div>
  );
}