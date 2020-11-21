const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const boxen = require('boxen');

const greeting = chalk.white.bold("Hello! There my boy");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
 backgroundColor: "#555555"
};

module.exports = function(){
  clear();
  return boxen(
    '\n\n' + chalk.white.bold(
        'U L T I M A T E  G - I N D E X  D E P L O Y E R  C L I  T O O L \n\n'
      ) +
      chalk.yellow.bold(
        '          B Y  \n'
      ) +
      chalk.yellow.bold(
        figlet.textSync('Shan.tk', {
          font: 'Ghost',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 100,
          whitespaceBreak: true
        })
      ), boxenOptions) + '\n\n' +
      greeting
}
