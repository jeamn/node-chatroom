const createChatRoom = async function(req, res) {
  const Room = req.model.Room;
  const title = req.body.title;
  const theme = req.body.theme;
  const roomPic = req.body.roomPic;
  if (!(title && theme && roomPic)) {
    res.json({ status: 502 });
    return;
  }
  let count = await Room.count({ title });
  if (count === 0) {
    const date = new Date();
    const time = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`;
    var room = new Room({
      roomPic,
      title,
      theme,
      onlineMembers: [],
      date: time
    });
    try {
      await room.save();
      // console.log(room)
      res.json({ status: 200, room });
    } catch (error) {
      res.json({ status: 504, msg: error });
    }
  } else {
    res.json({ status: 501 });
  }
};

module.exports = createChatRoom;
