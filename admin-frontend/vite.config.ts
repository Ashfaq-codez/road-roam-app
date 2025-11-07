// admin-frontend/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Proxy for local development to route API calls to the Worker
  server: {
    // Run the frontend on a unique port
    port: 5174, 
    proxy: {
      // All requests starting with /api will be sent to the Worker
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
});