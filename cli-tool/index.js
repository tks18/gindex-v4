#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const initialRender = require('./displays/initial-render');
const { init, deploy, update, configure } = require('./commands');

console.log(
  initialRender()
);

yargs(hideBin(process.argv))
  .command('init', 'Initialize the Deployer (Will Check for all the Preqrequisites)', {}, (args) => {
    init();
  })
  .command('deploy', 'Deploy Your Backend(for Now) will Support Frontend after Some time', {}, (argv) => {
    spinner(false, `Getting Ready Man!! Wait`, 2, false, function(){
      deploy();
    });
  })
  .command('update', 'Update Your Backend to latest Version', {}, (argv) => {
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
