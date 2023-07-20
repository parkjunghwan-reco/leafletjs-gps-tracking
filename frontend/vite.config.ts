import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, 'src') },
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
