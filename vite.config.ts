import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiTarget = env.VITE_API_BASE_URL_DEV || 'https://localhost:7194/'
  const prodApiTarget = env.VITE_API_BASE_URL_PROD || 'https://yourProductionUrl.com/'
  const apiTarget = mode === 'development' ? devApiTarget : prodApiTarget

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false, // Set to false for self-signed certificates in development
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
        // Azurite blob storage has no CORS headers; proxying keeps blob images same-origin in dev (e.g. PDF logo embedding).
        '/devstoreaccount1': {
          target: env.VITE_AZURITE_BLOB_URL || 'http://127.0.0.1:10000',
          changeOrigin: true
        },
        '/hubs': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true // Enable WebSocket proxying for SignalR
        }
      }
    }
  }
})
 