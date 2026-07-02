import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      'liquid-glass-vue': fileURLToPath(
        new URL('../../packages/liquid-glass-vue/src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    port: 5173,
  },
})
