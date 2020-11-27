const checkGitExists = require('./checkGitExists');
const checkNpmExists = require('./checkNpmExists');
const installHerokuG = require('./installHerokuG');
const chalk = require('chalk');
const spinner = require('../../helpers/spinner');
const checkHerokuLogin = require('../deploy/checkHerokuLogin');
const deploy = require('../deploy');
const postInitMsg = require('./post-init');

module.exports = () => {
  spinner(true, 'Checking Git Status and Version',0,false,async (gitSpin) => {
    let gitCheck = await checkGitExists();
    if(gitCheck.res){
      gitSpin.stop();
      console.log('\n'+
        chalk.bold.green('Git Status') +
        '\n'+
        chalk.bold('Git is Available and Version: '+ gitCheck.output) +
        '\n'
      );
      spinner(true, 'Checking NPM Status and Version',0,false,async (npmSpin) => {
        let npmCheck = await checkNpmExists();
        if(npmCheck.res){
          npmSpin.stop();
          console.log('\n'+
            chalk.bold.green('NPM Status') +
            '\n'+
            chalk.bold('NPM is Available and Version: '+ npmCheck.output) +
            '\n'
          );
          spinner(true, 'Checking Heroku Global Status and Version',0,false,async (herokuSpin) => {
            let herokuStat = await installHerokuG();
            if(herokuStat.res){
              herokuSpin.stop();
              console.log('\n'+
                chalk.bold.green('Succesfully Initiated Heroku & Updated') +
                '\n'+
                chalk.bold(herokuStat.output) +
                '\n\n'
              )
              spinner(true, 'Checking Heroku Login Status',0,false,async (checkHerSpin) => {
                const checkHeroku = await checkHerokuLogin();
                checkHerSpin.stop();
                if(checkHeroku.res){
                  console.log('\n'+
                    chalk.bold.green('It Looks like Heroku is Authorized and Now Starting the Deployment Process.') +
                    '\n'
                  )
                  deploy();
                } else {
                  console.log(postInitMsg);
                  process.exit();
                }
              })
            } else {
              herokuSpin.stop();
              console.log('\n'+
                chalk.bold.red('Installing / Updating Heroku Failed') +
                '\n'+
                chalk.bold('Failed with Following Error: '+ herokuStat.output) +
                '\n'
              );
              process.exit();
            }
          })
        } else {
          npmSpin.stop();
          console.log('\n'+
            chalk.bold.red('NPM Failed') +
            '\n'+
            chalk.bold('Npm Failed with Following Error: '+ npmCheck.output) +
            '\n'
          );
          process.exit();
        }
      })
    } else {
      gitSpin.stop();
      console.log('\n'+
        chalk.bold.red('Git Failed') +
        '\n'+
        chalk.bold('Git is Unavailable: '+ gitCheck.output) +
        '\n'
      );
      process.exit();
    }
  });
}
