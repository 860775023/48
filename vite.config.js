import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  root: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'myapp/src')
    }
  },
  server: {
    fs: {
      // 允许服务超出根目录的文件
      allow: ['..']
    }
  }
}) 