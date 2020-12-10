const clipboardy = require('clipboardy');

module.exports = (indexCode, configOpts, latestVer) => {
  var data = `
var authConfig = {
  siteName: "",
  hybridpass: "Not Required",
  version: "SUmma",
  theme: "SUmma",
  frontendUrl: "https://glorytoheaven.tk",
  github_name: "tks18",
  github_repo: "gindex-v4",
  favicon: "https://raw.githubusercontent.com/tks18/infozy/develop/favicon.ico",
  client_id: "client_id",
  backendSite: "http://localhost:3000",
  client_secret: "client_id",
  refresh_token: "refresh_token",
  roots: [
    ${configOpts}
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
  prefer_netflix_black: false,
  loading_image: "https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif",
  home_background_image: "https://assets.nflxext.com/ffe/siteui/vlv3/bd777948-0e8f-4f7f-b0bf-f7e0ee0875e5/cd5b9c59-183b-4b03-9caf-934bc11565b8/IN-en-20200627-popsignuptwoweeks-perspective_alpha_website_small.jpg",
  audio: {
    default_poster: "https://i.ibb.co/Hx3ZqLm/giphy.gif",
  },
  footer_data: {
    footer_logo: true,
    footer_logo_link: "https://i.ibb.co/Hx3ZqLm/giphy.gif",
  },
  render: {
    head_md: false,
    head_md_link: 'https://cdn.jsdelivr.net/gh/tks18/gindex-v4@v7.5.2/vuejs/dist/HEAD.md',
    readme_md: false,
    readme_md_link: "https://cdn.jsdelivr.net/gh/tks18/gindex-v4@v7.5.2/vuejs/dist/README.md",
    desc: true,
  }
}
`
  let replacedData = indexCode.replace(/\/\/ =======Options START=======([\s\S]*)\/\/ =======Options END=======/, data)
  clipboardy.writeSync(replacedData);
  console.log(replacedData)
}
