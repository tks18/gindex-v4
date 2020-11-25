const { prompt } = require('enquirer');

module.exports = {
  appName: async () => {
    const appNamePrompt = await prompt({
      type: 'input',
      name: "appname",
      message: "Enter a Unique Backend Appname for Your App."
    })
    return appNamePrompt.appname;
  }
}
