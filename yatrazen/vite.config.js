import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "service": path.resolve(__dirname, "./src/service"),
      "../service": path.resolve(__dirname, "./src/service"),
      "../../service": path.resolve(__dirname, "./src/service")
    },
  },
  server: {
    proxy: {
      '/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nominatim/, '')
      }
    },
  },
})