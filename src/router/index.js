import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import GameManagement from '@/views/game/GameManagement.vue'
import CustomerManagement from '@/views/customer/CustomerManagement.vue'
import OrderManagement from '@/views/order/OrderManagement.vue'
import StatisticsReports from '@/views/statistics/StatisticsReports.vue'
import LoginManagement from '@/views/login/LoginManagement.vue'

const routes = [
  // 2. 添加登录路由（无需嵌套在 MainLayout 中，独立页面）
  {
    path: '/login',
    name: 'LoginManagement',
    component: LoginManagement,
    meta: { 
      title: '登录 - 电子游戏管理平台', 
      requiresAuth: false // 标记为「无需登录即可访问」（可省略，默认 false）
    }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: { 
      requiresAuth: true // 3. 父路由添加登录校验：所有子路由都继承该配置（无需给每个子路由单独加）
    },
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
      },
      {
        path: 'order-management',
        name: 'OrderManagement',
        component: OrderManagement,
        meta: { title: '订单管理', icon: 'shopping-cart' }
      },
      {
        path: 'statistics-reports',
        name: 'StatisticsReports',
        component: StatisticsReports,
        meta: { title: '统计报表', icon: 'chart-bar' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 4. 增强路由守卫：同时处理「页面标题设置」和「登录校验」
router.beforeEach((to, from, next) => {
  // 原有逻辑：设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 电子游戏管理平台`
  }

  // 新增逻辑：登录校验
  // 判断当前路由是否需要登录（requiresAuth: true）
  if (to.meta.requiresAuth) {
    // 从 sessionStorage 读取 JWT 令牌（登录成功后存入的 token）
    const token = sessionStorage.getItem('token');
    if (token) {
      // 有令牌 = 已登录：放行
      next();
    } else {
      // 无令牌 = 未登录：强制跳转到登录页，并携带「原计划访问的路径」（方便登录后跳转回原页面）
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 携带原路径参数（如 /game-management）
      });
    }
  } else {
    // 不需要登录的路由（如登录页）：直接放行
    next();
  }
})

export default router