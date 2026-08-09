import { useState } from "react";
import {
  UserRound,
  UserPlus,
  Loader2,
  Mail,
  Pencil,
} from "lucide-react";

import {
  useGetAssignmentTechnicians,
  useCreateTechnician,
  useUpdateTechnician,
} from "../../hooks/useAssignment";

export default function Tecnicos() {
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const {
    data: technicians = [],
    isLoading,
  } = useGetAssignmentTechnicians();

  const createTechnician = useCreateTechnician();
  const updateTechnician = useUpdateTechnician();

  const handleCreate = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      return;
    }

    createTechnician.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setPassword("");
          setShowForm(false);
        },
      }
    );
  };

  const handleStartEdit = (technician: {
    id: number;
    name: string;
    email: string;
  }) => {
    setEditingId(technician.id);
    setEditName(technician.name);
    setEditEmail(technician.email);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const handleUpdate = () => {
    if (
      editingId === null ||
      !editName.trim() ||
      !editEmail.trim()
    ) {
      return;
    }

    updateTechnician.mutate(
      {
        technicianId: editingId,
        data: {
          name: editName.trim(),
          email: editEmail.trim(),
        },
      },
      {
        onSuccess: () => {
          handleCancelEdit();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2
          size={30}
          className="animate-spin text-purple-700"
        />
      </div>
    );
  }

  return (
    <div>

      {/* Encabezado */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <UserRound
              className="text-purple-700"
              size={28}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Técnicos
            </h1>

            <p className="text-gray-500 mt-1">
              Administra los técnicos de tu empresa.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="
            flex items-center justify-center gap-2
            bg-purple-700 hover:bg-purple-800
            text-white
            px-4 py-2.5
            rounded-lg
            font-medium
            transition-colors
          "
        >
          <UserPlus size={18} />
          Nuevo técnico
        </button>

      </div>

      {/* Crear técnico */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Crear técnico
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del técnico"
                className="
                  w-full border border-gray-300 rounded-lg
                  px-3 py-2.5
                  focus:outline-none
                  focus:ring-2 focus:ring-purple-500
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tecnico@empresa.com"
                className="
                  w-full border border-gray-300 rounded-lg
                  px-3 py-2.5
                  focus:outline-none
                  focus:ring-2 focus:ring-purple-500
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="
                  w-full border border-gray-300 rounded-lg
                  px-3 py-2.5
                  focus:outline-none
                  focus:ring-2 focus:ring-purple-500
                "
              />
            </div>

          </div>

          {createTechnician.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              No fue posible crear el técnico.
              Verifica que el correo sea válido y que no esté registrado.
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={createTechnician.isPending}
              className="
                px-4 py-2
                text-gray-600
                hover:bg-gray-100
                rounded-lg
                font-medium
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={
                !name.trim() ||
                !email.trim() ||
                password.length < 6 ||
                createTechnician.isPending
              }
              className="
                flex items-center gap-2
                bg-purple-700 hover:bg-purple-800
                disabled:bg-gray-300
                disabled:cursor-not-allowed
                text-white
                px-4 py-2
                rounded-lg
                font-medium
              "
            >
              {createTechnician.isPending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <UserPlus size={17} />
              )}

              Crear técnico
            </button>

          </div>

        </div>
      )}

      {/* Lista de técnicos */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Técnicos registrados
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {technicians.length} técnico
            {technicians.length !== 1 ? "s" : ""}
          </p>
        </div>

        {technicians.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            <UserRound
              size={40}
              className="mx-auto mb-3 text-gray-300"
            />
            No hay técnicos registrados.
          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {technicians.map((technician) => (
              <div
                key={technician.id}
                className="px-6 py-5 hover:bg-gray-50"
              >

                {editingId === technician.id ? (

                  /* Modo edición */
                  <div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>

                        <input
                          type="text"
                          value={editName}
                          onChange={(e) =>
                            setEditName(e.target.value)
                          }
                          className="
                            w-full border border-gray-300 rounded-lg
                            px-3 py-2.5 bg-white
                            focus:outline-none
                            focus:ring-2 focus:ring-purple-500
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>

                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) =>
                            setEditEmail(e.target.value)
                          }
                          className="
                            w-full border border-gray-300 rounded-lg
                            px-3 py-2.5 bg-white
                            focus:outline-none
                            focus:ring-2 focus:ring-purple-500
                          "
                        />
                      </div>

                    </div>

                    {updateTechnician.isError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        No fue posible actualizar el técnico.
                        Verifica que el correo sea válido y que no esté registrado.
                      </div>
                    )}

                    <div className="mt-4 flex justify-end gap-3">

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={updateTechnician.isPending}
                        className="
                          px-4 py-2
                          text-gray-600
                          hover:bg-gray-100
                          rounded-lg
                          font-medium
                        "
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={
                          !editName.trim() ||
                          !editEmail.trim() ||
                          updateTechnician.isPending
                        }
                        className="
                          flex items-center gap-2
                          bg-purple-700 hover:bg-purple-800
                          disabled:bg-gray-300
                          disabled:cursor-not-allowed
                          text-white
                          px-4 py-2
                          rounded-lg
                          font-medium
                        "
                      >
                        {updateTechnician.isPending && (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        )}

                        Guardar
                      </button>

                    </div>

                  </div>

                ) : (

                  /* Modo normal */
                  <div className="
                    flex flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                  ">

                    <div>

                      <div className="flex items-center gap-2">
                        <UserRound
                          size={18}
                          className="text-purple-600"
                        />

                        <span className="font-medium text-gray-800">
                          {technician.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Mail size={16} />
                        {technician.email}
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      {technician.is_active && (
                        <span className="
                          px-3 py-1
                          text-xs font-medium
                          bg-green-100 text-green-700
                          rounded-full
                        ">
                          Activo
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(technician)
                        }
                        className="
                          flex items-center gap-2
                          px-3 py-2
                          text-sm font-medium
                          text-purple-700
                          hover:bg-purple-50
                          rounded-lg
                        "
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}