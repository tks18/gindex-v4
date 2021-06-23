const { resolvers, plugins } = require('./webpack');

module.exports = {
  plugins: [...plugins],
  resolve: resolvers(__dirname),
  resolveLoader: {
    modules: ['node_modules'],
  },
  stats: 'normal',
};
