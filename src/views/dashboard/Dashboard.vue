<template>
  <PageContainer title="系统首页">
    <div class="dashboard-content">
      <div class="stats-card">
        <h3>欢迎使用管理系统</h3>
        <p>这是基于 Vue3 模仿若依框架开发的管理系统模板</p>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon bg-primary">
              <font-awesome-icon icon="gamepad" />
            </div>
            <div class="stat-info">
              <div class="stat-value">0</div>
              <div class="stat-label">游戏数量</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon bg-success">
              <font-awesome-icon icon="users" />
            </div>
            <div class="stat-info">
              <div class="stat-value">0</div>
              <div class="stat-label">客户数量</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/common/PageContainer.vue'

export default {
  components: { PageContainer }
}
</script>

<style>
.dashboard-content {
  padding: 20px;
}

.stats-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.stats-card h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}

.stats-card p {
  color: #666;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: #fff;
}

.bg-primary {
  background-color: #1989fa;
}

.bg-success {
  background-color: #36d399;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 13px;
}
</style>