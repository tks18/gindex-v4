const checkHerokuLogin = require('./checkHerokuLogin');
const createHerokuApp = require('./createHerokuApp');
const gitCheckoutHApp = require('./gitCheckoutHApp');
const createTMP = require('./createTMP');
const downloadUnzip = require('./downloadUnzip');
const initBackendnCommit = require('./initBackendnCommit');
const gitPushHeroku = require('./gitPushHeroku');
const pushConfigKeys = require('./pushConfigKeys');
const inputPrompts = require('./inputPrompts');
const spinner = require('../../helpers/spinner');
const path = require('path');

module.exports = async () => {
  spinner(true, 'Check for Heroku Login Status', 0, false, async(herokuSpin) => {
    const checkHeroku = await checkHerokuLogin();
    herokuSpin.stop();
    console.log(checkHeroku);
    if(checkHeroku.res){
      const appname = await inputPrompts.appName();
      console.log(appname);
      if(appname.length > 1){
        spinner(true, `Creating your Heroku App with the name ${appname}`, 0, false, async(appSpin) => {
          const createApp = await createHerokuApp(appname);
          appSpin.stop();
          console.log(createApp);
          if(createApp.res){
            createTMP(async (tempPath, resPath) => {
              spinner(true, 'Downloading latest Backend Repo and Unzipping Now', 0, false, async(downSpin) => {
                const downloadUnzipBackend = downloadUnzip(tempPath, async () => {
                  downSpin.stop();
                  spinner(true, 'Initializing Repo for Deploying to Heroku', 0, false, async(initSpin) => {
                    const gitInitBack = await initBackendnCommit(resPath);
                    initSpin.stop();
                    console.log(gitInitBack);
                    if(gitInitBack.res){
                      spinner(true, 'Checking Heroku App for Deployment', 0, false, async(checkSpin) => {
                        const checkOutHeroku = await gitCheckoutHApp(appname, resPath);
                        checkSpin.stop();
                        console.log(checkOutHeroku);
                        if(checkOutHeroku.res){
                          spinner(true, 'Pushing the Latest Backend to Heroku App', 0, false, async(pushSpin) => {
                            const pushHeroku = await gitPushHeroku(resPath);
                            pushSpin.stop();
                            console.log(pushHeroku);
                            if(pushHeroku.res){
                              const configObj = await inputPrompts.configKeys();
                              console.log(configObj);
                              spinner(true, 'Pushing the Config Keys to Backend/Heroku', 0, false, async(configSpin) => {
                                const pushConfigObj = await pushConfigKeys(appname, resPath, configObj);
                                configSpin.stop();
                                console.log(pushConfigObj);
                                if(pushConfigObj.res){
                                  process.exit();
                                } else {

                                }
                              })
                            } else {

                            }
                          })
                        } else {

                        }
                      })
                    }  else {

                    }
                  })
                });
              })
            });
          } else {

          }
        })
      } else {

      }
    } else {

    }
  })
}
