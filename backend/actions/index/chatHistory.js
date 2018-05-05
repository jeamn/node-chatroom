const chatHistory = async function(req,res){
  const Chat = req.model.Chat
  const skip = parseInt(req.params.skip)
  const roomId = req.params.roomId
  const chats = await Chat.find({roomId},{"__v":0,"_id":0,"roomId":0,}).sort({"time":-1}).skip(skip).limit(3)
  // console.log(chats)
  // let historyTime
  // for(var i=0; i<chats.length; i++){
  //   historyTime = chats[i].time.toUTCString()
  //   chats[i].time = historyTime
  // }
  // console.log(historyTime)
  // const historyTime = await chats.time.toUTCString()
  res.json(chats)
}

module.exports = chatHistory