const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 保留原有的路径别名配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  
  // 核心：配置代理转发（对接 Spring Boot 8080 端口）
  devServer: {
    port: 9090, // 前端项目端口（避免和后端 8080 冲突）
    open: true,
    host: '0.0.0.0',
    proxy: {
      // 配置代理前缀：所有以 /api 开头的请求都会被转发到后端
      '/api': {
        target: 'http://localhost:8080', // 后端 Spring Boot 项目地址（本地）
        changeOrigin: true, // 开启跨域支持（必须）
        pathRewrite: {
          '^/api': '' // 可选：去掉请求路径中的 /api 前缀（根据后端接口实际情况配置）
          // 例：前端请求 /api/game/list → 后端实际接收 /game/list
          // 若后端接口本身就带 /api 前缀，可删除这行配置
        },
        // 可选：配置支持 websocket（如果后端有 websocket 接口）
        ws: true,
        // 可选：忽略 SSL 证书错误（如果后端用了 HTTPS 且是自签名证书）
        secure: false
      }
    }
  }
});