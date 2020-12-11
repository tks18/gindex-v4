const checkGitExists = require('./checkGitExists');
const checkNpmExists = require('./checkNpmExists');
const installHerokuG = require('./installHerokuG');
const installWrangler = require('./installWrangler');
const spinner = require('../../helpers/spinner');
const checkHerokuLogin = require('../deploy/backend/checkHerokuLogin');
const deploy = require('../deploy');
const postInitMsg = require('./post-init');

const { Select } = require('enquirer');
const chalk = require('chalk');

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
              const deployDirect = new Select({
                name: 'deploy',
                message: 'Choose How You want to Deploy Frontend',
                choices: [
                  {
                    name: 'direct',
                    message: 'Directly Deploy to Cloudflare from the CLI Itself, Needs Cloudflare API Token',
                    value: 'direct',
                  },
                  {
                    name: 'indirect',
                    message: 'Copy the Code from the Tool and You Paste in the Worker',
                    value: 'indirect'
                  }
                ]
              }).run().then(answer => {
                if(answer == 'direct'){
                  spinner(true, 'Installing Cloudflare Worker Tools', 0, false, async(checkWrangleSpin) => {
                    const wranglerinstall = await installWrangler();
                    if(wranglerinstall.res){
                      checkWrangleSpin.stop();
                      console.log('\n'+
                        chalk.bold.green('Succesfully Installed Cloudflare Worker Tools') +
                        '\n'+
                        chalk.bold(wranglerinstall.output) +
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
                          deploy.backend();
                        } else {
                          console.log(postInitMsg);
                          process.exit();
                        }
                      })
                    } else {
                      checkWrangleSpin.stop();
                      console.log('\n'+
                        chalk.bold.red('Installing Cloudflare Tools Failed') +
                        '\n'+
                        chalk.bold('Failed with Following Error: '+ wranglerinstall.output) +
                        '\n'
                      );
                      process.exit();
                    }
                  })
                } else {
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
