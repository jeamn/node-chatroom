const md5 = require("md5");

const register = async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const User = req.model.User;
  if (!(username && password)) {
    res.json({ status: 502 });
  }
  let count = await User.count({ username });
  if (count === 0) {
    var user = new User({
      username: req.body.username,
      nickname: req.body.username,
      password: md5(req.body.password),
      time: new Date()
    });
    try {
      await user.save();
      res.json({ status: 200 });
    } catch (error) {
      res.json({ status: 504, msg: error });
    }
  } else {
    res.json({ status: 501 });
  }
};

module.exports = register;
