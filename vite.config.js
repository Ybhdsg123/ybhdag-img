import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/ybhdag-img/", // 部署在  GitHub pages 上时，找不到js和css文件时，需要指定这个base路径，然后所有资源的路径都将据此配置重写
  plugins: [vue()],
  resolve:{
    alias: {
      '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
})
