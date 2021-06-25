const boxen = require('boxen');
const chalk = require('chalk');

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
};

module.exports = boxen('\n\n'+
    chalk.bold.italic.green('Successfully Initiated Gindex CLI Tool') +
    '\n\n'+
    'It Looks Like all the Preqrequisites got Successfully Initialized '+'\n'+
    'and is Ready to Deploy Your Amazing Gindex Backend.'+'\n\n'+
    'Now Run the Following Command to Login to Heroku Account'+ '\n'+
    chalk.bold.yellow('>> heroku login')+'\n\n'+
    'After Successfully Running the Above Command, Run the Following Command:'+'\n'+
    chalk.bold.yellow('>> gdployer deploy')+'\n\n'+
    'and Follow the Onscreen Instruction to Deploy the Awesomeness with Ease.'
  , boxenOptions)
