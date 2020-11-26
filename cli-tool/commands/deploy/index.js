const checkHerokuLogin = require('./checkHerokuLogin');
const createHerokuApp = require('./createHerokuApp');
const gitCheckoutHApp = require('./gitCheckoutHApp');
const createTMP = require('./createTMP');
const downloadUnzip = require('./downloadUnzip');
const initBackendnCommit = require('./initBackendnCommit');
const gitPushHeroku = require('./gitPushHeroku');
const inputPrompts = require('./inputPrompts');
const path = require('path');

module.exports = async () => {
  const checkHeroku = await checkHerokuLogin();
  console.log(checkHeroku);
  if(checkHeroku.res){
    const appname = await inputPrompts.appName();
    console.log(appname);
    if(appname.length > 1){
      const createApp = await createHerokuApp(appname);
      console.log(createApp);
      if(createApp.res){
        createTMP(async (tempPath, resPath) => {
          const downloadUnzipBackend = downloadUnzip(tempPath, async () => {
            const gitInitBack = await initBackendnCommit(resPath);
            console.log(gitInitBack);
            if(gitInitBack.res){
              const checkOutHeroku = await gitCheckoutHApp(appname, resPath);
              console.log(checkOutHeroku);
              if(checkOutHeroku.res){
                const pushHeroku = await gitPushHeroku(resPath);
                console.log(pushHeroku);
                if(pushHeroku.res){
                  process.exit()
                } else {

                }
              } else {

              }
            }  else {

            }
          });
        });
      } else {

      }
    } else {

    }
  } else {

  }
  // let summa = path.resolve('C:\Users\SUDHAR~1\AppData\Local\Temp\gindex-cli-F1dLUW\backend');
  // console.log(summa)
}
