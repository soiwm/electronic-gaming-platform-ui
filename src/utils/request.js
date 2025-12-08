import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // 无需配置 baseURL，依赖代理前缀 /api
  timeout: 5000 // 请求超时时间
});

// 请求拦截器（可选：添加 token 等）
service.interceptors.request.use(
  (config) => {
    // 示例：添加登录 token（根据后端认证方式修改）
    // config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器（统一处理结果）
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 按后端统一返回格式处理（示例：code=200 为成功）
    if (res.code !== 200) {
      console.error('接口错误：', res.msg);
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    console.error('网络错误：', error.message);
    return Promise.reject(error);
  }
);

export default service;