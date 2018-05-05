var express = require('express');
var router = express.Router();
const IndexAction = require('../actions/index/index');

// router.get('/', function(req, res) {
//   res.send('ad');
// });

//路由配置
router.post('/Register', IndexAction.register);
router.post('/Login', IndexAction.login);
router.post('/Createchatroom', IndexAction.createChatRoom);
router.get('/getChatRooms', IndexAction.getChatRooms);
router.get('/Getchatroom/:id', IndexAction.getChatRoom);
router.get('/checkLogin', IndexAction.checkLogin);
router.get('/logout', IndexAction.logout);
router.post('/roomUpload', IndexAction.roomUpload);
router.get('/roomPic/uploadimg/:filename', IndexAction.readRoomImg);
router.post('/upload', IndexAction.userUpload);
router.post('/changeInfo', IndexAction.changeInfo);
router.get('/chatHistory/:roomId/:skip', IndexAction.chatHistory);
router.get('/avator/user/:name', IndexAction.readUserImg);
router.post('/chatImgUpload', IndexAction.chatImgUpload);

// router.get('/getInfo',function(req,res){
//   if(!req.session.user){
//     res.json({status:504})
//   } else {
//     res.send(req.session.user.username)
//   }
// })

module.exports = router;
