/* eslint-disable */

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const minimizers = [
  new CssMinimizerPlugin({
    minimizerOptions: {
      preset: [
        'default',
        {
          discardComments: { removeAll: true },
        },
      ],
    },
  }),
];

module.exports = minimizers;
