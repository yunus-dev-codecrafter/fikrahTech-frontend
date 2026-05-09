import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    cssMinify: 'esbuild', // Switch from default to esbuild for stability
    minify: 'esbuild',
    clearScreen: false, // Ensure we see the actual underlying error
  },
  // Ensure environment variables are properly loaded
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000')
  }
})
