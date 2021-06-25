#!/usr/bin/env node

require('dotenv').config();
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const spinner = require('./helpers/spinner');
const { checkArgs, handlePublish } = require('./publish');
const versionInfo = require('../version.json');

const catchFunc = (error, spinner) => {
  spinner.stop();
  console.log(error);
  console.log('Failed');
};

yargs(hideBin(process.argv)).command(
  'publish [type] [repo] [branch] [dev]',
  'Publish Frontend, Backend, CLI-Tool, Version Control, Worker Version Automatically with Diff',
  {},
  (args) => {
    spinner('Inititalizing App', (baseSpinner) => {
      const checks = checkArgs(args, versionInfo);
      baseSpinner.stop();
      if (checks.passes) {
        handlePublish(checks)
          .then((result) => {
            if (result && !result.error) {
              console.log('Successfully Deployed the Release');
            } else {
              console.log('Failed to Deploy the Release');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log('Wrong Options Given Try Again');
      }
    });
  },
);

if (yargs.argv._.length < 1) {
  yargs.showHelp();
}
