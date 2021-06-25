const transport = require('./mailtransporter');
const InvitedUser = require("../models/invitedUser");
const toInvitedUserEmail = require('../templates/delete/invitedUsers/toAll');

function deleteInvitedUsers() {
  console.log("Triggered Verification Check")
  InvitedUser.find({}, function(error, result){
    if(result){
      result.forEach((user, i) => {
        const currentTime = Date.now();
        const allowedTill = user.pendingFrom + (86400*1000);
        if(currentTime > allowedTill){
          InvitedUser.deleteOne({ email: user.email }, function(error){
            if(!error){
              const deleteMessage = {
                 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
                 to: user.invitedby,
                 replyTo: process.env.REPLYTOMAIL,
                 subject: `Regarding Your Invite to ${user.email}`,
                 html: toInvitedUserEmail(user),
              };
            } else {
              console.log("Some Error While Trying to Deleting, Will be Deleted in Next Cycle.")
            }
          })
        } else {
          console.log("You Got Some Time Left")
        }
      });

    } else {
      console.log("No Invited Users")
    }
  })
}

module.exports = deleteInvitedUsers;
