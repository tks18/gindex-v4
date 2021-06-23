module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: false,
        targets: 'last 2 versions',
      },
    ],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
  plugins: ['@babel/plugin-syntax-dynamic-import'],
};
