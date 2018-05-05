// import { model } from "mongoose";
const mongoose = require('mongoose');

const User = mongoose.model('user', {
  username: String,
  nickname: String,
  password: String,
  time: Date
});

module.exports = User;
