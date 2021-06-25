const { prompt, Select } = require('enquirer');

module.exports = {
  appName: () => {
    return prompt({
      type: 'input',
      name: "appname",
      message: "Enter the Heroku appname that You have Created Before."
    }).then(vals => {
      return vals.appname
    }).catch(
      console.error
    )
  },
  getEnvName: () => {
    const prompt = new Select({
      name: 'envname',
      message: 'Select the Variable which you want to Change',
      choices: [
        'DBURL',
        'SITE',
        'EMAILID',
        'EMAILPASS',
        'EMAILPORT',
        'EMAILSERVICE',
        'EMAILSMTP',
        'ADMINEMAIL',
        'REPLYTOMAIL',
        'MAXSESSIONS',
        'EMAILGIF',
        'SITESECRET',
        'TMDBAPI',
        'FRONTENDURL',
        'FRONTENDSITENAME',
        'TOKENSECRET'
      ]
    })
    return prompt.run().then(getTheEnvName => {
      return getTheEnvName
    }).catch(
      console.error
    )
  },
  envValue: (envname) => {
    if(envname == "EMAILPASS" || envname == "SITESECRET" || envname == "TMDBAPI"){
      return prompt({
        type: 'password',
        name: "envvalue",
        message: "Enter the Value for "+envname
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
    if(envname == "DBURL" || envname == "EMAILSERVICE" || envname == "EMAILSMTP" || envname == "FRONTENDSITENAME"){
      return prompt({
        type: 'input',
        name: "envvalue",
        message: "Enter the Value for "+envname
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
    if(envname == "SITE" || envname == "EMAILGIF"){
      return prompt({
        type: 'input',
        name: "envvalue",
        message: "Enter the Value for "+envname,
        validate(value) {
          const regex = /^(https:\/\/|http:\/\/)(.+)[\S\s][^/]$/;
          if(!regex.test(value)){
            return "Enter a Proper Link";
          } else {
            return true;
          }
        }
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
    if(envname == "EMAILID" || envname == "ADMINEMAIL" || envname == "REPLYTOMAIL"){
      return prompt({
        type: 'input',
        name: "envvalue",
        message: "Enter the Value for "+envname,
        validate(value) {
          const regex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g;
          if(!regex.test(value)){
            return "Enter Proper Email Address";
          } else {
            return true;
          }
        }
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
    if(envname == "EMAILPORT" || envname == "MAXSESSIONS"){
      return prompt({
        type: 'input',
        name: "envvalue",
        message: "Enter the Value for "+envname,
        validate(value) {
          const regex = /([1-9]).+/;
          if(!regex.test(value)){
            return "Enter a Valid Number";
          } else {
            return true;
          }
        }
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
    if(envname == "FRONTENDURL"){
      return prompt({
        type: 'input',
        name: "envvalue",
        message: "Enter the Value for "+envname,
        validate(value) {
          const valArr = value.split(',');
          const regex = /^(https:\/\/|http:\/\/)(.+)[\S\s][^/]$/;
          for(i=0;i<valArr.length;i++){
            if(!regex.test(valArr[i])){
              return "Don't Put trailing / at the end."+valArr[i]+" is Wrong."
            }
          }
          return true;
        }
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
    if(envname == "TOKENSECRET"){
      return prompt({
        type: 'input',
        name: "envvalue",
        message: "Enter the Value for "+envname,
        validate(value) {
          if(value.length < 15){
            return "Minimum Length of the Token Secret is 15"
          } else {
            return true;
          }
        }
      }).then(vals => {
        return vals.envvalue
      }).catch(
        console.error
      )
    }
  }
}
