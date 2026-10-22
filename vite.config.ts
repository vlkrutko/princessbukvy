import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // относительные пути — сборка работает и из подпапки (GitHub Pages и т.п.)
  base: './',
  // host: true — сервер виден в домашней сети, чтобы открыть с iPad
  server: { host: true, port: 5174 },
  preview: { host: true, port: 4174 },
})
