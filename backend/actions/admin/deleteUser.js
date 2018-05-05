const deleteUser = async function(req, res) {
  const User = req.model.User;
  const username = req.body.username;
  try {
    await User.remove({ username });
    res.json({ status: 200 });
  } catch (err) {
    res.json({ status: 503, msg: err });
  }
};

module.exports = deleteUser;
