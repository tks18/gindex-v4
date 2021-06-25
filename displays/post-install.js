const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const boxen = require('boxen');

const greeting = chalk.white.bold("Thanks ! for Installing the Ultimate Index \nDeployer all in one Tool.");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "double",
 borderColor: "green",
};
clear()
console.log(
  boxen(
    '\n\n' + chalk.white.bold(
      'ULTIMATE G-INDEX DEPLOYER CLI TOOL\n\n'
    ) +
    chalk.yellow.bold(
      'BY  \n'
    ) +
    chalk.blue.bold(
      'SHAN . TK \n'
    ) + '\n\n' +
    greeting +
    chalk.bold(
      `\n
Following are the Commands Available:\n
gdployer [command]

Commands:
  gdployer init                    Initialize the Deployer (Will Check for all
                                   the Preqrequisites)
  gdployer deploy                  Deploy Your Backend(for Now) will Support
                                   Frontend after Some time
  gdployer update                  Update Your Backend to latest Version
  gdployer configure --env         Update Your Backend Variables

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
      `
    )
  , boxenOptions)
);
