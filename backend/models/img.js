const mongoose = require('mongoose')

const Img = mongoose.model('img',{
  name: String,
  type: String,
  imgpath: String
})

module.exports = Img;
