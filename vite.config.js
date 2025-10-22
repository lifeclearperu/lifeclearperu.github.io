import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  // Al ser un repositorio de usuario (lifeclear.github.io), la base es la raíz.
  base: '/' 
})
