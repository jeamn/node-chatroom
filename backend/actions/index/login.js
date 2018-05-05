const md5 = require('md5');
const login = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const User = req.model.User;
  if (!(username && password)) {
    res.json({
      status: 502
    });
  }
  const md5pwd = md5(password);
  const user = await User.findOne({
    username: username,
    password: md5pwd
  });
  if (!user) {
    res.json({
      status: 503
    });
  } else {
    req.session.user = {
      username: username,
      nickname: user.nickname
    };
    res.json({
      status: 200
    });
  }
};

module.exports = login;
