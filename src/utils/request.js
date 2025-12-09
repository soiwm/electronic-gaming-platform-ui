import axios from 'axios';
import router from '@/router';

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // 无需配置 baseURL，依赖代理前缀 /api
  //  baseURL: import.meta.env.VITE_API_BASE_URL, // 后端接口基础地址（从环境变量读取）
  timeout: 5000 // 请求超时时间
});

// -------------------------- 请求拦截器：添加 JWT 令牌 --------------------------
service.interceptors.request.use(
  (config) => {
    // 排除不需要认证的接口（登录、登出）
    const whiteList = ['/auth/login', '/auth/logout'];
    if (!whiteList.includes(config.url)) {
      // 从存储中获取令牌
      const token = sessionStorage.getItem('token');
      if (token) {
        // 添加 Authorization 头：Bearer + 令牌（注意空格）
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // 请求发送失败（如网络错误）
    return Promise.reject(error);
  }
);

// -------------------------- 响应拦截器：处理令牌失效 --------------------------
service.interceptors.response.use(
  (response) => {
    // 正常响应：直接返回数据（根据后端统一格式调整）
    return response.data;
  },
  (error) => {
    // 错误响应：处理 401 令牌失效
    if (error.response && error.response.status === 401) {
      // 清空存储的令牌
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username'); // 同时清除用户名等用户信息
      // 跳转登录页（携带当前路径，登录后可跳转回原页面）
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      });
    }
    // 其他错误（如 404、500）：返回错误信息
    return Promise.reject(error);
  }
);

export default service;