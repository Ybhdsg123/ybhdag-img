import { createApp } from 'vue'
import '@/style/style.css'
import App from './App.vue'
import router from '@/router'

const app = createApp(App) // 创建vue实例

app.use(router) // // 路由注册
app.mount('#app')
