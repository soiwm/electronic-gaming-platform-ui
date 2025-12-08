<template>
  <header class="header">
    <div class="header-left">
      <button class="btn btn-primary" @click="toggleSidebar">
        <font-awesome-icon icon="bars" />
      </button>
    </div>
    <div class="header-right">
      <div class="user-info">
        <font-awesome-icon icon="user" />
        <span class="username">管理员</span>
      </div>
      <button class="btn logout-btn">
        <font-awesome-icon icon="sign-out-alt" />
        <span class="logout-text">退出登录</span>
      </button>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['toggleSidebar'])
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-left .btn {
  margin-right: 10px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #666;
}

.user-info .username {
  margin-left: 8px;
}

.logout-btn {
  color: #666;
  background-color: transparent;
  border: none;
}

.logout-btn:hover {
  color: #1989fa;
  background-color: transparent;
}

.logout-text {
  margin-left: 6px;
}

@media (max-width: 768px) {
  .logout-text {
    display: none;
  }
}
</style>