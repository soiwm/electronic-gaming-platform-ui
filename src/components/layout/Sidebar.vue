<template>
  <div :class="['sidebar', { collapse: sidebarCollapse }]" @click="handleSidebarClick">
    <div class="sidebar-logo" @click.stop="toggleSidebar">
      <font-awesome-icon icon="bars" />
      <span class="logo-text">电子游戏管理平台</span>
    </div>
    <ul class="sidebar-menu">
      <li class="menu-item" v-for="route in routes" :key="route.path">
        <router-link 
          :to="route.path"
          class="menu-link"
          :class="{ active: $route.path === route.path }"
        >
          <font-awesome-icon :icon="route.meta.icon" class="menu-icon" />
          <span class="menu-text">{{ route.meta.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'

export default {
  setup() {
    const router = useRouter()
    // 新正确逻辑：匹配 component 为 MainLayout 的路由
    const mainRoute = router.options.routes.find(route => {
    // 关键：通过 component 精准匹配 MainLayout 路由
      return route.component === MainLayout
    })

    // 筛选有 meta.title 的子路由（游戏/客户管理都符合）
    const routes = mainRoute?.children?.filter(route => route.meta && route.meta.title) || []

    console.log('匹配到的 MainLayout 路由:', mainRoute)
    console.log('筛选后的菜单路由:', routes) // 此时应显示 3 个路由（首页、游戏管理、客户管理）

    // 返回给模板渲染
    return { routes }
  },
  computed: {
    ...mapGetters(['getSidebarCollapse']),
    sidebarCollapse() {
      return this.getSidebarCollapse
    }
  },
  methods: {
    ...mapActions(['toggleSidebar']),
    handleSidebarClick(e) {
      if (window.innerWidth <= 768 && e.target === this.$el) {
        this.toggleSidebar()
      }
    }
  }
}
</script>

<!-- 直接引入 css 文件，无需 scss -->
<style src="@/assets/css/sidebar.css" scoped></style>