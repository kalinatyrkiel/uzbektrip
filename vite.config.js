import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // Project Pages live under /uzbektrip/; keep / for local `vite` so #plan still works.
  base: command === 'build' ? '/uzbektrip/' : '/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
}))
