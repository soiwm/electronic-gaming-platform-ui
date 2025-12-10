<template>
  <PageContainer title="游戏管理">
    <div class="game-management">
      <!-- 操作栏：添加游戏按钮 -->
  <div class="page-tools">
    <el-button type="primary" @click="openAddDialog">
      <el-icon><Plus /></el-icon> 添加游戏
    </el-button>
  </div>

      <!-- 游戏列表 -->
      <div class="game-list" v-if="paginatedGameList.length > 0">
        <div 
          class="game-item" 
          v-for="game in paginatedGameList" 
          :key="game.id"
          @click="openDetailDialog(game.id)"
        >
          <div class="game-logo">
            <img 
              :src="getGameLogoUrl(game.logo)" 
              :alt="game.name"
              @error.once="handleImageError"
            />
          </div>
          <div class="game-item__header">
            <h3>{{ game.name }}</h3>
            <span class="game-type">{{ game.type }}</span>
          </div>
          <div class="game-price-tag">
            ¥{{ game.price || 0.00 }}
          </div>
          <div class="game-item__desc">
            {{ game.description || "无描述信息" }}
          </div>
          <div class="game-item__footer">
            <el-button type="text" @click.stop="openEditDialog(game.id)">修改</el-button>
            <el-button type="text" text-color="#ff4d4f" @click.stop="handleDeleteGame(game.id)">删除</el-button>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagination-container" v-if="gameList.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[8, 16, 24, 32]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="gameList.length">
        </el-pagination>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <font-awesome-icon icon="gamepad" size="4x" color="#ccc" />
        </div>
        <div class="empty-text">暂无游戏数据</div>
        <div class="empty-desc">点击"添加游戏"按钮创建新的游戏记录</div>
      </div>
    </div>

    <!-- 1. 添加游戏弹窗 -->
    <el-dialog title="添加游戏" v-model="addDialogVisible" width="500px">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="80px">
        <el-form-item label="游戏Logo" prop="logo">
          <el-upload
            class="logo-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAddLogoChange"
          >
            <img v-if="addForm.logo" :src="getGameLogoUrl(addForm.logo)" class="logo-preview" />
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="logo-tip">支持jpg、png格式，建议尺寸200x200</div>
        </el-form-item>
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏类型" prop="type">
          <el-input v-model="addForm.type" placeholder="请输入游戏类型（如 MOBA、射击）" />
        </el-form-item>
        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="addForm.description" type="textarea" :rows="3" placeholder="请输入游戏描述" />
        </el-form-item>
         <el-form-item label="游戏价格" prop="price">
          <el-input v-model="addForm.price" placeholder="请输入游戏价格" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 2. 详情/修改弹窗（复用一个弹窗，通过 type 区分） -->
    <el-dialog 
      :title="dialogType === 'detail' ? '游戏详情' : '修改游戏'" 
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
        <el-form-item label="游戏ID">
          <el-input v-model="editForm.id" disabled /> <!-- ID 不可修改 -->
        </el-form-item>
        <el-form-item label="游戏Logo" prop="logo">
          <el-upload
            class="logo-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleEditLogoChange"
            :disabled="dialogType === 'detail'"
          >
            <img v-if="editForm.logo" :src="getGameLogoUrl(editForm.logo)" class="logo-preview" />
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="logo-tip">支持jpg、png格式，建议尺寸200x200</div>
        </el-form-item>
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏类型" prop="type">
          <el-input v-model="editForm.type" placeholder="请输入游戏类型" />
        </el-form-item>
        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="3" placeholder="请输入游戏描述" />
        </el-form-item>
        <el-form-item label="游戏价格" prop="price">
          <el-input v-model="editForm.price" placeholder="请输入游戏价格" />
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
import { getGameList, addGame, getGameById, updateGame, deleteGame, uploadGameLogo } from '@/api/game.js'

// 1. 列表数据
const gameList = ref([])

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(8)

// 计算属性：当前页显示的游戏列表
const paginatedGameList = ref([])

// 2. 添加游戏弹窗相关
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = ref({
  name: '',
  type: '',
  description: '',
  price: '',
  logo: ''
})

// 3. 详情/修改弹窗相关
const detailDialogVisible = ref(false)
const editFormRef = ref(null)
const editForm = ref({
  id: '',
  name: '',
  type: '',
  description: '',
  price: '',
  logo: ''
})
const dialogType = ref('detail') // 'detail' 详情模式，'edit' 修改模式

