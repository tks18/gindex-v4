const inputPrompts = require('./inputPrompts');

module.exports = async () => {
  let objs = {};
  objs.appname = await inputPrompts.appname();
  let theme = await inputPrompts.themename();
  let variant = await inputPrompts.themeVariant();
  objs.theme = variant+"-"+theme;
  objs.frontendurl = await inputPrompts.fronturl();
  objs.backendurl = await inputPrompts.backurl();
  objs.favicon = await inputPrompts.favicon();
  objs.clientId = await inputPrompts.clientId();
  objs.clientSecret = await inputPrompts.clientSec();
  objs.refreshToken = await inputPrompts.refreshTok();
  objs.roots = [];
  let root0 = await inputPrompts.rootForm();
  objs.roots.push(root0);
  let moreRootsConf = await inputPrompts.confRoot();
  while (moreRootsConf){
    let nexRoot = await inputPrompts.rootForm();
    objs.roots.push(nexRoot);
    moreRootsConf = await inputPrompts.confRoot();
  }
  objs.netflixBlack = await inputPrompts.netBlack();
  objs.loadingImg = await inputPrompts.loadingImg();
  objs.homeImg = await inputPrompts.homeImg();
  objs.audioPoster = await inputPrompts.audioPoster();
  objs.footLogoConf =  await inputPrompts.footLogo();
  if(objs.footLogoConf){
    objs.footLogo = await inputPrompts.footImg();
  } else {
    objs.footLogo = ""
  }
  objs.rootStr = "";
  objs.roots.forEach((root) => {
    objs.rootStr += `{
      id: "${root.id}",
      name: "${root.name}",
      protect_file_link: true
    },`
  });
  return objs
}
