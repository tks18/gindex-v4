const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const boxen = require('boxen');

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "double",
 borderColor: "yellow"
};

module.exports = function(){
  clear();
  return boxen(
    '\n' + chalk.red.bold(
        'U L T I M A T E  G - I N D E X  D E P L O Y E R  C L I  T O O L \n\n'
      ) +
      chalk.green.bold(
        '          B Y  \n\n'
      ) +
      chalk.blue.bold(
        figlet.textSync('Shan.tk', {
          font: 'Ghost',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 100,
          whitespaceBreak: true
        })
      ), boxenOptions) + '\n\n'
}
