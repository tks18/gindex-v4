const { loaders, optimizations, resolvers, plugins } = require('./webpack');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [...loaders],
  },
  optimization: optimizations,
  plugins: [...plugins],
  resolve: resolvers(__dirname),
  resolveLoader: {
    modules: ['node_modules'],
  },
  stats: 'normal',
};
