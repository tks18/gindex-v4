const transport = require('./mailtransporter');
const PendingUser = require("../models/pendingUser");
const deletePendingUserTemplate = require('../templates/delete/pending/toAll');

function deletePendingUsers() {
  console.log("Triggered Verification Check")
  PendingUser.find({}, function(error, result){
    if(result){
      result.forEach((user, i) => {
        const currentTime = Date.now();
        const allowedTill = user.pendingFrom + (86400*1000);
        if(currentTime > allowedTill){
          PendingUser.deleteOne({ email: user.email }, function(error){
            if(!error){
              const deleteMessage = {
                 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
                 to: user.email,
                 replyTo: process.env.REPLYTOMAIL,
                 subject: 'Regarding Your Request',
                 html: deletePendingUserTemplate(user),
              };
              transport.sendMail(deleteMessage, function(err, info){
                if(err){
                  console.log(err);
                } else {
                  console.log(info)
                }
              })
            } else {
              console.log("Some Error While Trying to Deleting, Will be Deleted in Next Cycle.")
            }
          })
        } else {
          console.log("You Got Some Time Left")
        }
      });
    } else {
      console.log("No Pending Users")
    }
  })
}

module.exports = deletePendingUsers
