const checkGitExists = require('./checkGitExists');
const checkNpmExists = require('./checkNpmExists');
const installHerokuG = require('./installHerokuG');
const spinner = require('../../helpers/spinner');
const store = require('../../helpers/configStore');
const checkHerokuLogin = require('../deploy/backend/checkHerokuLogin');
const deploy = require('../deploy');
const postInitMsg = require('./post-init');

const { Select, prompt } = require('enquirer');
const chalk = require('chalk');

module.exports = async () => {
  if(store.get('name') == 'Anonymous'){
    const name = await prompt({
      type: 'input',
      name: 'youname',
      message: 'Enter You Name',
    })
    store.set('name', name.youname);
  }
  console.log(chalk.bold.green("\nHello there "+store.get('name')+" !!\n"))
  if(store.get('init.checked')){
    const name = await prompt({
      type: 'input',
      name: 'checkAgain',
      message: 'It Looks Like the You have Already Initialized, Do You want to Check Again (y/n)',
    })
    if(name.checkAgain.toLowerCase() == 'n'){
      return;
    }
  }
  spinner(true, 'Checking Git Status and Version',0,false,async (gitSpin) => {
    let gitCheck = await checkGitExists();
    if(gitCheck.res){
      store.set('init.git', gitCheck);
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
          store.set('init.npm', npmCheck);
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
              store.set('init.heroku', herokuStat);
              herokuSpin.stop();
              console.log('\n'+
                chalk.bold.green('Succesfully Initiated Heroku & Updated') +
                '\n'+
                chalk.bold(herokuStat.output) +
                '\n\n'
              )
              store.set('init.checked', true);
              spinner(true, 'Checking Heroku Login Status',0,false,async (checkHerSpin) => {
                const checkHeroku = await checkHerokuLogin();
                checkHerSpin.stop();
                if(checkHeroku.res){
                  console.log('\n'+
                    chalk.bold.green('It Looks like Heroku is Authorized and Now Starting the Deployment Process.') +
                    '\n'
                  )
                  deploy.backend();
                } else {
                  console.log(postInitMsg);
                  process.exit();
                }
              })
            } else {
              herokuSpin.stop();
              store.set('init.heroku', herokuStat);
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
          store.set('init.npm', npmCheck);
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
      store.set('init.git', gitCheck);
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
