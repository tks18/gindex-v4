const CompressionWebpackPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
const JavaScriptObfuscator = require('webpack-obfuscator');

const isProd = process.env.NODE_ENV === 'production';

const prodPlugins = [
  new CompressionWebpackPlugin({
    filename: '[path].br',
    algorithm: 'brotliCompress',
    compressionOptions: {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    },
    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
    threshold: 10240,
    minRatio: 0.8,
  }),
  new JavaScriptObfuscator(
    {
      compact: false,
      rotateStringArray: true,
      stringArray: true,
      shuffleStringArray: true,
      numbersToExpressions: true,
      simplify: true,
      splitStrings: true,
    },
    [
      'worker.js',
      'js/chunk-vendors.*.js',
      'js/chunk-vendors.*.js.br',
      'js/chunk-vendors.*.js.map',
    ],
  ),
];

module.exports = isProd ? prodPlugins : [];
