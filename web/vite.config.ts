import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  resolve: {
    alias: [
      {find: '@app', replacement: path.resolve(__dirname, 'src/app/index')},
      {find: '@processes', replacement: path.resolve(__dirname, 'src/processes')},
      {find: '@pages', replacement: path.resolve(__dirname, 'src/pages')},
      {find: '@widgets', replacement: path.resolve(__dirname, 'src/widgets')},
      {find: '@features', replacement: path.resolve(__dirname, 'src/features')},
      {find: '@entities', replacement: path.resolve(__dirname, 'src/entities')},
      {find: '@uikit', replacement: path.resolve(__dirname, 'src/uikit')},
      {find: '@service', replacement: path.resolve(__dirname, 'src/service')},
      {find: '@shared', replacement: path.resolve(__dirname, 'src/shared')},
      {find: '@core', replacement: path.resolve(__dirname, 'src/core')},
    ],
  },
})
