import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export default defineConfig({ plugins: [
  {
    name: 'zoowork-preview-notices',
    buildStart() {
      execFileSync(process.execPath, [fileURLToPath(new URL('../../../scripts/build-preview-notices.mjs', import.meta.url))], { stdio: 'inherit' })
    },
  },
  react(), tailwindcss(),
] })
