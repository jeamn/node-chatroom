const mongoose = require('mongoose')

const Chat = mongoose.model('chat', {
  msg: String,
  time: Date,
  nickname: String,
  username: String,
  roomId: String
});

module.exports = Chat;
