const checkGitExists = require('./checkGitExists');
const checkNpmExists = require('./checkNpmExists');
const installHerokuG = require('./installHerokuG');
const spinner = require('../../helpers/spinner');

module.exports = () => {
  spinner(true, 'Checking Git Status and Version',0,false,async (gitSpin) => {
    let gitCheck = await checkGitExists();
    if(gitCheck){
      gitSpin.stop();
      console.log('Git Pass');
      spinner(true, 'Checking NPM Status and Version',0,false,async (npmSpin) => {
        let npmCheck = await checkNpmExists();
        if(npmCheck){
          npmSpin.stop();
          console.log('NPM Pass');
          spinner(true, 'Checking Heroku Global Status and Version',0,false,async (herokuSpin) => {
            let herokuStat = await installHerokuG();
            if(herokuStat.res){
              herokuSpin.stop();
              console.log('Heroku Inited', herokuStat.output)
              process.exit();
            } else {
              herokuSpin.stop();
              console.log('Heroku Failed', herokuStat.output);
              process.exit();
            }
          })
        } else {
          npmSpin.stop();
          console.log('Npm Failed');
        }
      })
    } else {
      gitSpin.stop();
      console.log('Git Failed');
    }
  });
}
