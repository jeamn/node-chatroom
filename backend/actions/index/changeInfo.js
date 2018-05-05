const md5 = require('md5');
const changeInfo = async function(req, res) {
  const User = req.model.User;
  const { password, newPwd, nickname } = req.body;
  if (!nickname) {
    res.json({ status: 502 });
  }
  if (!req.session.user) {
    res.json({ status: 503 });
  }

  const username = req.session.user.username;
  let resp;
  if (nickname && password && newPwd) {
    let md5Pwd = md5(password);
    const user = await User.findOne({ password: md5Pwd, username });
    if (!user) {
      res.json({ status: 504, msg: 'err' });
    }
    const nmd5Pwd = md5(newPwd);
    resp = await User.update(
      { password: md5Pwd, username },
      { password: nmd5Pwd, nickname }
    );
    res.json({ status: 201 });
  } else if (!password && !newPwd) {
    const user = await User.findOne({ username });
    if (!user) {
      res.json({ msg: 'err' });
    }
    resp = await User.update({ username }, { nickname });
  } else {
    res.json({ status: 502 });
  }
  if (resp.ok === 1) {
    req.session.user.nickname = nickname;
    // console.log(req.session.user);
    res.json({ status: 200 });
  } else {
    res.json({ status: 508 }); //508信息不匹配
  }
};

module.exports = changeInfo;
