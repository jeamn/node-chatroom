const checkLogin = async function(req, res) {
  // console.log(req.session);
  const User = req.model.User;
  if (!req.session.user) {
    res.json({ status: 505 }); //505未登录
  } else {
    let user, username;
    try {
      username = req.session.user.username;
      user = await User.findOne({ username });
      // console.log(user)
    } catch (err) {
      res.json({ status: 505 });
    }
    res.json({ status: 200, nickname: user.nickname, username });
  }
};

module.exports = checkLogin;
