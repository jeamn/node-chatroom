const Room = require('../models/room');
async function joinRoom(id) {
  const sc = this;
  if (!sc.handshake.session.user) {
    return;
  }
  sc.handshake.session.roomid = id;
  sc.handshake.session.save();
  console.log(sc.handshake.session.user.nickname + ' has been joined');
  sc.join(id);
  const room = await Room.findOne({ _id: id });
  // room.onlineMembers  for  sc.handshake.session.user.username
  // const om = room.onlineMembers   // alias 浅拷贝
  const om = [...room.onlineMembers]; // room 里面的属性都是只读的。。

  for (var i = 0; i < om.length; i++) {
    if (om[i].username === sc.handshake.session.user.username) {
      return;
    }
  }

  // const om = [].concat(room.onlineMembers)
  om.push({
    nickname: sc.handshake.session.user.nickname,
    username: sc.handshake.session.user.username
  });
  await Room.update({ _id: id }, { onlineMembers: om });
  // console.log(room.onlineMembers)
  sc
    .to(id)
    .emit('sys', sc.handshake.session.user.nickname + ' has been joined');
  sc.emit('sys', sc.handshake.session.user.nickname + ' has been joined');
}

module.exports = joinRoom;
