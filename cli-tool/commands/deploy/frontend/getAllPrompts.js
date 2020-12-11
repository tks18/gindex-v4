const inputPrompts = require('./inputPrompts');

const open = require('open');
const chalk = require('chalk');

const authUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=202264815644.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&approval_prompt=auto';

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
  let getAuthCode = await inputPrompts.getAuthCode();
  if(getAuthCode){
    console.log(chalk.yellow.bold("\nOpening Auth Code Generator in Your Browser\n"))
    await open(authUrl);
  }
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
