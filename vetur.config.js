module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': false,
  },
  projects: [
    {
      root: './vuejs',
      package: './package.json',
      snippetFolder: './vuejs/.vscode/vetur/snippets',
      globalComponents: ['./vuejs/src/components/**/*.vue'],
    },
  ],
};
