const getUserList = async function(req, res) {
  const User = req.model.User;
  try {
    const users = await User.find({}, { __v: 0, _id: 0 });
    res.json({ status: 200, users });
  } catch (err) {
    res.json({ status: 504, msg: err });
  }
};
module.exports = getUserList;
