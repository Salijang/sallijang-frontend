import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/service/user':    { target: 'http://localhost:8000', rewrite: path => path.replace('/service/user', '') },
      '/service/product': { target: 'http://localhost:8001', rewrite: path => path.replace('/service/product', '') },
      '/service/order':   { target: 'http://localhost:8002', rewrite: path => path.replace('/service/order', '') },
      '/service/notify':  { target: 'http://localhost:8003', rewrite: path => path.replace('/service/notify', '') },
    },
  },
})
