import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

import { authService } from "../../services/auth.service";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsPending(true);

    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible restablecer la contraseña."
      );
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <CheckCircle
            size={52}
            className="mx-auto mb-4 text-green-600"
          />

          <h1 className="text-2xl font-bold text-gray-800">
            Contraseña actualizada
          </h1>

          <p className="text-gray-500 mt-3">
            Tu contraseña fue restablecida correctamente.
          </p>

          <Link
            to="/login"
            className="inline-block mt-6 px-6 py-3 bg-[#830AD1] hover:bg-purple-700 text-white font-bold rounded-full"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock
              size={28}
              className="text-[#830AD1]"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Nueva contraseña
          </h1>

          <p className="text-gray-500 mt-2">
            Ingresa tu nueva contraseña.
          </p>
        </div>

        {!token && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2">
            <AlertCircle
              size={20}
              className="text-red-600 shrink-0"
            />

            <p className="text-red-700 text-sm">
              El enlace de recuperación no contiene un token válido.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nueva contraseña"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Repite la contraseña"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !token}
            className="w-full py-3.5 px-4 bg-[#830AD1] hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-full"
          >
            {isPending
              ? "Actualizando..."
              : "Restablecer contraseña"}
          </button>

        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-[#830AD1] hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
}