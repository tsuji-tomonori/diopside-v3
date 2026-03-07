import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const publicBase = process.env.VITE_PUBLIC_BASE || '/';

export default defineConfig({
  base: publicBase,
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
