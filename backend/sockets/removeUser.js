const Room = require('../models/room');
async function removeUser(id, sc) {
  const room = await Room.findOne({ _id: id });
  const om = [...room.onlineMembers];
  // const om = [1, 2, 3, 4, 5, 6];
  for (var i = 0; i < om.length; i++) {
    var name = om[i].username;
    if (name === sc.handshake.session.user.username) {
      om.splice(i, 1);
    }
  }
  await Room.update({ _id: id }, { onlineMembers: om });
}

module.exports = removeUser;
