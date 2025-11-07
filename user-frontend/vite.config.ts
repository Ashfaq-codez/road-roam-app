// user-frontend/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // CRITICAL ADDITION: Proxy for local development
  server: {
    proxy: {
      // All requests starting with /api will be sent to the Worker
      '/api': {
        target: 'http://127.0.0.1:8787', // Your Worker's local address
        changeOrigin: true,
      },
    },
  },
});