import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Simpel Vite-konfiguration

export default defineConfig({

  // Aktiver React-plugin
  plugins: [react()],

  // Dev server-indstillinger
  server: {
    port: 3000,   // Kører udviklingsserveren på port 3000
    host: true    // Tillader adgang udefra (fx via lokal IP / Docker)
  }
})