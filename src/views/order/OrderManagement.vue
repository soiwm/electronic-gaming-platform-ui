<template>
  <PageContainer title="订单管理">
    <div class="order-management">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <font-awesome-icon icon="plus" />
          新增订单
        </el-button>
        <el-button type="danger" :disabled="!selectedOrders.length" @click="handleBatchDelete">
          <font-awesome-icon icon="trash" />
          批量删除
        </el-button>
      </div>

      <el-table
        :data="orderList"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="订单ID" width="80" />
        <el-table-column prop="customerName" label="客户名称" width="120" />
        <el-table-column prop="gameName" label="游戏名称" width="150" />
        <el-table-column prop="amount" label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="购买日期" width="150">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">
              <font-awesome-icon icon="edit" />
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              <font-awesome-icon icon="trash" />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 订单表单对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500px"
        @close="handleDialogClose"
      >
        <el-form
          ref="orderFormRef"
          :model="orderForm"
          :rules="orderRules"
          label-width="100px"
        >
          <el-form-item label="客户" prop="customerId">
            <el-select v-model="orderForm.customerId" placeholder="请选择客户" style="width: 100%">
              <el-option
                v-for="customer in customerList"
                :key="customer.id"
                :label="customer.name"
                :value="customer.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏" prop="gameId">
            <el-select v-model="orderForm.gameId" placeholder="请选择游戏" style="width: 100%">
              <el-option
                v-for="game in gameList"
                :key="game.id"
                :label="game.name"
                :value="game.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="购买日期" prop="purchaseDate">
            <el-date-picker
              v-model="orderForm.purchaseDate"
              type="date"
              placeholder="选择购买日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/common/PageContainer.vue'
import { getOrderList, addOrder, updateOrder, deleteOrder } from '@/api/order'
import { getCustomerList } from '@/api/customer'
import { getGameList } from '@/api/game'

export default {
  components: { PageContainer },
  data() {
    return {
      orderList: [],
      customerList: [],
      gameList: [],
      loading: false,
      selectedOrders: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      orderForm: {
        id: null,
        customerId: null,
        gameId: null,
        purchaseDate: ''
      },
      orderRules: {
        customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
        gameId: [{ required: true, message: '请选择游戏', trigger: 'change' }],
        purchaseDate: [{ required: true, message: '请选择购买日期', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.fetchOrderList()
    this.fetchCustomerList()
    this.fetchGameList()
  },
  methods: {
    async fetchOrderList() {
      this.loading = true
      try {
        const res = await getOrderList()
        if (res && res.code === 200) {
          this.orderList = res.data || []
          this.total = this.orderList.length
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.$message.error('获取订单列表失败')
      } finally {
        this.loading = false
      }
    },
    async fetchCustomerList() {
      try {
        const res = await getCustomerList()
        if (res && res.code === 200) {
          this.customerList = res.data || []
        }
      } catch (error) {
        console.error('获取客户列表失败:', error)
      }
    },
    async fetchGameList() {
      try {
        const res = await getGameList()
        if (res && res.code === 200) {
          this.gameList = res.data || []
        }
      } catch (error) {
        console.error('获取游戏列表失败:', error)
      }
    },
    handleSelectionChange(selection) {
      this.selectedOrders = selection
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchOrderList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchOrderList()
    },
    handleAdd() {
      this.isEdit = false
      this.dialogTitle = '新增订单'
      this.orderForm = {
        id: null,
        customerId: null,
        gameId: null,
        purchaseDate: new Date().toISOString().split('T')[0]
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.dialogTitle = '编辑订单'
      this.orderForm = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确定要删除该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await deleteOrder(row.id)
        if (res && res.code === 200) {
          this.$message.success('删除成功')
          this.fetchOrderList()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除订单失败:', error)
          this.$message.error('删除订单失败')
        }
      }
    },
    async handleBatchDelete() {
      try {
        await this.$confirm(`确定要删除选中的 ${this.selectedOrders.length} 个订单吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const deletePromises = this.selectedOrders.map(order => deleteOrder(order.id))
        await Promise.all(deletePromises)
        
        this.$message.success('批量删除成功')
        this.fetchOrderList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('批量删除订单失败:', error)
          this.$message.error('批量删除订单失败')
        }
      }
    },
    async handleSubmit() {
      this.$refs.orderFormRef.validate(async (valid) => {
        if (valid) {
          try {
            // 获取客户和游戏信息，填充到表单中
            const customer = this.customerList.find(c => c.id === this.orderForm.customerId)
            const game = this.gameList.find(g => g.id === this.orderForm.gameId)
            
            const submitData = {
              ...this.orderForm,
              customerName: customer ? customer.name : '',
              gameName: game ? game.name : '',
              amount: game ? game.price : 0
            }
            
            let res
            if (this.isEdit) {
              res = await updateOrder(submitData)
            } else {
              res = await addOrder(submitData)
            }
            
            if (res && res.code === 200) {
              this.$message.success(this.isEdit ? '更新成功' : '添加成功')
              this.dialogVisible = false
              this.fetchOrderList()
            } else {
              this.$message.error(res.message || (this.isEdit ? '更新失败' : '添加失败'))
            }
          } catch (error) {
            console.error(this.isEdit ? '更新订单失败:' : '添加订单失败:', error)
            this.$message.error(this.isEdit ? '更新订单失败' : '添加订单失败')
          }
        }
      })
    },
    handleDialogClose() {
      this.$refs.orderFormRef && this.$refs.orderFormRef.resetFields()
    },
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return ''
      const date = new Date(dateTimeStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>