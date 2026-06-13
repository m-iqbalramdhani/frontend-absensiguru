import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* ══════════════════════════════════════
   vite.config.js — SMK Binatama Frontend
   Tanpa vite-plugin-pwa (pakai custom sw.js manual)
   agar lebih mudah dikontrol & dipahami
══════════════════════════════════════ */
export default defineConfig({
  plugins: [react()],

  // ── Dev server ──
  server: {
    port: 5173,
    open: true,
    // Proxy API ke backend lokal agar tidak kena CORS saat development
    proxy: {
      '/api': {
        target: 'https://absensiguru-om7srviy.b4a.run',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ── Build optimization ──
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Pecah bundle agar lebih kecil
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor'
            }
            if (id.includes('zustand')) {
              return 'state'
            }
            if (id.includes('axios')) {
              return 'http'
            }
            if (id.includes('bootstrap')) {
              return 'bootstrap'
            }
          }
        },
      },
    },
    // Peringatan jika chunk > 600kb
    chunkSizeWarningLimit: 600,
  },

  // ── Resolve alias (opsional, memudahkan import) ──
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})