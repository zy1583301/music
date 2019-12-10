module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/hehe': {
        target: 'http://ustbhuangyi.com/music', // 目标服务器
        changeOrigin: true,
        pathRewrite: {
          '^/hehe': ''
        }
      },
      '/vkey': {
        target: 'https://u.y.qq.com/cgi-bin',
        changeOrigin: true,
        pathRewrite: {
          '^/vkey': ''
        }
      }
    }
  }
}
