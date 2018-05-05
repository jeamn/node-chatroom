const path = require('path')
const readRoomImg = function(req,res){
  const abspath = path.join(__dirname,'uploadimg', req.params.filename)
  res.sendFile(abspath)
}

module.exports = readRoomImg