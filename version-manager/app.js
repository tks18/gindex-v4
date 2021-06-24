#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const spinner = require('./helpers/spinner');
const { checkArgs } = require('./publish');

const catchFunc = (spinner) => {
  spinner.stop();
  console.log('Failed');
};

yargs(hideBin(process.argv)).command(
  'publish [repo] [branch] [dev]',
  'Publish Frontend, Backend, CLI-Tool, Version Control, Worker Version Automatically with Diff',
  {},
  (args) => {
    spinner('Inititalizing App', (baseSpinner) => {
      checkArgs(args)
        .then((result) => {
          baseSpinner.stop();
          console.log(result);
        })
        .catch((err) => catchFunc(baseSpinner));
    });
  },
);

if (yargs.argv._.length < 1) {
  yargs.showHelp();
}
