const transport = require('./mailtransporter');
const User = require("../models/user");
const nonVerfiedEmailTemplate = require('../templates/delete/users/toNonVerified.js');

function deleteTimeout() {
  console.log("Triggered Verification Check")
  User.find({ verified: false }, function(error, result){
    if(result){
      result.forEach((user, i) => {
        const currentDate = Date.now();
        const expiryDate = user.registeredDate + (10800 * 1000);
        console.log(currentDate, expiryDate);
        if(currentDate > expiryDate){
          User.deleteOne({ email: user.email }, function(error){
            if(error){
              console.log(error)
            } else {
              const deleteMessage = {
                 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
                 to: user.email,
                 replyTo: process.env.REPLYTOMAIL,
                 subject: 'Deletion of Your Account.',
                 html: nonVerfiedEmailTemplate(user), // Plain text body
              };
              transport.sendMail(deleteMessage, function(err, info){
                if(err){
                  console.log(err);
                } else {
                  console.log(info)
                }
              })
            }
          })
        } else {
          console.log("You Got Time to Get Verified.")
        }
      });
    } else {
      console.log("All Users are Verified.")
    }
  })
}

module.exports = deleteTimeout;
