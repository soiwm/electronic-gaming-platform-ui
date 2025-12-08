import request from '@/utils/request';

// 游戏列表接口：GET /api/customer/list → 转发到 http://localhost:8080/customer/list
export function getCustomerList() {
  return request({
    url: '/api/customer/list', // 带代理前缀 /api
    method: 'get'
  });
}

// 添加客户接口：POST /api/customer/add → 转发到 http://localhost:8080/customer/add
export function addCustomer(customerData) {
  return request({
    url: '/api/customer/add',
    method: 'post',
    data: customerData // 请求体参数（后端用 @RequestBody 接收）
  });
}