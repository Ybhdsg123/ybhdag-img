import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/index.vue";
// 路由信息
const routers: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: Index,
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: routers,
});

export default router;
