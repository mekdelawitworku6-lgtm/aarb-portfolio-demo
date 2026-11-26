import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base keeps the built site working from any GitHub Pages project URL.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
