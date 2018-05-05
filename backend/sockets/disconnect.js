const removeUser = require('./removeUser');
function disconnect() {
  const sc = this;
  if (!sc.handshake.session.user) {
    return;
  }
  let id = sc.handshake.session.roomid;
  if (!id) {
    return;
  }
  delete sc.handshake.session.roomid;
  sc.handshake.session.save();
  // console.log(sc.handshake.session.roomid,"===sdasdsfhaskfhdlhsld;g")
  // sc.broadcast.emit('sys',sc.handshake.session.user.nickname +' has been leaved')
  sc.leave(id);
  sc
    .to(id)
    .emit('sys', sc.handshake.session.user.nickname + ' has been leaved');
  removeUser(id, sc);
}
module.exports = disconnect;
