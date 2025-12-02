import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      allowedHosts: ["jsmge-editor-1", "jsmge-editor", "http://localhost", "localhost", "http://localhost:5000","http://127.0.0.1:5000/",  "http://127.0.0.1/", "localhost:3000"],
      proxy: {
          '/api': {
              target: 'https://localhost:80/api',
              changeOrigin: true,
              secure: false,
              ws: true,
              configure: (proxy, _options) => {
                proxy.on('error', (err, _req, _res) => {
                  console.log('proxy error', err);
                });
                proxy.on('proxyReq', (proxyReq, req, _res) => {
                  console.log('Sending Request to the Target:', req.method, req.url);
                });
                proxy.on('proxyRes', (proxyRes, req, _res) => {
                  console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                });
              }
          }
      }
  }
})
