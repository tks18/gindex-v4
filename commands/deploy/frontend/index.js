const getLatIndex = require('./getLatIndex');
const replaceOpt = require('./replaceOpt');
const getAllPrompts = require('./getAllPrompts');
const inputPrompts = require('./inputPrompts');
const spinner = require('../../../helpers/spinner');

const open = require('open');
const chalk = require('chalk');
const clipboardy = require('clipboardy');

module.exports = async () => {
  spinner(true, 'Getting the Latest Index Code', 0, false, async (indexSpin) => {
    const latestIndex = await getLatIndex()
    indexSpin.stop();
    console.log(chalk.green.bold("\nIndex Code has been Successfully Retrived, Now Enter the Required Details\n"))
    const getAllObjs = await getAllPrompts();
    const finalIndexCode = await replaceOpt(latestIndex.code, getAllObjs, latestIndex.verNumber)
    clipboardy.writeSync(finalIndexCode);
    console.log(chalk.green.bold("\n Your Code has been Copied to Clipboard, You can Deploy by Pasting to Your Worker in Cloudflare\n"))
    process.exit();
  })
}
