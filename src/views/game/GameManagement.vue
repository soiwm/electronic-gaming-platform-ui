<template>
  <PageContainer title="游戏管理">
    <div class="game-management">
      <div class="page-tools">
        <button class="btn btn-primary">
          添加游戏
        </button>
      </div>
      <div class="empty-state" v-if="gameList.length === 0">
        <div class="empty-icon">
          <font-awesome-icon icon="gamepad" size="4x" color="#ccc" />
        </div>
        <div class="empty-text">暂无游戏数据</div>
        <div class="empty-desc">点击"添加游戏"按钮创建新的游戏记录</div>
      </div>
      <!-- 数据加载成功后显示列表（可选） -->
      <div v-else class="game-list">
        <div v-for="game in gameList" :key="game.id" class="game-item">
          <h3>{{ game.name }}</h3>
          <p>类型：{{ game.type }}</p>
          <p>描述：{{ game.description }}</p>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
// 导入依赖
import PageContainer from '@/components/common/PageContainer.vue'
import { getGameList } from '@/api/game.js'
import { onMounted, ref } from 'vue' // Vue 3 核心 API

// 定义游戏列表数据（响应式）
const gameList = ref([])

// 定义获取游戏数据的函数
const getGameData = async () => {
  try {
    console.log('开始获取游戏列表...') // 新增日志，确认函数是否执行
    const res = await getGameList()
    console.log('游戏列表数据：', res)
    
    // 校验接口返回格式，提取 data 数据（关键！后端返回 {code:200, msg:"", data:[]}）
    if (res.code === 200 && res.data) {
      gameList.value = res.data // 赋值给响应式变量，更新页面
    } else {
      console.error('接口返回格式错误：', res)
    }
  } catch (error) {
    console.error('获取游戏列表失败：', error.message, error.response)
  }
}

// Vue 3 生命周期钩子：组件挂载后执行（替代 Vue 2 的 mounted）
onMounted(() => {
  getGameData() // 组件渲染完成后调用函数
})
</script>

<style scoped>
/* 原有样式保留，新增游戏列表样式 */
.game-management {
  padding: 10px;
}

.page-tools {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.empty-desc {
  color: #999;
}

/* 游戏列表样式 */
.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.game-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.3s;
}

.game-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>