import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    env: {
      PUBLIC_FIREBASE_API_KEY: 'test-api-key',
      PUBLIC_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      PUBLIC_FIREBASE_PROJECT_ID: 'test-project',
      PUBLIC_FIREBASE_APP_ID: '1:123456789:web:test',
      NODE_ENV: 'test'
    }
  }
}) 