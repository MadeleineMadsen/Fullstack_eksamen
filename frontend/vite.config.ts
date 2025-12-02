// frontend/vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Simple config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})