import { defineConfig } from 'vite'
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';
dotenv.config();

const Backend_Url = "https://biocrats.onrender.com";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": Backend_Url,
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
 
})
