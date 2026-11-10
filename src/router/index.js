import { createRouter, createWebHistory } from 'vue-router'
import { appConfig } from '@/config'
import { useUserStore } from '@/stores/modules/user'
import homeRoutes from './modules/home'

/**
 * 静态路由。meta.public 为 true 表示无需登录即可访问。
 * 业务权限路由待后端菜单接口确认后，通过 registerDynamicRoutes 动态追加。
 */
export const staticRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true },
  },
  homeRoutes,
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在', public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  // 未登录访问受保护页面：跳转登录页并保留目标地址
  if (!to.meta.public && !userStore.token) {
    return {
      path: appConfig.loginPath,
      query: { redirect: to.fullPath },
    }
  }

  // 已登录访问登录页：按项目规则重定向到首页
  if (to.path === appConfig.loginPath && userStore.token) {
    return { path: '/' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - ${appConfig.title}` : appConfig.title
})

/**
 * 动态注册路由（预留给权限菜单）
 * 待后端权限接口确认后调用，例如在登录成功或拉取菜单后执行。
 * @param {Array<object>} routes
 */
export function registerDynamicRoutes(routes = []) {
  routes.forEach((route) => router.addRoute(route))
}

export default router
