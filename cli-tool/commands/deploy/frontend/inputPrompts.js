const { Input, Confirm, Form, Select } = require('enquirer');

module.exports = {
  getAllKeys: async () => {
    let objVals = {};
    objVals.appname = await new Input({
      type: 'input',
      name: "appname",
      message: "Enter a Unique Backend Appname for Your App."
    }).run().then(answer => {
      return answer
    })
    objVals.themename = await new Select({
      name: 'themename',
      message: 'Select the Theme Name You Want',
      choices: [
        'carnation',
        'curious-blue',
        'emerald',
        'ice-cold',
        'konifer',
        'netflix-red',
        'kournikova',
        'mona-lisa',
        'persian-rose',
        'purple-heart',
        'purple-mountains-majesty',
        'salmon',
        'selective-yellow',
        'shamrock',
        'witch-haze'
      ]
    }).run().then(answer => {
      return answer
    })
    objVals.themeVariant =await new Select({
      name: 'themevariant',
      message: 'Select the Theme Variant You Want',
      choices: [
        'black',
        'gradient',
      ]
    }).run().then(answer => {
      return answer
    })
    return objVals
  }
}
