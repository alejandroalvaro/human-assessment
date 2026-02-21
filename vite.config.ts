import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Load API key from .dev.vars for local dev proxy
let devApiKey = ''
try {
  const vars = readFileSync('.dev.vars', 'utf-8')
  const match = vars.match(/ANTHROPIC_API_KEY=(.+)/)
  if (match) devApiKey = match[1].trim()
} catch {}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/messages': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            if (devApiKey) {
              proxyReq.setHeader('x-api-key', devApiKey)
              proxyReq.setHeader('anthropic-version', '2023-06-01')
            }
            proxyReq.removeHeader('x-access-password')
          })
        },
      },
    },
  },
})
