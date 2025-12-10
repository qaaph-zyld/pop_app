import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  // Vitest config (used when running `npm test`)
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  } as any,
} as any)
