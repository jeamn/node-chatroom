const md5 = require('md5');
// config = require('../../config/default');

const login = async function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  if (!(username && password)) {
    res.json({ status: 502 });
  }
  const Admin = req.model.Admin;
  const admin = await Admin.count({ username, password });
  if (admin) {
    req.session.admin = { username };
    res.json({ status: 200 });
  } else {
    res.json({ status: 503 });
  }
};
module.exports = login;
