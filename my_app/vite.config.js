import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/catalog': 'http://localhost:8000',
      '/orders': 'http://localhost:8000',
      '/inventory': 'http://localhost:8000',
    }
  }
})
