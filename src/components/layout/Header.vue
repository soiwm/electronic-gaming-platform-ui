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
        <span class="username">{{ username }}</span>
      </div>
      <button class="btn logout-btn" @click="handleLogout">
        <font-awesome-icon icon="sign-out-alt" />
        <span class="logout-text">退出登录</span>
      </button>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import { logout } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    
    // 获取当前登录用户名
    const username = sessionStorage.getItem('username') || '管理员'
    
    // 处理退出登录
    const handleLogout = async () => {
      try {
        // 调用退出登录接口
        const res = await logout()
        if (res.code === 200) {
          // 清除本地存储的登录信息
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('username')
          
          // 显示成功消息
          ElMessage.success('退出登录成功')
          
          // 跳转到登录页
          router.push('/login')
        } else {
          ElMessage.error(res.msg || '退出登录失败')
        }
      } catch (error) {
        ElMessage.error('退出登录失败：' + error.message)
        console.error('退出登录出错：', error)
      }
    }
    
    return {
      username,
      handleLogout
    }
  },
  methods: {
    ...mapActions(['toggleSidebar'])
  }
}
</script>

<style scoped>
/* 原有样式保持不变 */
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