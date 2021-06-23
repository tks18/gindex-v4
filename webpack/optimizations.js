const Minimizers = require('./minimizers');

const isProd = process.env.NODE_ENV === 'production';

const productionConfig = {
  splitChunks: {
    chunks: 'async',
    minSize: 20000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    enforceSizeThreshold: 50000,
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
  minimize: true,
  minimizer: [...Minimizers],
};

const devConfig = {
  minimize: false,
  minimizer: [...Minimizers],
};

module.exports = isProd ? productionConfig : devConfig;
