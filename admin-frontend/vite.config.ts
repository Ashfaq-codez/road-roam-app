// admin-frontend/vite.config.ts - CLEANED CONFIG

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NO external imports for Tailwind or PostCSS

export default defineConfig({
  plugins: [react()],
  
  // This block is for your local dev server to talk to your Worker
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  
  // CRITICAL: Ensure no 'css' or 'resolve' blocks are present here to prevent conflicts.
});