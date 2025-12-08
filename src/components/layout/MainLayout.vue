<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div 
      class="main-content"
      :style="{ marginLeft: sidebarCollapse ? '64px' : '220px' }"
    >
      <!-- 顶部导航 -->
      <Header />
      <!-- 路由视图 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { mapGetters } from 'vuex'

export default {
  components: { Sidebar, Header },
  computed: {
    ...mapGetters(['getSidebarCollapse']),
    sidebarCollapse() {
      return this.getSidebarCollapse
    }
  }
}
</script>

<style scoped>
/* 主布局样式已整合到 main.css，此处无需额外样式 */
</style>