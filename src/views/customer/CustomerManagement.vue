<template>
  <PageContainer title="客户管理">
    <div class="customer-management">
      <div class="page-tools">
        <button class="btn btn-primary">
          添加客户
        </button>
      </div>
      <div class="empty-state">
        <div class="empty-icon">
          <font-awesome-icon icon="users" size="4x" color="#ccc" />
        </div>
        <div class="empty-text">暂无客户数据</div>
        <div class="empty-desc">点击"添加客户"按钮创建新的客户记录</div>
      </div>
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/common/PageContainer.vue'
import { getCustomerList } from '@/api/customer.js'

export default {
  components: { PageContainer },
  mounted() {
    this.getCustomerData()
  },
  methods: {
    async getCustomerData() {
      try {
        const res = await getCustomerList()
        console.log('客户列表数据：', res)
      } catch (error) {
        console.error('获取客户列表失败：', error)
      }
    }
  }
}
</script>

<style scoped>
.customer-management {
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
</style>