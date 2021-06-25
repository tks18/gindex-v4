const publicPath = process.env.VUE_APP_CDN_PATH || '/';

module.exports = {
  publicPath,
  proxy: {
    '/api': {
      target: 'https://glorytoheaven.tk/',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
};
