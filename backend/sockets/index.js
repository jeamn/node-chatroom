const joinRoom = require('./joinRoom');
const moment = require('moment');
const Chat = require('../models/chat');
const exitRoom = require('./exitRoom');
const newMsg = require('./newMsg');
const removeUser = require('./removeUser');
const disconnect = require('./disconnect');

function onConnect(sc) {
  sc.on('join-room', joinRoom.bind(sc));
  sc.on('exit-room', exitRoom.bind(sc));
  sc.on('new-msg', newMsg(sc));
  sc.on('disconnect', disconnect.bind(sc));
}

module.exports = onConnect;
