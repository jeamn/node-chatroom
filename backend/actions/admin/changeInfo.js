/*错误类型：
501:信息已存在
502:信息不完整 
503:信息不存在
504:用户未登录
*/
const md5 = require('md5');
const changeInfo = async function(req, res) {
  const Admin = req.model.Admin;
  const { password, newPwd } = req.body;

  const username = req.session.admin.username;
  if (password && newPwd) {
    let md5Pwd = md5(password);
    const user = await Admin.findOne({ password: md5Pwd, username });
    if (!user) {
      res.json({ status: 501, msg: '密码错误' });
      return;
    }
    const nmd5Pwd = md5(newPwd);
    resp = await Admin.update({ username }, { password: nmd5Pwd });
    // console.log(resp);
    if (resp.ok === 1) {
      res.json({ status: 200 });
    }
    // } else {
    //   res.json({ status: 503, msg: '数据库出错' });
    // }
  } else {
    res.json({ status: 502, msg: '信息不完整' });
  }
};

module.exports = changeInfo;
