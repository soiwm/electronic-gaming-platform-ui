<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2 class="title">登录游戏管理平台</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="输入用户名" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="输入密码"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" class="full-btn">
            登录
          </el-button>
        </el-form-item>
        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const errorMsg = ref('')
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 处理登录提交
const handleLogin = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    errorMsg.value = ''
    try {
      console.log('开始登录，用户名：', form.username, '密码：', form.password); // 添加日志
      // 调用登录接口
      const res = await login({ username: form.username, password: form.password });
      // 登录成功：存储令牌和用户名（后端返回格式参考：{ code: 200, data: { token: 'xxx', username: 'xxx' } }）
      if (res.code === 200 && res.data.token) {
        sessionStorage.setItem('token', res.data.token); // 存储令牌
        sessionStorage.setItem('username', res.data.username); // 存储用户名（可选，用于页面显示）
        console.log('登录成功，令牌已存储');
        ElMessage.success('登录成功')
        // 跳转回登录前的页面（若无则跳首页）
        const redirect = router.currentRoute.value.query.redirect || '/';
        router.push(redirect);
      } else {
        errorMsg.value = res.msg || '登录失败';
        ElMessage.error(res.msg || '登录失败')
      }
    } catch (err) {
      errorMsg.value = '网络错误或服务器异常';
      ElMessage.error('网络错误或服务器异常')
      console.error('登录失败：', err);
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: #f5f7fa;
}
.login-card {
  width: 360px;
}
.title {
  text-align: center;
  margin-bottom: 24px;
}
.full-btn {
  width: 100%;
}
.error {
  color: #f56c6c;
  margin-top: 10px;
  text-align: center;
}
</style>