// 4. 表单校验规则
const formRules = ref({
  name: [
    { required: true, message: '请输入游戏名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度在 2-20 个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入游戏类型', trigger: 'blur' },
    { min: 1, max: 10, message: '类型长度在 1-10 个字符之间', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述长度不超过 200 个字符', trigger: 'blur' }
  ]
  
})

// 5. 获取游戏列表（初始化）
const getGameData = async () => {
  try {
    const res = await getGameList()
    console.log('获取游戏列表响应:', res)
    if (res.code === 200) {
      console.log('游戏列表数据:', res.data)
      gameList.value = res.data
      updatePaginatedList() // 更新分页数据
    }
  } catch (error) {
    ElMessage.error('获取游戏列表失败：' + error.message)
  }
}

// 更新分页数据
const updatePaginatedList = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  paginatedGameList.value = gameList.value.slice(start, end)
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

// 6. 打开添加游戏弹窗
const openAddDialog = () => {
  addForm.value = { name: '', type: '', description: '', price: '', logo: '' } // 重置表单
  addDialogVisible.value = true
}

// 7. 提交添加游戏表单
const submitAddForm = async () => {
  try {
    // 表单校验
    await addFormRef.value.validate()
    // 调用新增接口
    const res = await addGame(addForm.value)
    if (res.code === 200) {
      ElMessage.success(res.msg)
      addDialogVisible.value = false
      getGameData() // 刷新列表
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

// 8. 打开详情弹窗（根据 ID 查询游戏信息）
const openDetailDialog = async (id) => {
  try {
    const res = await getGameById(id)
    if (res.code === 200) {
      editForm.value = res.data // 回显游戏信息
      dialogType.value = 'detail' // 切换为详情模式
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取游戏详情失败：' + error.message)
  }
}

// 9. 打开修改弹窗
const openEditDialog = async (id) => {
  try {
    const res = await getGameById(id)
    if (res.code === 200) {
      editForm.value = res.data // 回显游戏信息
      dialogType.value = 'edit' // 切换为修改模式
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取游戏信息失败：' + error.message)
  }
}

// 10. 提交修改表单
const submitEditForm = async () => {
  try {
    // 表单校验
    await editFormRef.value.validate()
    // 调用更新接口
    const res = await updateGame(editForm.value)
    if (res.code === 200) {
      ElMessage.success(res.msg)
      detailDialogVisible.value = false
      getGameData() // 刷新列表
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    if (error.name === 'Error') {
      ElMessage.error('修改失败：' + error.message)
    }
  }
}

// 11. 删除游戏（带确认弹窗）
const handleDeleteGame   = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该游戏吗？删除后不可恢复',
      '确认删除',
      {
        type: 'warning'
      }
    )
    const res = await deleteGame(id)
    if (res.code === 200) {
      ElMessage.success(res.msg)
      getGameData() // 刷新列表
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

// 12. 处理添加游戏logo变化
const handleAddLogoChange = async (file) => {
  // 检查文件类型
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }

  try {
    // 上传图片到服务器
    const res = await uploadGameLogo(file.raw)
    if (res.code === 200) {
      // 保存服务器返回的图片路径
      addForm.value.logo = res.data
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error(res.msg || '图片上传失败')
    }
  } catch (error) {
    ElMessage.error('图片上传失败：' + error.message)
  }
}

// 13. 处理编辑游戏logo变化
const handleEditLogoChange = async (file) => {
  // 检查文件类型
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }

  try {
    // 上传图片到服务器
    const res = await uploadGameLogo(file.raw)
    if (res.code === 200) {
      // 保存服务器返回的图片路径
      editForm.value.logo = res.data
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error(res.msg || '图片上传失败')
    }
  } catch (error) {
    ElMessage.error('图片上传失败：' + error.message)
  }
}

// 14. 获取游戏logo URL：仅做最小规则，避免拼错路径
const getGameLogoUrl = (logo) => {
  // 无值用默认图（放在 public/images/game/ 下）
  if (!logo) return '/images/game/default-game.svg'

  // 完整 URL 直接返回
  if (/^https?:\/\//i.test(logo)) return logo

  // 以 / 开头：认为后端可直接访问的静态路径（走同域或 dev 代理）
  if (logo.startsWith('/')) return logo

  // 仅文件名：补上后端静态前缀
  return `/images/game/${logo}`
}

// 15. 处理图片加载错误
const handleImageError = (e) => {
  // 防止无限循环，只设置一次默认图片
  if (!e.target.src.includes('default-game.svg')) {
    e.target.src = '/images/game/default-game.svg'
  }
}

// 初始化加载列表
onMounted(() => {
  getGameData()
})
</script>

<style scoped>
.game-management {
  padding: 16px;
}

.page-tools {
  margin-bottom: 24px;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.game-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; /* 关键：开启相对定位 */
  overflow: hidden; /* 防止价格标签超出容器 */
}

.game-logo {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.game-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-item:hover .game-logo img {
  transform: scale(1.05);
}

/* 价格标签：绝对定位到左下角 */
.game-price-tag {
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #4096ff; /* 蓝色背景，和类型标签呼应 */
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 0 4px 0 0; /* 左下角圆角，适配容器 */
}

.game-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #4096ff;
}

.game-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.game-type {
  font-size: 12px;
  color: #4096ff;
  background-color: #e6f4ff;
  padding: 2px 8px;
  border-radius: 12px;
}

.game-item__desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-item__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

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

/* Logo上传组件样式 */
.logo-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.logo-uploader:hover {
  border-color: var(--el-color-primary);
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 180px;
  text-align: center;
  line-height: 180px;
}

.logo-preview {
  width: 180px;
  height: 180px;
  display: block;
  object-fit: cover;
}

.logo-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>