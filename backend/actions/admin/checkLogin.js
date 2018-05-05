const checkLogin = async function(req, res, next) {
  // console.log(req.session);
  const Admin = req.model.Admin;
  if (!req.session.admin) {
    res.json({ status: 504, msg: '用户未登录' });
    return;
  }
  let admin, username;
  try {
    username = req.session.admin.username;
    admin = await Admin.findOne({ username });
  } catch (err) {
    res.json({ stats: 505, msg: '用户不存在' });
  }
  next();
};
module.exports = checkLogin;

// else {
//   let admin, username;
//   try {
//     username = req.session.admin.username;
//     admin = await Admin.findOne({ username });
//   } catch (err) {
//     res.json({ stats: 505, msg: '用户不存在' });
//   }
// }
// return next();
