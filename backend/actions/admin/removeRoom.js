const removeRoom = async function(req, res) {
  const Room = req.model.Room;
  const title = req.body.title;
  try {
    await Room.remove({ title });
    res.json({ status: 200 });
  } catch (err) {
    res.json({ status: 503, msg: err });
  }

  // console.log(count);
};

module.exports = removeRoom;

// const getUserList = async function(req, res) {
//   const User = req.model.User;
//   try {
//     const users = await User.find({}, { __v: 0, _id: 0 });
//     res.json({ status: 200, users });
//   } catch (err) {
//     res.json({ status: 504, msg: err });
//   }
// };
