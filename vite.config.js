import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// loadEnv(mode,envDir,prefix)
// mode：模式
// envDir：环境变量配置文件所在目录
// prefix：接受的环境变量前缀，默认为 VITE_

// 可以传入一个方法，方法可以接收一个对象，对象中常用两个参数：command, mode
export default defineConfig(({mode})=>{
  // mode: 模式
  // process.cwd(): 项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。
let env = loadEnv(mode,process.cwd()) // 获取环境变量
console.log(import.meta);
// console.log(env.VITE_BASE,'env.VITE_BASE')
  return {
    base:  env.VITE_BASE, // 部署在  GitHub pages 上时，找不到js和css文件时，需要指定这个base路径，然后所有资源的路径都将据此配置重写，比如githubpages的路径 后缀为 '/abc',这里就写/abc/，但是开发环境这样会又问题，所以使用环境变量区分
    plugins: [vue()],
    resolve:{
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
        '~/': `${path.resolve(__dirname, 'src')}/`
      }
    },
  }
})
