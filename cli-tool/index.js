#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const initialRender = require('./displays/initial-render');
const log = console.log;
const { spawn } = require('child_process')
const yargs = require("yargs");

log(
  initialRender()
);

const options = yargs
 .usage("Usage: -n <name>")
 .option("n", { alias: "name", describe: "Your name", type: "string" })
 .option("h", { alias: "help", describe: "Helper Class", type: "string"})
 .option("v", { alias: "version", describe: "Version", type: "String" })
 .option("d", { alias: "deploy", describe: "Deploy Your Index", type: "String" })
 .help()
 .argv;

if(options.name){
  spinner(`${options.name} Application in`, 0, function(){
    process.stdout.write('\n');
    process.exit(0);
  });
} else {
  spinner(`Initializing Application`, 2, function(){
    
  });
}
