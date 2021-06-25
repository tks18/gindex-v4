const checkHerokuLogin = require('./checkHerokuLogin');
const createHerokuApp = require('./createHerokuApp');
const gitCheckoutHApp = require('./gitCheckoutHApp');
const createTMP = require('./createTMP');
const downloadUnzip = require('./downloadUnzip');
const initBackendnCommit = require('./initBackendnCommit');
const gitPushHeroku = require('./gitPushHeroku');
const pushConfigKeys = require('./pushConfigKeys');
const inputPrompts = require('./inputPrompts');
const herokuNotAuthMess = require('../../init/post-init');
const spinner = require('../../../helpers/spinner');

const chalk = require('chalk');

module.exports = async () => {
  spinner(true, 'Check for Heroku Login Status', 0, false, async(herokuSpin) => {
    const checkHeroku = await checkHerokuLogin();
    herokuSpin.stop();
    if(checkHeroku.res){
      console.log(
        '\n'+
        chalk.bold.green("Heroku Login Successfull")+'\n\n'+
        chalk.white(checkHeroku.output)+
        '\n'
      );
      const appname = await inputPrompts.appName();
      if(appname.length > 1){
        spinner(true, `Creating your Heroku App with the name ${appname}`, 0, false, async(appSpin) => {
          const createApp = await createHerokuApp(appname);
          appSpin.stop();
          if(createApp.res){
            console.log(
              '\n'+
              chalk.bold.green("Heroku App Successfully Created")+'\n\n'+
              chalk.white(createApp.output)+
              '\n'
            );
            createTMP(async (tempPath, resPath) => {
              spinner(true, 'Downloading latest Backend Repo and Unzipping Now', 0, false, async(downSpin) => {
                const downloadUnzipBackend = downloadUnzip(tempPath, async () => {
                  downSpin.stop();
                  console.log(
                    '\n'+
                    chalk.bold.green("Download and Unzip of Backend Successfull")+'\n\n'+
                    chalk.white("Backend downloaded and Unzipped in "+tempPath+". Don\'t Worry this will be Autocleaned after this Process.")+
                    '\n'
                  );
                  spinner(true, 'Initializing Repo for Deploying to Heroku', 0, false, async(initSpin) => {
                    const gitInitBack = await initBackendnCommit(resPath);
                    initSpin.stop();
                    if(gitInitBack.res){
                      console.log(
                        '\n'+
                        chalk.bold.green("Initialized Backend and Ready to Deploy to Heroku")+'\n\n'+
                        chalk.white(gitInitBack.initOut+'\n'+gitInitBack.addOut+'\n'+gitInitBack.commitOut)+
                        '\n'
                      );
                      spinner(true, 'Checking Heroku App for Deployment', 0, false, async(checkSpin) => {
                        const checkOutHeroku = await gitCheckoutHApp(appname, resPath);
                        checkSpin.stop();
                        if(checkOutHeroku.res){
                          console.log(
                            '\n'+
                            chalk.bold.green("Sucessfully Initialized the Heroku app for Backend Deployment")+'\n\n'+
                            chalk.white(checkOutHeroku.output)+
                            '\n'
                          );
                          spinner(true, 'Pushing the Latest Backend to Heroku App', 0, false, async(pushSpin) => {
                            const pushHeroku = await gitPushHeroku(resPath);
                            pushSpin.stop();
                            if(pushHeroku.res){
                              console.log(
                                '\n'+
                                chalk.bold.green("Pushing to Heroku Successfull. Here is the Build Process.")+'\n\n'+
                                chalk.white(pushHeroku.output)+
                                '\n'
                              );
                              const configObj = await inputPrompts.configKeys();
                              spinner(true, 'Pushing the Config Keys to Backend/Heroku', 0, false, async(configSpin) => {
                                const pushConfigObj = await pushConfigKeys(appname, resPath, configObj);
                                configSpin.stop();
                                if(pushConfigObj.res){
                                  console.log(
                                    '\n'+
                                    chalk.bold.green("Config Keys are Successfully Set. wait for 2 mins for the Build Process to Finish.")+'\n\n'+
                                    chalk.white(pushConfigObj.output)+'\n\n'+
                                    chalk.yellow.bold(`You can Access the backend in the following Address for Creating the Super User (Future it Will be Supported Here Itself)\n>> https://${appname}.herokuapp.com`)+
                                    '\n'
                                  );
                                  process.exit();
                                } else {
                                  console.log(
                                    '\n'+
                                    chalk.bold.red("Config Keys are Not Successfully Set with the Following Error")+'\n\n'+
                                    chalk.white(pushConfigObj.output)+
                                    '\n'
                                  );
                                  process.exit();
                                }
                              })
                            } else {
                              console.log(
                                '\n'+
                                chalk.bold.red("Pushing to Backend Failed with the Following Error")+'\n\n'+
                                chalk.white(pushHeroku.output)+
                                '\n'
                              );
                              process.exit();
                            }
                          })
                        } else {
                          console.log(
                            '\n'+
                            chalk.bold.red("Initializing Heroku App Failed with the Following Error")+'\n\n'+
                            chalk.white(checkOutHeroku.output)+
                            '\n'
                          );
                          process.exit();
                        }
                      })
                    }  else {
                      console.log(
                        '\n'+
                        chalk.bold.red("Initializing Backend Zip Failed with the Following Error")+'\n\n'+
                        chalk.white(gitInitBack.output)+
                        '\n'
                      );
                      process.exit();
                    }
                  })
                });
              })
            });
          } else {
            console.log(
              '\n'+
              chalk.bold.red("Failed to Create App in Heroku with the Following Error")+'\n\n'+
              chalk.white(createApp.output)+
              '\n'
            );
            process.exit();
          }
        })
      } else {
        console.log(
          '\n'+
          chalk.bold.red("Appname Should be More than Atleast 1 Chars")+'\n'
        );
        process.exit();
      }
    } else {
      console.log(
        '\n'+
        chalk.bold.red("It Looks like You are not Logged in to Heroku")+'\n\n'+
        chalk.white(checkHeroku.output)+
        '\n'+
        herokuNotAuthMess
      );
      process.exit();
    }
  })
}
