/* eslint-disable no-param-reassign */

const BuildAppJSPlugin = require('./custom-plugins/buildAppJSPlugin');
const cdnDependencies = require('./custom-plugins/dependencies-cdn');

const cdn = {
  css: cdnDependencies.map((e) => e.css).filter((e) => e),
  js: cdnDependencies.map((e) => e.js).filter((e) => e),
};
const isProd = process.env.NODE_ENV === 'production';

module.exports = (config) => {
  config.plugin('html').tap((args) => {
    args[0].minify = {
      ...args[0].minify,
      caseSensitive: true,
      collapseWhitespace: false,
      conservativeCollapse: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      removeAttributeQuotes: false,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
    };
    return args;
  });
  config.plugin('BuildAppJSPlugin').use(BuildAppJSPlugin);
  config.plugin('html').tap((args) => {
    if (isProd) {
      args[0].cdn = cdn;
    } else {
      args[0].cdn = {
        js: cdnDependencies.filter((e) => e.name === '').map((e) => e.js),
        css: cdnDependencies.filter((e) => e.name === '').map((e) => e.css),
      };
    }
    args[0].inject = false;
    return args;
  });
};
