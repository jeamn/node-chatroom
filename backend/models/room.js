const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RoomSchema = new Schema({
  title: String,
  theme: String,
  roomPic: String,
  onlineMembers: Array,
  date: Date
});
const Room = mongoose.model('room', RoomSchema);
module.exports = Room;
// var Room = mongoose.model('room', {
//   title: String,
//   theme: String,
//   roomPic: String,
//   onlineMembers: Array,
//   date: Date
// });