import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5174-igk5lxbgg8d1hr6d2zi4a-b4d88b30.manusvm.computer',
      '5175-igk5lxbgg8d1hr6d2zi4a-b4d88b30.manusvm.computer',
      '.manusvm.computer', // Permitir qualquer subdomínio manusvm.computer
      'localhost',
      '127.0.0.1'
    ],
    cors: true
  }
})
