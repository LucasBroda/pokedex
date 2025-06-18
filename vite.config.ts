import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
  resolve: {
    alias: {
      '@layout': resolve(__dirname, './src/app/layout'),
      '@services': resolve(__dirname, './src/app/services'),
      '@components': resolve(__dirname, './src/app/components'),
      '@pages': resolve(__dirname, './src/app/pages'),
    }
  },
} as UserConfig)