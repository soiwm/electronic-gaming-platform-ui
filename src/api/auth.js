import request from '@/utils/request';

// 登录接口（参数：用户名、密码）
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data // 请求体：{ username: 'xxx', password: 'xxx' }
  });
}

// 登出接口（需要携带令牌，请求拦截器自动添加）
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  });
}