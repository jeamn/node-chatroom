const removeUser = require('./removeUser')

function exitRoom(id) {
  const sc = this
  if (!sc.handshake.session.user) {
    return
  }
  sc.leave(id, function (err) {
    if (err) {
      console.log(err)
    } else {
      sc.to(id).emit('sys', sc.handshake.session.user.nickname + ' has been left')
      sc.emit('sys', sc.handshake.session.user.nickname + ' has been left')
    }
  })
  removeUser(id, sc)
  // console.log(sc.handshake.session.user.nickname+' has been exited')
}


module.exports = exitRoom
