const { chainWebpack, devServer, cssOptions } = require('./webpack');
const webpackConfig = require('./webpack.config');

module.exports = {
  publicPath: process.env.VUE_APP_CDN_PATH || '/',
  lintOnSave: true,
  css: cssOptions,
  chainWebpack,
  configureWebpack: webpackConfig,
  productionSourceMap: false,
  devServer,
};
