import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Esto equivale a usar --host para escuchar en todas las IPs
    port: 5174,
    allowedHosts: [
      'www.dali.com.co',
      'dali.com.co'     
    ]
  }
})
