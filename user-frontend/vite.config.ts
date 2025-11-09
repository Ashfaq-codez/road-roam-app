import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. Add the plugin here
  ],
  
  server: {
    proxy: {
      // Proxy catches anything starting with /api
      '/api': {
        // Targets the Worker API running on port 8787
        target: 'http://127.0.0.1:8787', 
        changeOrigin: true,
        secure: false, 
      },
    },
  },
})