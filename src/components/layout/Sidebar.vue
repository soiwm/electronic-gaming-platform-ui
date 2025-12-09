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

export default {
  setup() {
    const router = useRouter()
    const routes = router.options.routes[0].children.filter(
      route => route.meta && route.meta.title
    )
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