import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',       // Allows access from LAN
    port: 5173,            // You can choose a different port if needed
    strictPort: true,      // Prevents fallback to a different port
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  }
})
