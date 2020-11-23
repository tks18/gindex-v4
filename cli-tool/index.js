#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const { prompt } = require('enquirer');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

const downNunzip = require('./helpers/unzip');
const initialRender = require('./displays/initial-render');
const { init } = require('./commands');

console.log(
  initialRender()
);

yargs(hideBin(process.argv))
  .command('deploy', 'Deploy Your Backend(for Now) will Support Frontend after Some time', {}, (argv) => {
    spinner(`Getting Ready Man!! Wait`, 2, function(){
      downNunzip();
    });
  })
  .command('init', 'summa', {}, (args) => {
    spinner(`Getting Ready Man!! Wait`, 2, false,function(){
      init();
    });
  })
  .argv
