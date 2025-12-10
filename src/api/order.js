import request from '@/utils/request';

// 查询订单列表
export function getOrderList() {
  return request({
    url: '/api/order/list',
    method: 'get'
  });
}

// 根据 ID 查询订单
export function getOrderById(id) {
  return request({
    url: `/api/order/${id}`,
    method: 'get'
  });
}

// 新增订单
export function addOrder(orderData) {
  return request({
    url: '/api/order/add',
    method: 'post',
    data: orderData
  });
}

// 更新订单
export function updateOrder(orderData) {
  return request({
    url: '/api/order/update',
    method: 'put',
    data: orderData
  });
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/api/order/delete/${id}`,
    method: 'delete'
  });
}

// 获取销量排行榜
export function getSalesRanking() {
  return request({
    url: '/api/statistics/sales-ranking',
    method: 'get'
  });
}

// 获取用户年龄分级统计
export function getAgeDistribution() {
  return request({
    url: '/api/statistics/age-distribution',
    method: 'get'
  });
}