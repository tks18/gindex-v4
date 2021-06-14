#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const initialRender = require('./displays/initial-render');
const { Select } = require('enquirer');
const { init, deploy, update, configure } = require('./commands');

console.log(
  initialRender()
);

yargs(hideBin(process.argv))
  .command('init', 'Initialize the Deployer (Will Check for all the Preqrequisites)', {}, (args) => {
    init();
  })
  .command('deploy [type]', 'Deploy Your Backend(for Now) will Support Frontend after Some time', {}, (args) => {
    spinner(false, `Getting Ready Man!! Wait`, 2, false, function(){
      if(args.type != 'frontend' || args.type != 'backend'){
        const deployType = new Select({
          name: 'deploytype',
          message: 'Select the Part which You want to Deploy',
          choices: [
            'Frontend',
            'Backend',
          ]
        }).run().then(answer => {
          if(answer.toLowerCase() == 'backend'){
            deploy.backend();
          } else if(answer.toLowerCase() == 'frontend'){
            deploy.frontend();
          }
        }).catch(e => {
          console.log("Error Occured in the Instance");
          process.exit();
        })
      } else {
        if(args.type == "frontend"){
          deploy.frontend();
        } else if(args.type == "backend"){
          deploy.backend();
        }
      }
    });
  })
  .command('update', 'Update Your Backend to latest Version', {}, (args) => {
    spinner(false, `Initializing Now`, 2, false, function(){
      update();
    });
  })
  .command('configure [env]', "Update Your Backend Variables", {}, (args) => {
    if(args.env){
      configure.env();
    } else {
      console.log("More Options Will be Supported later. For Now only Backend Variables Configuration is Enabled")
    }
  })
  .argv

if(yargs.argv._.length < 1){
  yargs.showHelp();
}
