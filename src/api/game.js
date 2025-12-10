import request from '@/utils/request';

// 查询游戏列表
export function getGameList() {
  return request({
    url: '/api/game/list',
    method: 'get'
  });
}

// 根据 ID 查询游戏
export function getGameById(id) {
  return request({
    url: `/api/game/${id}`, 
    method: 'get'
  });
}

// 新增游戏
export function addGame(gameData) {
  return request({
    url: '/api/game/add',
    method: 'post',
    data: gameData
  });
}

// 更新游戏
export function updateGame(gameData) {
  return request({
    url: '/api/game/update',
    method: 'put', 
    data: gameData
  });
}

// 删除游戏
export function deleteGame(id) {
  return request({
    url: `/api/game/delete/${id}`,
    method: 'delete'
  });
}

// 上传游戏logo
export function uploadGameLogo(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    url: '/api/upload/game/logo',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}