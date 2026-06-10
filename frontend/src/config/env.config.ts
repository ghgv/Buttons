// Definimos una interfaz estricta para nuestras variables de entorno
interface EnvConfig {
  apiUrl: string;
}

export const env: EnvConfig = {
  // Evaluamos y aseguramos que la variable exista. Si falta, lanzamos error en desarrollo.
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000", 
};