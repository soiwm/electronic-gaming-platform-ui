<template>
  <div class="login-container">
    <h2>游戏平台登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>用户名：</label>
        <input v-model="username" type="text" required placeholder="admin/user">
      </div>
      <div>
        <label>密码：</label>
        <input v-model="password" type="password" required placeholder="admin123/user123">
      </div>
      <button type="submit">登录</button>
      <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';

const router = useRouter();
const username = ref(''); // 用户名绑定
const password = ref(''); // 密码绑定
const errorMsg = ref(''); // 错误提示

// 处理登录提交
const handleLogin = async () => {
  try {
    errorMsg.value = '';
    // 调用登录接口
    const res = await login({ username: username.value, password: password.value });
     console.log('开始登录，用户名：', username.value, '密码：', password.value); // 添加日志
    // 登录成功：存储令牌和用户名（后端返回格式参考：{ code: 200, data: { token: 'xxx', username: 'xxx' } }）
    if (res.code === 200 && res.data.token) {
      sessionStorage.setItem('token', res.data.token); // 存储令牌
      sessionStorage.setItem('username', res.data.username); // 存储用户名（可选，用于页面显示）
      console.log('登录成功，令牌已存储');
      // 跳转回登录前的页面（若无则跳首页）
      const redirect = router.currentRoute.value.query.redirect || '/';
      router.push(redirect);
    } else {
      errorMsg.value = res.msg || '登录失败';
    }
  } catch (err) {
    errorMsg.value = '网络错误或服务器异常';
    console.error('登录失败：', err);
  }
};
</script>

<style scoped>
/* 简单样式，可自定义 */
.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
}
form div {
  margin: 10px 0;
}
input {
  width: 100%;
  padding: 8px;
}
button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>