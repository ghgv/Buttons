import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  useGetNubewareClientes,
  useGetClientAdmins,
  useCreateClientAdmin,
  useUpdateClientAdmin,
  useDeleteClientAdmin,
} from "../../hooks";

import type {
  ClientAdminResponse,
  CreateClientAdminRequest,
} from "../../types/clientAdmin.types";


export default function Administradores() {
  const [modalOpen, setModalOpen] = useState(false);

  const [editing, setEditing] =
    useState<ClientAdminResponse | null>(null);

  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const {
    data: admins = [],
    isLoading,
  } = useGetClientAdmins();

  const {
    data: clientes = [],
  } = useGetNubewareClientes();

  const {
    mutate: createAdmin,
    isPending: creating,
  } = useCreateClientAdmin();

  const {
    mutate: updateAdmin,
    isPending: updating,
  } = useUpdateClientAdmin();

  const {
    mutate: deleteAdmin,
    isPending: deleting,
  } = useDeleteClientAdmin();


  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setClientId("");
    setName("");
    setEmail("");
    setPassword("");
  };


  const openCreate = () => {
    setEditing(null);
    setClientId("");
    setName("");
    setEmail("");
    setPassword("");
    setModalOpen(true);
  };


  const openEdit = (admin: ClientAdminResponse) => {
    setEditing(admin);
    setClientId(String(admin.client_id));
    setName(admin.name);
    setEmail(admin.email);
    setPassword("");
    setModalOpen(true);
  };


  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!clientId || !name.trim() || !email.trim()) {
      Swal.fire({
        title: "Datos incompletos",
        text: "Selecciona un cliente e ingresa nombre y correo.",
        icon: "warning",
        confirmButtonColor: "#830AD1",
      });
      return;
    }

    if (editing) {
      updateAdmin(
        {
          id: editing.id,
          data: {
            client_id: Number(clientId),
            name: name.trim(),
            email: email.trim(),
          },
        },
        {
          onSuccess: closeModal,
        }
      );

      return;
    }

    if (password.length < 6) {
      Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 6 caracteres.",
        icon: "warning",
        confirmButtonColor: "#830AD1",
      });
      return;
    }

    const data: CreateClientAdminRequest = {
      client_id: Number(clientId),
      name: name.trim(),
      email: email.trim(),
      password,
    };

    createAdmin(data, {
      onSuccess: closeModal,
    });
  };


  const handleDelete = async (
    admin: ClientAdminResponse
  ) => {
    const result = await Swal.fire({
      title: "¿Eliminar administrador?",
      text:
        `${admin.name} dejará de administrar ` +
        `${admin.client_name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    deleteAdmin(admin.id);
  };


  if (isLoading) {
    return (
      <div className="p-8 text-gray-500">
        Cargando administradores...
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Administradores
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Administradores asignados a los clientes
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
        >
          <Plus size={18} />
          Nuevo Administrador
        </button>
      </div>


      {/* Lista */}
      <div className="space-y-3">

        {admins.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-500">
            No hay administradores registrados.
          </div>
        )}

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex items-center justify-between"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <ShieldCheck
                  size={22}
                  className="text-purple-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {admin.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {admin.email}
                </p>

                <p className="text-xs text-purple-600 mt-1">
                  Cliente: {admin.client_name}
                </p>
              </div>

            </div>


            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => openEdit(admin)}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                title="Editar"
              >
                <Edit size={18} />
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(admin)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>
        ))}
      </div>


      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

            <div className="p-6 border-b border-gray-100 flex justify-between items-center">

              <div>
                <h2 className="text-xl font-semibold">
                  {editing
                    ? "Editar Administrador"
                    : "Nuevo Administrador"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Asigna el administrador a un cliente
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente *
                </label>

                <select
                  value={clientId}
                  onChange={(e) =>
                    setClientId(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                >
                  <option value="">
                    Selecciona un cliente
                  </option>

                  {clientes.map((cliente) => (
                    <option
                      key={cliente.id}
                      value={cliente.id}
                    >
                      {cliente.name}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                />
              </div>


              {!editing && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contraseña *
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    minLength={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                    required
                  />
                </div>
              )}


              <div className="flex gap-3 pt-4 border-t border-gray-100">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 rounded-xl py-2.5"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={creating || updating}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {(creating || updating) && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editing
                    ? "Guardar cambios"
                    : "Crear Administrador"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}