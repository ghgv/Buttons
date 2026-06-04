import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
// import { env } from './config/env.config.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita re-peticiones innecesarias al cambiar de pestaña
      retry: 1,                    // Número de reintentos en caso de fallo
    },
  },
});


// === FUNCIÓN DE PRUEBA DE CONEXIÓN AL ENDPOINT /PRUEBA ===
// interface ApiResponse {
//   mensaje: string;
// }

// (async (): Promise<void> => {
//   const endpoint = `${env.apiUrl}/prueba`;
//   console.log(`%c[PROBANDO CONEXIÓN]: Conectando a ${endpoint}...`, "color: #3b82f6; font-weight: bold;");

//   try {
//     const response = await fetch(endpoint, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.ok) {
//       // Extraemos el cuerpo de la respuesta del backend de Python
//       const data: ApiResponse = await response.json();
      
//       console.log(
//         `%c[ÉXITO]: Conexión total. El backend respondió (Status: ${response.status}).`, 
//         "color: #10b981; font-weight: bold; background: #e6fffa; padding: 4px;"
//       );
      
//       // Imprime el JSON exacto del backend en la consola: { "mensaje": "API funcionando" }
//       console.log("%c[DATA RECIBIDA]:", "color: #10b981; font-weight: bold;", data);
//     } else {
//       console.warn(
//         `%c[ADVERTENCIA]: El servidor respondió, pero /prueba devolvió código HTTP: ${response.status}`, 
//         "color: #f59e0b; font-weight: bold;"
//       );
//     }
//   } catch (error) {
//     console.error(
//       `%c[ERROR CRÍTICO]: No se pudo conectar a ${endpoint}.`, 
//       "color: #ef4444; font-weight: bold; background: #fef2f2; padding: 4px;"
//     );
//     console.error("Detalle del fallo de red (Posible CORS o puerto cerrado):", error);
//   }
// })();
// ==========================================================
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {/* 2. El componente Toaster se coloca al mismo nivel para escuchar eventos globales */}
        <Toaster richColors position="top-right" closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
