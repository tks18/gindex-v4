#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const initialRender = require('./displays/initial-render');
const log = console.log;
const Path = require('path');
const execa = require('execa');
const yargs = require("yargs");
const { prompt } = require('enquirer');
const unzipper = require('unzipper');
const fs = require('fs');
const axios = require('axios');

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

  });
} else {
  spinner(`Initializing Application`, 2, function(){
    (async () => {
      try {
        const response = await prompt({
          type: 'input',
          name: 'username',
          message: 'What is your username?'
        });
        console.log(response);
        // const resp = await execa('git', ['clone', '--branch', response.username, 'https://github.com/tks18/tks18.git', '__temp__']);
        // console.log(resp);
        await axios({
            method: "get",
            url: 'https://github.com/tks18/gindex-v4/releases/download/backend-v2.2.3/gindex-backend-2.2.3.zip',
            responseType: "stream"
        }).then(resp => {
          resp.data.pipe(fs.createWriteStream("helpers/latest.zip").on('finish', () => {
            fs.createReadStream("helpers/latest.zip").pipe(unzipper.Extract({ path: './backend' }));
          }));
        })
      } catch(e) {
        console.log(e)
        process.exit();
      }
    })();
  });
}
