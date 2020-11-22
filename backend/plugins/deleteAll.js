const deleteUsers = require('./deleteUsers');
const deletePendingUsers = require('./deletePendingUsers');
const deleteInvitedUsers = require('./deleteInvitedUsers');

function deleteAll() {
  setInterval(async () => {
    await deleteUsers();
    await deletePendingUsers();
    await deleteInvitedUsers();
  }, (7200 * 1000))
}

module.exports = deleteAll;
