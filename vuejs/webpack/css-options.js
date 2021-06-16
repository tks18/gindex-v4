const buildVersion = require('../package.json').cdnVersion;
const buildTheme = process.env.VUE_APP_THEME;
const cdn = process.env.VUE_APP_CDN_PATH;
const correctedCdn =
  cdn.replace('@master', '@' + buildVersion).replace('THEME', buildTheme) ||
  '/';
process.env.VUE_APP_CDN_PATH = correctedCdn;
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  loaderOptions: {
    sass: {
      prependData: `$cdnPath: "${isProd ? correctedCdn : '/'}";`,
    },
  },
};
