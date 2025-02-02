import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: ['express', 'path', 'url', 'http', 'buffer', 'events'],
    },
  },
  optimizeDeps: {
    include: ['path-browserify', 'url-polyfill', 'buffer', 'events'],
  },
})
