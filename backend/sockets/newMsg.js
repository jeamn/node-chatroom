const moment = require('moment')
const Chat = require('../models/chat')

const newMsg = function(sc){
  return async function(res){
    if(!sc.handshake.session.user){return}
    // console.log(res,sc.handshake.session.user.nickname)
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    const time = date
    const result = {
      msg: res.msg,
      time,
      nickname: sc.handshake.session.user.nickname,
      username: sc.handshake.session.user.username
    }
    sc.to(res.id).emit('fetch-msg', result)
    sc.emit('fetch-msg', result)
    result.roomId = res.id
    const chat = new Chat(result)
    let resp = await chat.save()
    // console.log(resp)
  }
}

module.exports = newMsg

