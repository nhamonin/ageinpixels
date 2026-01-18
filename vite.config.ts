import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/gho': {
        target: 'https://ghoapi.azureedge.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gho/, '/api'),
      },
    },
  },
});
