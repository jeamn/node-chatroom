const getChatRoom = async function(req, res) {
  const Room = req.model.Room;
  try {
    const room = await Room.findOne({ _id: req.params.id }, { __v: 0 });
    // const rooms = await Room.find({},{"__v":0})
    res.json({ status: 200, room });
  } catch (error) {
    res.json({ status: 504, msg: error });
  }
};

module.exports = getChatRoom;
