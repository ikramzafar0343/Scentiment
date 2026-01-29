import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // ✅ Allow Render domain in production preview
  preview: {
    allowedHosts: [
      'scentiment-9zi3.onrender.com', // Add your Render URL here
    ],
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}']
  }
})
