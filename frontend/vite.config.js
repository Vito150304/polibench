import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  
  server: {
    proxy: {
      '/api': {
        // NOTA: Controlla su quale porta si accende il backend di PoliBench. 
        // Solitamente è la 8000 o la 8080. Se è diversa, cambiala qui sotto.
        target: 'http://localhost:8000', 
        changeOrigin: true,
      }
    }
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'], 
          'vendor-recharts': ['recharts'],
        },
      },
    },
  },
})