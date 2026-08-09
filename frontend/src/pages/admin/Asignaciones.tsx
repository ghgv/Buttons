import { useState } from "react";
import {
  ClipboardList,
  MapPin,
  UserRound,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";

import {
  useGetAssignmentTechnicians,
  useGetAssignmentBathrooms,
  useGetAssignments,
  useCreateAssignment,
  useRemoveAssignment,

} from "../../hooks/useAssignment";


export default function Asignaciones() {
  const [bathroomId, setBathroomId] = useState<number | "">("");
  const [technicianId, setTechnicianId] = useState<number | "">("");
  

  const {
    data: technicians = [],
    isLoading: loadingTechnicians,
  } = useGetAssignmentTechnicians();

  const {
    data: bathrooms = [],
    isLoading: loadingBathrooms,
  } = useGetAssignmentBathrooms();

  const {
    data: assignments = [],
    isLoading: loadingAssignments,
  } = useGetAssignments();

  const createAssignment = useCreateAssignment();
  const removeAssignment = useRemoveAssignment();
  

  

  const handleAssign = () => {
    if (bathroomId === "" || technicianId === "") {
      return;
    }

    createAssignment.mutate(
      {
        bathroom_id: bathroomId,
        technician_id: technicianId,
      },
      {
        onSuccess: () => {
          setBathroomId("");
          setTechnicianId("");
        },
      }
    );
  };

  const handleRemove = (assignmentId: number) => {
    if (!window.confirm("¿Deseas eliminar esta asignación?")) {
      return;
    }

    removeAssignment.mutate(assignmentId);
  };

  const isLoading =
    loadingTechnicians ||
    loadingBathrooms ||
    loadingAssignments;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-purple-700" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <ClipboardList
              className="text-purple-700"
              size={28}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Asignaciones
            </h1>

            <p className="text-gray-500 mt-1">
              Asigna técnicos a los baños que deben atender.
            </p>
          </div>
        </div>
      </div>

      {/* Nueva asignación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">

      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        Nueva asignación
      </h2>  
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Baño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Baño
            </label>

            <select
              value={bathroomId}
              onChange={(e) =>
                setBathroomId(
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="
                w-full
                border border-gray-300
                rounded-lg
                px-3 py-2.5
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            >
              <option value="">
                Selecciona un baño
              </option>

              {bathrooms.map((bathroom) => (
                <option
                  key={bathroom.id}
                  value={bathroom.id}
                >
                  {bathroom.sede.name}
                  {" / "}
                  {bathroom.level.name}
                  {" / "}
                  {bathroom.name}
                </option>
              ))}
            </select>
          </div>

          {/* Técnico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Técnico
            </label>

            <select
              value={technicianId}
              onChange={(e) =>
                setTechnicianId(
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="
                w-full
                border border-gray-300
                rounded-lg
                px-3 py-2.5
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            >
              <option value="">
                Selecciona un técnico
              </option>

              {technicians.map((technician) => (
                <option
                  key={technician.id}
                  value={technician.id}
                >
                  {technician.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {createAssignment.isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            No fue posible realizar la asignación.
            Verifica que el técnico no esté ya asignado
            a este baño.
          </div>
        )}

        {/* Botón */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAssign}
            disabled={
              bathroomId === "" ||
              technicianId === "" ||
              createAssignment.isPending
            }
            className="
              flex items-center gap-2
              bg-purple-700
              hover:bg-purple-800
              disabled:bg-gray-300
              disabled:cursor-not-allowed
              text-white
              px-5 py-2.5
              rounded-lg
              font-medium
              transition-colors
            "
          >
            {createAssignment.isPending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Plus size={18} />
            )}

            Asignar
          </button>
        </div>
      </div>

      {/* Asignaciones actuales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Asignaciones actuales
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {assignments.length} asignación
            {assignments.length !== 1 ? "es" : ""} activa
            {assignments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {assignments.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            <ClipboardList
              size={40}
              className="mx-auto mb-3 text-gray-300"
            />

            No hay asignaciones activas.
          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {assignments.map((assignment) => (

              <div
                key={assignment.id}
                className="
                  p-5
                  flex flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-4
                  hover:bg-gray-50
                "
              >

                <div className="flex-1">

                  {/* Localización */}
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <MapPin
                      size={18}
                      className="text-purple-600"
                    />

                    {assignment.sede.name}
                    <span className="text-gray-300">/</span>
                    {assignment.level.name}
                    <span className="text-gray-300">/</span>
                    {assignment.bathroom.name}
                  </div>

                  {/* Técnico */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <UserRound
                      size={17}
                      className="text-gray-400"
                    />

                    <span className="font-medium">
                      {assignment.technician.name}
                    </span>

                    <span className="text-gray-400">
                      {assignment.technician.email}
                    </span>
                  </div>

                </div>

                {/* Desasignar */}
                <button
                  onClick={() =>
                    handleRemove(assignment.id)
                  }
                  disabled={removeAssignment.isPending}
                  className="
                    flex items-center justify-center gap-2
                    text-red-600
                    hover:text-red-700
                    hover:bg-red-50
                    px-3 py-2
                    rounded-lg
                    text-sm
                    font-medium
                    transition-colors
                  "
                >
                  <Trash2 size={17} />
                  Desasignar
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}