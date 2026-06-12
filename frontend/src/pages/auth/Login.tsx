// src/pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, LogIn } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import AuthRightPanel from "../../components/auth/AuthRightPanel";
import PasswordInput from "../../components/auth/ui/PasswordInput";
import { useAuth } from "../../hooks/useAuth"; 
import { loginSchema, type LoginRequest } from "../../zod/auth.zod";

export default function Login() {
  const { mutate, isPending } = useLoginMutation();
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginRequest): void => {
    mutate(data);
  };

   // Si ya está autenticado, redirigir (por si acaso)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 selection:bg-purple-200">
      
      {/* COLUMNA IZQUIERDA - FORMULARIO */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">

          {/* Logo Nubeware.ai */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#830AD1] flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-200">
                .AI
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                nubeware<span className="text-[#830AD1] font-light">.ai</span>
              </span>
            </div>
            <span className="text-[10px] bg-purple-50 text-[#830AD1] px-2 py-1 rounded-md font-mono font-black uppercase tracking-wider">
              IoT Platform
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-gray-500">
              Ingresa tus credenciales para acceder al panel de control
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">

              {/* Email Field */}
              <div>
                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    disabled={isPending}
                    placeholder="correo@ejemplo.com"
                    className={`
                      w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl 
                      focus:outline-none focus:border-[#830AD1] focus:bg-white transition-all text-sm font-medium
                      disabled:bg-gray-100 disabled:cursor-not-allowed
                      ${errors.email 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-200"
                      }
                    `}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field con ver contraseña */}
              <PasswordInput 
                disabled={isPending}
                error={errors.password?.message}
                register={register}
                name="password"
              />

              {/* Enlace de recuperar contraseña */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-[#830AD1] hover:text-purple-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className={`
                  w-full py-3.5 px-4 bg-[#830AD1] hover:bg-purple-700 text-white font-bold rounded-full 
                  shadow-lg shadow-purple-100 transition-all text-sm tracking-wide
                  flex items-center justify-center gap-2
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#830AD1]
                `}
              >
                <LogIn size={18} />
                {isPending ? "Validando..." : "Ingresar al Panel"}
              </button>
            </div>

          </form>

          {/* Mensaje de registro */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-[#830AD1] hover:text-purple-700 font-semibold transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <p className="text-[11px] text-center text-gray-400">
            Tecnología IoT de nubeware.ai - Control inteligente de baños
          </p>
        </div>
      </div>

      {/* COLUMNA DERECHA - Componente reutilizable */}
      <AuthRightPanel />

    </div>
  );
}