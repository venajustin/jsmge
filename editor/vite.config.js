import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      allowedHosts: ["jsmge-editor", "localhost:5000","http://127.0.0.1:5000/",  "http://127.0.0.1/", "localhost:3000"],
  }
})
