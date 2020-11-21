#!/usr/bin/env node

const spinner = require('./helpers/spinner');
const initialRender = require('./displays/initial-render');
const log = console.log;
const yargs = require("yargs");



log(
  initialRender()
);
spinner("Initializing Application in", 0, function(){
  process.stdout.write('\n');
  process.exit(0);
});
