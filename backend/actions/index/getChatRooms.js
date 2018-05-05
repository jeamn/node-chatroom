const getChatRooms = async function(req, res) {
  // console.log(req.model.Room);
  const Room = req.model.Room;
  try {
    const rooms = await Room.find({}, { __v: 0 });
    res.json({ status: 200, rooms });
  } catch (error) {
    res.json({ status: 504, msg: error });
  }
};
module.exports = getChatRooms;
