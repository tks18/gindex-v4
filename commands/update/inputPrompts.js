const { prompt } = require('enquirer');

module.exports = {
  appName: async () => {
    const appNamePrompt = await prompt({
      type: 'input',
      name: "appname",
      message: "Enter the Heroku appname that You have Created Before."
    })
    return appNamePrompt.appname;
  },
}
