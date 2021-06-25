const path = require('path');

const root = './src';
const assets = './src/assets';
const utils = './src/utils';
const api = './src/api';

module.exports = (dir) => ({
  alias: {
    '@': path.resolve(dir, root),
    '@assets': path.resolve(dir, assets),
    '@utils': path.resolve(dir, utils),
    '@api': path.resolve(dir, api),
  },
  extensions: ['.js', '.vue', '.json', '.css', '.scss'],
  symlinks: true,
  modules: ['node_modules'],
});
