const { prompt } = require('enquirer');

module.exports = {
  appName: async () => {
    const appNamePrompt = await prompt({
      type: 'input',
      name: "appname",
      message: "Enter a Unique Backend Appname for Your App."
    })
    return appNamePrompt.appname;
  },
  configKeys: async() => {
    const configObj = await prompt([
      {
        type: 'input',
        name: "dburl",
        message: "Enter the MongoDB url that You Copied from their Website",
      },
      {
        type: 'input',
        name: "site",
        message: "Enter the Heroku App Website to which it is Deployed",
        validate(value) {
          const regex = /^(https:\/\/|http:\/\/)(.+)[\S\s][^/]$/;
          if(!regex.test(value)){
            return "Please Enter a Valid Url";
          } else {
            return true;
          }
        }
      },
      {
        type: 'input',
        name: "emailid",
        message: "Enter the Email ID from which User Messages will be Sent",
        validate(value) {
          const regex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g;
          if(!regex.test(value)){
            return "Enter Proper Email Address";
          } else {
            return true;
          }
        }
      },
      {
        type: 'password',
        name: "emailpass",
        message: "Enter the Email Password for the Above email",
      },
      {
        type: 'input',
        name: "emailport",
        message: "Enter the SMTP Email Port for the Above Email",
        validate(value) {
          const regex = /([1-9]).+/;
          if(!regex.test(value)){
            return "Enter Proper Port Number";
          } else {
            return true;
          }
        }
      },
      {
        type: 'input',
        name: "emailservice",
        message: "Enter the Email Provider Name(Eg: Gmail, Yahoo, etc.)",
      },
      {
        type: 'input',
        name: "emailsmtp",
        message: "Enter the SMTP Address for the Above Email",
      },
      {
        type: 'input',
        name: "adminemail",
        message: "Enter the Admin Email ID(Can be Anything or can be Same as the Above Email ID)",
        validate(value) {
          const regex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g;
          if(!regex.test(value)){
            return "Enter Proper Email Address";
          } else {
            return true;
          }
        }
      },
      {
        type: 'input',
        name: "replyemail",
        message: "Confirm the Before Email Again",
        validate(value) {
          const regex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g;
          if(!regex.test(value)){
            return "Enter Proper Email Address";
          } else {
            return true;
          }
        }
      },
      {
        type: 'input',
        name: "maxsessions",
        message: "Enter the Number of Maximum Active Sessions that Users can Login Simultaneously(Eg: 1, 2, 5, etc.)",
        validate(value) {
          const regex = /([1-9]).+/;
          if(!regex.test(value)){
            return "Enter a Valid Number";
          } else {
            return true;
          }
        }
      },
      {
        type: 'input',
        name: "emailgif",
        message: "Enter the Image Link for Displaying in Emails",
        validate(value) {
          const regex = /^(https:\/\/|http:\/\/)(.+)[\S\s][^/]$/;
          if(!regex.test(value)){
            return "Enter a Proper Link";
          } else {
            return true;
          }
        }
      },
      {
        type: 'password',
        name: "sitesec",
        message: "Enter a Secret Key that you will Remember (Should be Used while Creating a Superadmin Account after this Setup)",
      },
      {
        type: 'password',
        name: "tmdbapi",
        message: "Enter the TMDB API Key for Metadata Info of Media in the Index (If You Don't Need, put NaN)",
      },
      {
        type: 'input',
        name: "fronturls",
        message: "Enter the Frontend Url/Urls (Don't Put trailing / at the end) (Multiple Frontends can be Put Here by putting a ,)",
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
      },
      {
        type: 'input',
        name: "frontname",
        message: "Enter the Frontend's Website Name (Can be Anything)",
      },
      {
        type: 'input',
        name: "tokensec",
        message: "Enter a Super Long Token Secret that will be Used to Secure the JWT Tokens.(These are Never Required to be Remebered)",
        validate(value) {
          if(value.length < 15){
            return "Minimum Length of the Token Secret is 15"
          } else {
            return true;
          }
        }
      },
    ])
    return configObj;
  }
}
