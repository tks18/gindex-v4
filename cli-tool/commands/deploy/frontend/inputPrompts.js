const { Input, Confirm, Form, Select, Password } = require('enquirer');

module.exports = {
  appname: () => {
    return new Input({
      type: 'input',
      name: "appname",
      message: "Enter a Worker Name"
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log(e);
      process.exit();
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  themename: () => {
    return new Select({
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
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  getAuthCode: () => {
    return new Confirm({
      name: 'getAuthCode',
      message: 'Do You need to Generate Google Drive Refresh Token'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  themeVariant: () => {
    return new Select({
      name: 'themevariant',
      message: 'Select the Theme Variant You Want',
      choices: [
        'black',
        'gradient',
      ]
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  fronturl: () => {
    return new Input({
      name: "fronturl",
      message: "Enter the Frontend URL (worker domain or custom domain)",
      validate(value) {
        const regex = /^(https:\/\/|http:\/\/)(.+)[\S\s][^/]$/;
        if(!regex.test(value)){
          return "Don't Put trailing / at the end."
        } else {
          return true
        }
      }
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  backurl: () => {
    return new Input({
      name: "backurl",
      message: "Enter the Backend Server URL",
      validate(value) {
        const regex = /^(https:\/\/|http:\/\/)(.+)[\S\s][^/]$/;
        if(!regex.test(value)){
          return "Don't Put trailing / at the end."
        } else {
          return true
        }
      }
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  favicon: () => {
    return new Input({
      name: "favicon",
      message: "Enter a Favicon URL for the Website"
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  clientId: () => {
    return new Password({
      name: 'clientid',
      message: 'Enter the Client ID You got from Google Drive API'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  clientSec: () => {
    return new Password({
      name: 'clientsec',
      message: 'Enter the Client Secret You got from Google Drive API'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  refreshTok: () => {
    return new Password({
      name: 'refreshToken',
      message: 'Enter the Refresh Token You got from Google Drive API'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  confRoot: () => {
    return new Confirm({
      name: 'rootconfirm',
      message: 'Do You want to Add More Roots'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  rootForm: () => {
    return new Form({
      name: 'rootform',
      message: 'Enter the Following Regarding to Folder Details (Use Arrow Keys to Move down the Form)',
      choices: [
        {
          name: 'id',
          message: 'Enter the Folder ID',
        },
        {
          name: 'name',
          message: 'Enter a Name to Display for that Folder ID'
        },
      ]
    }).run().then(answer => {
      answer['protect_file_link'] = true;
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  netBlack: () => {
    return new Confirm({
      name: 'rootconfirm',
      message: 'Do You want to Prefer Netflix Black'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  loadingImg: () => {
    return new Input({
      name: "loadingImage",
      message: "Enter a Loading GIF for Display in Website while the Files are Loading"
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  homeImg: () => {
    return new Input({
      name: "homeImg",
      message: "Enter a Background Image for Display in Website Homepage"
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  audioPoster: () => {
    return new Input({
      name: "audioPoster",
      message: "Enter a Poster Image for Album Art for Audios"
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  footLogo: () => {
    return new Confirm({
      name: 'footerLogo',
      message: 'Do You want Footer Logo to be Displayed'
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
  footImg: () => {
    return new Input({
      name: "footImg",
      message: "Enter a Footer Logo Image for Display in Website\'s Footer"
    }).run().then(answer => {
      return answer
    }).catch(e => {
      console.log("Error Occured in the Instance");
      process.exit();
    })
  },
}
