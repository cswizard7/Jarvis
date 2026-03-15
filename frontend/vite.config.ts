import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    // FIX: Proxy /api calls to Flask backend in dev to avoid CORS errors.
    // With this, you can leave VITE_API_URL empty in .env and all
    // fetch('/api/...') calls will be forwarded to Flask on port 5000.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})