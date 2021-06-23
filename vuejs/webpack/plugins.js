const CompressionWebpackPlugin = require('compression-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

const isProd = process.env.NODE_ENV === 'production';

const prodPlugins = [
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: false,
  }),
  new JavaScriptObfuscator(
    {
      compact: true,
      disableConsoleOutput: true,
      rotateStringArray: true,
      shuffleStringArray: true,
    },
    ['app.js'],
  ),
];

module.exports = isProd ? prodPlugins : [];
