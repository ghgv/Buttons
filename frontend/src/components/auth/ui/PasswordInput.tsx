// src/components/ui/PasswordInput.tsx
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  disabled?: boolean;
  error?: string;
  register?: any;
  name?: string;
}

export default function PasswordInput({ disabled, error, register, name = "password" }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
        Contraseña
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type={showPassword ? "text" : "password"}
          disabled={disabled}
          placeholder="••••••••"
          className={`
            w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-2xl 
            focus:outline-none focus:border-[#830AD1] focus:bg-white transition-all text-sm font-medium
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error 
              ? "border-red-500 bg-red-50" 
              : "border-gray-200"
            }
          `}
          {...(register ? register(name) : {})}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>
      )}
    </div>
  );
}