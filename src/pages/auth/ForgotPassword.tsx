// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AuthRightPanel from "../../components/auth/AuthRightPanel";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de recuperación
    console.log("Recuperar contraseña para:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 selection:bg-purple-200">
      
      {/* COLUMNA IZQUIERDA - FORMULARIO */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">

          <div className="flex items-center gap-2.5">
            <Link to="/login" className="text-gray-400 hover:text-[#830AD1] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#830AD1] flex items-center justify-center text-white font-black text-sm">
                .AI
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                nubeware<span className="text-[#830AD1] font-light">.ai</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Recuperar Contraseña
            </h2>
            <p className="text-sm text-gray-500">
              Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña
            </p>
          </div>

          {!submitted ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#830AD1] focus:bg-white transition-all text-sm font-medium"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#830AD1] hover:bg-purple-700 text-white font-bold rounded-full shadow-lg shadow-purple-100 transition-all text-sm tracking-wide"
                >
                  Enviar Instrucciones
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-xs text-[#830AD1] hover:text-purple-700 font-medium transition-colors">
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-green-800 text-sm">
                  ¡Instrucciones enviadas! Revisa tu correo electrónico.
                </p>
              </div>
              <Link to="/login">
                <button className="w-full py-3.5 px-4 bg-[#830AD1] hover:bg-purple-700 text-white font-bold rounded-full shadow-lg shadow-purple-100 transition-all text-sm tracking-wide">
                  Volver al Login
                </button>
              </Link>
            </div>
          )}

        </div>
      </div>

      <AuthRightPanel />

    </div>
  );
}