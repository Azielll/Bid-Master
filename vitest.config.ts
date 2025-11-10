import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Mock CSS modules
    {
      name: 'css-modules-mock',
      load(id) {
        if (id.endsWith('.module.css')) {
          return 'export default {}'
        }
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

