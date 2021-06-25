module.exports = (indexCode, configOpts, latestVer) => {
  var data = `
var authConfig = {
  siteName: "${configOpts.appname}",
  hybridpass: "Not Required",
  version: "${latestVer}",
  theme: "${configOpts.theme}",
  frontendUrl: "${configOpts.frontendurl}",
  github_name: "tks18",
  github_repo: "gindex-v4",
  favicon: "${configOpts.favicon}",
  client_id: "${configOpts.clientId}",
  backendSite: "${configOpts.backendurl}",
  client_secret: "${configOpts.clientSecret}",
  refresh_token: "${configOpts.refreshToken}",
  roots: [
    ${configOpts.rootStr}
  ],
  default_gd: 0,
  files_list_page_size: 200,
  search_result_list_page_size: 50,
  enable_cors_file_down: false,
  enable_password_file_verify: true,
};

var themeOptions = {
  languages: 'en',
  netflix_home: true,
  prefer_netflix_black: ${configOpts.netflixBlack},
  loading_image: "${configOpts.loadingImg}",
  home_background_image: "${configOpts.homeImg}",
  audio: {
    default_poster: "${configOpts.audioPoster}",
  },
  footer_data: {
    footer_logo: ${configOpts.footLogoConf},
    footer_logo_link: "${configOpts.footLogo}",
  },
  render: {
    head_md: false,
    readme_md: false,
    desc: true,
  }
}
`
  let replacedData = indexCode.replace(/\/\/ =======Options START=======([\s\S]*)\/\/ =======Options END=======/, data)
  return replacedData
}
