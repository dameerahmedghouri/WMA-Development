// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Example framework plugin
import path from 'node:path'

export default defineConfig({
  // 1. Shared Options
  root: process.cwd(), // Project root directory
  base: '/', // Base public path for production deployment
  plugins: [react()], // Array of plugins to utilize

  resolve: {
    alias: {
      // Setup path aliases (e.g., matching '@/' to your src folder)
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },

  // 2. Local Development Server Options
  server: {
    host: 'localhost', // Server host name
    port: 3000, // Port to run the dev server on
    strictPort: true, // Fail if port 3000 is already in use
    open: true, // Automatically open browser on server start
    proxy: {
      // Proxying API requests to a backend server
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 3. Production Build Options
  build: {
    outDir: 'dist', // Target directory for production build assets
    assetsDir: 'assets', // Directory under outDir to place generated assets
    sourcemap: false, // Set to true to emit source maps for debugging
    chunkSizeWarningLimit: 500, // Size limit warning for chunks in KB
  },
})
