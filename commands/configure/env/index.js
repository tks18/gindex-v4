const checkHerokuLogin = require('./checkHerokuLogin');
const pushConfigKeys = require('./pushConfigKeys');
const herokuNotAuthMess = require('../../init/post-init');
const inputPrompts = require('./inputPrompts');
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
      console.log(appname);
      if(appname.length > 1){
        const envName = await inputPrompts.getEnvName();
        if(envName.length > 1){
          const envValue = await inputPrompts.envValue(envName);
          spinner(true, 'Pushing the Config Keys to Backend/Heroku', 0, false, async(configSpin) => {
            const pushConfigObj = await pushConfigKeys(appname, {
              envName: envName,
              envVal: envValue
            });
            configSpin.stop();
            if(pushConfigObj.res){
              console.log(
                '\n'+
                chalk.bold.green("Config Keys are Successfully Set. wait for 2 mins for the Build Process to Finish.")+'\n\n'+
                chalk.white(pushConfigObj.output)+'\n\n'+
                chalk.yellow.bold(`You can Access the backend in the following Address for Creating the Super User\n>> https://${appname}.herokuapp.com`)+
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
            chalk.bold.red("Select appropriate ENV Name")+'\n'
          );
          process.exit();
        }
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
