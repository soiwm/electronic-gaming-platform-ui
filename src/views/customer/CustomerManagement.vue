<template>
  <PageContainer title="客户管理">
    <div class="customer-management">
      <!-- 操作栏：添加客户按钮 -->
      <div class="page-tools">
        <el-button type="primary" @click="openAddDialog" size="small">
          <el-icon><Plus /></el-icon> 添加客户
        </el-button>
      </div>

      <!-- 客户列表 -->
      <div class="customer-list" v-if="paginatedCustomerList.length > 0">
        <div 
          class="customer-item" 
          v-for="customer in paginatedCustomerList" 
          :key="customer.id"
          @click="openDetailDialog(customer.id)"
        >
          <div class="customer-item__header">
            <h3>{{ customer.name }}</h3>
            <span class="customer-tag">{{ customer.gender === '1' ? '男' : '女' }}</span>
          </div>
          <div class="customer-item__info">
            <p><i class="el-icon el-icon-phone"></i> {{ customer.phone || '无' }}</p>
            <p><i class="el-icon el-icon-location"></i> {{ customer.address || '无' }}</p>
          </div>
          <div class="customer-item__footer">
            <el-button type="text" @click.stop="openEditDialog(customer.id)">修改</el-button>
            <el-button type="text" text-color="#ff4d4f" @click.stop="handleDeleteCustomer(customer.id)">删除</el-button>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagination-container" v-if="customerList.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[8, 16, 24, 32]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="customerList.length">
        </el-pagination>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <font-awesome-icon icon="users" size="4x" color="#ccc" />
        </div>
        <div class="empty-text">暂无客户数据</div>
        <div class="empty-desc">点击"添加客户"按钮创建新的客户记录</div>
      </div>
    </div>

    <!-- 1. 添加客户弹窗 -->
    <el-dialog title="添加客户" v-model="addDialogVisible" width="500px">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="80px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="addForm.gender" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="addForm.address" type="textarea" :rows="2" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入客户邮箱（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 2. 详情/修改弹窗（复用一个弹窗） -->
    <el-dialog 
      :title="dialogType === 'detail' ? '客户详情' : '修改客户'" 
      v-model="detailDialogVisible" 
      width="500px"
    >
      <el-form 
        :model="editForm" 
        :rules="formRules" 
        ref="editFormRef" 
        label-width="80px"
        :disabled="dialogType === 'detail'" 
      >
        <el-form-item label="客户ID">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别" disabled>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="editForm.address" type="textarea" :rows="2" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入客户邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button 
          type="primary" 
          @click="submitEditForm" 
          v-if="dialogType === 'edit'" 
        >
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/common/PageContainer.vue'
// 导入客户相关 API（需确保后端接口已实现）
import { getCustomerList, addCustomer, getCustomerById, updateCustomer, deleteCustomer } from '@/api/customer.js'

// 1. 客户列表数据
const customerList = ref([])

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(8)

// 计算属性：当前页显示的客户列表
const paginatedCustomerList = ref([])

// 2. 添加客户弹窗相关
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = ref({
  name: '',
  gender: '',
  phone: '',
  address: '',
  email: ''
})

// 3. 详情/修改弹窗相关
const detailDialogVisible = ref(false)
const editFormRef = ref(null)
const editForm = ref({
  id: '',
  name: '',
  gender: '',
  phone: '',
  address: '',
  email: ''
})
const dialogType = ref('detail') // 'detail' 详情模式，'edit' 修改模式

// 4. 表单校验规则
const formRules = ref({
  name: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2-10 个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  address: [
    { max: 100, message: '地址长度不超过 100 个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur', required: false }
  ]
})

// 5. 获取客户列表（初始化）
const getCustomerData = async () => {
  try {
    const res = await getCustomerList()
    if (res.code === 200) {
      customerList.value = res.data
      updatePaginatedList() // 更新分页数据
    }
  } catch (error) {
    ElMessage.error('获取客户列表失败：' + error.message)
  }
}

// 更新分页数据
const updatePaginatedList = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  paginatedCustomerList.value = customerList.value.slice(start, end)
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  updatePaginatedList()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  updatePaginatedList()
}

// 6. 打开添加客户弹窗
const openAddDialog = () => {
  addForm.value = { name: '', gender: '', phone: '', address: '', email: '' } // 重置表单
  addDialogVisible.value = true
}

// 7. 提交添加客户表单
const submitAddForm = async () => {
  try {
    // 表单校验
    await addFormRef.value.validate()
    // 调用新增接口
    const res = await addCustomer(addForm.value)
    if (res.code === 200) {
      ElMessage.success(res.msg)
      addDialogVisible.value = false
      getCustomerData() // 刷新列表
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    // 表单校验失败或接口报错
    if (error.name === 'Error') {
      ElMessage.error('添加失败：' + error.message)
    }
  }
}

// 8. 打开详情弹窗
const openDetailDialog = async (id) => {
  try {
    const res = await getCustomerById(id)
    if (res.code === 200) {
      editForm.value = res.data // 回显客户信息
      dialogType.value = 'detail'
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取客户详情失败：' + error.message)
  }
}

// 9. 打开修改弹窗
const openEditDialog = async (id) => {
  try {
    const res = await getCustomerById(id)
    if (res.code === 200) {
      editForm.value = res.data // 回显客户信息
      dialogType.value = 'edit'
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取客户信息失败：' + error.message)
  }
}

// 10. 提交修改表单
const submitEditForm = async () => {
  try {
    // 表单校验
    await editFormRef.value.validate()
    // 调用更新接口
    const res = await updateCustomer(editForm.value)
    if (res.code === 200) {
      ElMessage.success(res.msg)
      detailDialogVisible.value = false
      getCustomerData() // 刷新列表
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    if (error.name === 'Error') {
      ElMessage.error('修改失败：' + error.message)
    }
  }
}

// 11. 删除客户（带确认弹窗）
const handleDeleteCustomer = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该客户吗？删除后不可恢复',
      '确认删除',
      {
        type: 'warning'
      }
    )
    const res = await deleteCustomer(id)
    if (res.code === 200) {
      ElMessage.success(res.msg)
      getCustomerData() // 刷新列表
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除')
    } else {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

// 初始化加载列表
onMounted(() => {
  getCustomerData()
})
</script>

<style scoped>
.customer-management {
  padding: 16px;
}

.page-tools {
  margin-bottom: 24px;
}

/* 客户列表样式 */
.customer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.customer-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.customer-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #4096ff;
}

/* 客户项头部（姓名+性别标签） */
.customer-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.customer-tag {
  font-size: 12px;
  color: #fff;
  background-color: #67c23a;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 客户信息（电话+地址） */
.customer-item__info {
  margin-bottom: 16px;
}

.customer-item__info p {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}

.customer-item__info i {
  margin-right: 6px;
  color: #4096ff;
  font-size: 14px;
}

/* 操作按钮区域 */
.customer-item__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>