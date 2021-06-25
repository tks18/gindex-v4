const {
  externals,
  default: detailed,
} = require('./custom-plugins/dependencies-cdn');

exports.chainWebpack = require('./chain-webpack');
exports.loaders = require('./loaders');
exports.optimizations = require('./optimizations');
exports.cssOptions = require('./css-options');
exports.devServer = require('./dev-server');
exports.plugins = require('./plugins');
exports.resolvers = require('./resolvers');

exports.externals = {
  libs: externals,
  json: detailed,
};
