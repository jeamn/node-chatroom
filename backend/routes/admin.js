const express = require('express');
const router = express.Router();
const AdminAction = require('../actions/admin/index');

router.post('/login', AdminAction.login);
router.use(AdminAction.checkLogin); //
router.get('/checkLogin', function(req, res) {
  res.json({ status: 200, admin: req.session.admin });
});
router.post('/deleteUser', AdminAction.deleteUser);
router.get('/getUserList', AdminAction.getUserList);
router.post('/removeRoom', AdminAction.removeRoom);
router.post('/changeInfo', AdminAction.changeInfo);
router.get('/logout', AdminAction.logout);

module.exports = router;
