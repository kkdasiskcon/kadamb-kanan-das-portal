import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      // Forward /api/audio-proxy to local Node.js server (port 3001)
      '/api/audio-proxy': {
        target: 'http://localhost:3001',
        changeOrigin: false,
      },
      // Forward /api/send-email to Google Workspace Gmail Nodemailer proxy
      '/api/send-email': {
        target: 'http://localhost:3001',
        changeOrigin: false,
      }
    }
  }
})
