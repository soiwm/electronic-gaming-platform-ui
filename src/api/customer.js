import request from '@/utils/request';

// 查询客户列表
export function getCustomerList() {
  return request({
    url: '/api/customer/list',
    method: 'get'
  });
}

// 根据 ID 查询客户
export function getCustomerById(id) {
  return request({
    url: `/api/customer/${id}`,
    method: 'get'
  });
}

// 新增客户
export function addCustomer(customerData) {
  return request({
    url: '/api/customer/add',
    method: 'post',
    data: customerData
  });
}

// 更新客户
export function updateCustomer(customerData) {
  return request({
    url: '/api/customer/update',
    method: 'put',
    data: customerData
  });
}

// 删除客户
export function deleteCustomer(id) {
  return request({
    url: `/api/customer/delete/${id}`,
    method: 'delete'
  });
}