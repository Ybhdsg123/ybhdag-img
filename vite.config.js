import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'




// https://vitejs.dev/config/
export default defineConfig((mode)=>{
  let env = loadEnv(mode,process.cwd()) // 获取环境变量
  return {
  base: env.VITE_BASE, // 部署在  GitHub pages 上时，找不到js和css文件时，需要指定这个base路径，然后所有资源的路径都将据此配置重写，比如githubpages的路径 后缀为 '/abc',这里就写/abc/，但是开发环境这样会又问题，所以使用环境变量区分
  plugins: [vue()],
  resolve:{
    alias: {
      '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  }
})
