import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  base: './',
  server: {
    historyApiFallback: true, // Fixes 404 errors on refresh
  }
})
