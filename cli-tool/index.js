#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const initialRender = require('./displays/initial-render');
const { init, deploy } = require('./commands');

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
  .argv

if(yargs.argv._.length < 1){
  yargs.showHelp();
}
