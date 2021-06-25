/* eslint-disable */

const loaders = [
  {
    test: /\.(png|svg|jpg|gif|pdf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  {
    test: /\.scss$/,
    use: [
      {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
          sassOptions: {
            fiber: require('fibers'),
          },
        },
      },
    ],
  },
];

module.exports = loaders;
