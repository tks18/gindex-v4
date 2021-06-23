import themeConfigs from './themeConfigs';

const identifyTheme = (THEME) => {
  const defaultTheme = themeConfigs.filter(
    (theme) => theme.name === 'netflix-red',
  )[0];
  if (THEME) {
    const currentTheme = themeConfigs.filter((theme) => theme.name === THEME);
    if (currentTheme.length > 0) {
      return currentTheme[0];
    }
  }
  return defaultTheme;
};

export default function returnTheme() {
  const themes = [
    'carnation',
    'curious-blue',
    'emerald',
    'ice-cold',
    'konifer',
    'netflix-red',
    'kournikova',
    'mona-lisa',
    'persian-rose',
    'purple-heart',
    'purple-mountains-majesty',
    'salmon',
    'selective-yellow',
    'shamrock',
    'witch-haze',
  ];
  if (process.env.VUE_APP_THEME) {
    if (themes.includes(process.env.VUE_APP_THEME)) {
      import(`@/styles/${process.env.VUE_APP_THEME}/register.scss`);
    } else {
      import('@/styles/netflix-red/register.scss');
    }
  } else {
    import('@/styles/netflix-red/register.scss');
  }
  const themeConfig = identifyTheme(process.env.VUE_APP_THEME);
  return themeConfig;
}
