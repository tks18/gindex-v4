const { chainWebpack, devServer, cssOptions } = require('./webpack');
const webpackConfig = require('./webpack.config');

const localBuild = process.env.VUE_APP_LOCAL
module.exports = {
  publicPath: localBuild ? '/' : process.env.VUE_APP_CDN_PATH || '/',
  runtimeCompiler: true,
  lintOnSave: true,
  css: cssOptions,
  chainWebpack,
  configureWebpack: webpackConfig,
  productionSourceMap: false,
  devServer,
};
