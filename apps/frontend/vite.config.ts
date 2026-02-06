import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: { proxy: { '/api': 'http://localhost:4000' }, host: true, port: 5173 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
