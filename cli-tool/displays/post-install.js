const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const boxen = require('boxen');

const greeting = chalk.white.bold("Thanks ! for Installing the Alpha Version of the Ultimate Index Deployer all in one Tool.");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
 backgroundColor: "#555555"
};
clear()
console.log(
  boxen(
    '\n\n' + chalk.white.bold(
        'U L T I M A T E  G - I N D E X  D E P L O Y E R  C L I  T O O L \n\n'
      ) +
      chalk.yellow.bold(
        '          B Y  \n'
      ) +
      chalk.blue.bold(
        'S H A N  .  T K  \n'
      ) + '\n\n' +
      greeting, boxenOptions)
);
