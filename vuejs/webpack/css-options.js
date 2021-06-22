const package_data = require('../package.json');

const { production, development } = package_data.releases;
const buildType = process.env.VUE_APP_THEME;

let buildVersion = '';
if (buildType) {
  if (buildType === 'prod') {
    buildVersion = production;
  } else {
    buildVersion = development;
  }
} else {
  buildVersion = development;
}

const buildTheme = process.env.VUE_APP_THEME;
const cdn = process.env.VUE_APP_CDN_PATH;
const localBuild = process.env.VUE_APP_LOCAL;

const correctedCdn = localBuild
  ? '/'
  : cdn.replace('@master', `@${buildVersion}`).replace('THEME', buildTheme) ||
    '/';
process.env.VUE_APP_CDN_PATH = correctedCdn;

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  requireModuleExtension: true,
  loaderOptions: {
    sass: {
      sassOptions: {
        prependData: `$cdnPath: "${isProd ? correctedCdn : '/'}";`,
      },
    },
  },
};
