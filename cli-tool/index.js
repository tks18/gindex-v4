#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const initialRender = require('./displays/initial-render');
const execa = require('execa');
const { prompt } = require('enquirer');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

const downNunzip = require('./helpers/unzip');
const log = console.log;


log(
  initialRender()
);

// const options = yargs(hideBin(process.argv))
//   .command('serve [port]', 'start the server', (yargs) => {
//     yargs
//       .positional('port', {
//         describe: 'port to bind on',
//         default: 5000
//       })
//   }, (argv) => {
//     console.log("Super", argv.port);
//   })
//   .option('verbose', {
//     alias: 'v',
//     type: 'boolean',
//     description: 'Run with verbose logging'
//   })
//   .argv

const options = yargs
 .option("n", { alias: "name", describe: "Your name", type: "string" })
 .option("h", { alias: "help", describe: "Helper Class", type: "string"})
 .option("v", { alias: "version", describe: "Version", type: "String" })
 .option("d", { alias: "deploy", describe: "Deploy Your Index", type: "String" })
 .help()
 .argv;

if(options.serve){
  spinner(`${options.name} Application in`, 0, function(){
    log('sada', options)
  });
} else if(options.deploy) {
  spinner(`Initializing Application`, 2, function(){
    downNunzip();
  });
}
