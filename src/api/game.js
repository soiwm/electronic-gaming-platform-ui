import request from '@/utils/request';

// 游戏列表接口：GET /api/game/list → 转发到 http://localhost:8080/game/list
export function getGameList() {
  return request({
    url: '/api/game/list', // 带代理前缀 /api
    method: 'get'
  });
}

// 添加游戏接口：POST /api/game/add → 转发到 http://localhost:8080/game/add
export function addGame(gameData) {
  return request({
    url: '/api/game/add',
    method: 'post',
    data: gameData // 请求体参数（后端用 @RequestBody 接收）
  });
}