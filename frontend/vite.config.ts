// frontend/vite.config.ts - import react så vite forstår det
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Simple config - Start en React-dev-server på port 3000, tillad adgang udefra, og brug React-plugin’et
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})