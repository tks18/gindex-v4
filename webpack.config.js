const { externals, resolvers, plugins } = require('./webpack');

module.exports = {
  externals: externals.libs,
  plugins: [...plugins],
  resolve: resolvers(__dirname),
  resolveLoader: {
    modules: ['node_modules'],
  },
  stats: 'normal',
};
