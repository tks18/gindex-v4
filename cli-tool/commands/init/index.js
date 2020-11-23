const checkGitExists = require('./checkGitExists');
const checkNpmExists = require('./checkNpmExists');
const installHerokuG = require('./installHerokuG');

module.exports = async () => {
  let gitCheck = await checkGitExists();
  if(gitCheck){
    console.log('Git Pass');
    let npmCheck = await checkNpmExists();
    if(npmCheck){
      console.log('NPM Pass');
      let herokuStat = await installHerokuG();
      if(herokuStat.res){
        console.log('Heroku Inited', herokuStat.output)
        process.exit();
      } else {
        console.log('Heroku Failed', herokuStat.output);
      }
    } else {
      console.log('Npm Failed');
    }
  } else {
    console.log('Git Failed');
  }
}
