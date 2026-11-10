/**
 * 首页路由模块，包含后台布局与工作台页面。
 * 后续权限菜单可在此继续追加子路由。
 */
export default {
  path: '/',
  component: () => import('@/layouts/MainLayout.vue'),
  redirect: '/dashboard',
  meta: { title: '首页' },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/home/index.vue'),
      meta: { title: '工作台' },
    },
  ],
}
