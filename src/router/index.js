import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import GameManagement from '@/views/game/GameManagement.vue'
import CustomerManagement from '@/views/customer/CustomerManagement.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'game-management',
        name: 'GameManagement',
        component: GameManagement,
        meta: { title: '游戏管理', icon: 'gamepad' }
      },
      {
        path: 'customer-management',
        name: 'CustomerManagement',
        component: CustomerManagement,
        meta: { title: '客户管理', icon: 'users' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 电子游戏管理平台`
  }
  next()
})

export default router