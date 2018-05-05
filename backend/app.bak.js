const express = require('express');
const app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');
// const session = require('express-session');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const sharedsession = require('express-socket.io-session');
// const moment = require('moment');

app.use(fileUpload());

app.use(
  cors({
    origin: 'http://localhost:3000',
    preflightContinue: true,
    credentials: true
  })
);

const session = require('express-session')({
  secret: 'asdasdasfdsad',
  resave: true,
  saveUninitialized: true
});

app.use(session);

io.use(
  sharedsession(session, {
    autoSave: true
  })
);

// app.use(session({
//   secret: 'fasjeinvrapeimf',   //有固定和非固定，如果不固定 在服务器多的情况下会执行很多次
//   resave: true,
//   saveUninitialized: true
// }))

io.use(
  sharedsession(session, {
    autoSave: true
  })
);
app.use(bodyParser.json({ type: 'application/json' }));
// app.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 },
// }));

mongoose.connect('mongodb://localhost/nodechat', { useMongoClient: true });
mongoose.Promise = global.Promise; //何解

// var qq = mongoose.model('qq', {
//   date: Date,
//   qq: String,
//   username: String,
//   room: String,
// });

var User = mongoose.model('user', {
  username: String,
  nickname: String,
  password: String
});

var Chat = mongoose.model('chat', {
  msg: String,
  time: Date,
  nickname: String,
  username: String,
  roomId: String
});
// app.use(bodyParser.json());

var Room = mongoose.model('room', {
  title: String,
  theme: String,
  roomPic: String,
  onlineMembers: Array,
  date: Date
});
// app.use(bodyParser.json());

var Img = mongoose.model('img', {
  name: String,
  type: String,
  imgpath: String
});

// app.get('/',function(req,res){
//   res.send(md5('hello'));
// })

/*错误类型：
501:信息已存在
502:信息不完整 
503:信息不存在
504:未知错误
*/

//注册存档API -------------------------------------------------------------------------------------
app.post('/Register', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (!(username && password)) {
    res.json({ status: 502 });
  }
  let count = await User.count({ username });
  if (count === 0) {
    var user = new User({
      username: req.body.username,
      nickname: req.body.username,
      password: md5(req.body.password)
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
});

// 登录API-------------------------------------------------------------------------------------

app.post('/Login', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (!(username && password)) {
    res.json({ status: 502 });
  }
  const md5pwd = md5(password);
  const user = await User.findOne({ username: username, password: md5pwd });
  // console.log(user)
  if (!user) {
    res.json({ status: 503 });
  } else {
    req.session.user = {
      username: username,
      nickname: user.nickname
    };
    res.json({ status: 200 });
  }
});

// app.get('/getInfo',function(req,res){
//   if(!req.session.user){
//     res.json({status:504})
//   } else {
//     res.send(req.session.user.username)
//   }
// })

//创建聊天室-------------------------------------------------------------------------------------
app.post('/Createchatroom', async function(req, res) {
  // const avator = req.body.avator;
  const title = req.body.title;
  const theme = req.body.theme;
  const roomPic = req.body.roomPic;
  if (!(title && theme && roomPic)) {
    res.json({ status: 502 });
    return;
  }
  let count = await Room.count({ title });
  if (count === 0) {
    const date = new Date();
    const time = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`;
    var room = new Room({
      roomPic,
      title,
      theme,
      onlineMembers: [],
      date: time
    });
    try {
      await room.save();
      // console.log(room)
      res.json({ status: 200, room });
    } catch (error) {
      res.json({ status: 504, msg: error });
    }
  } else {
    res.json({ status: 501 });
  }
});

// 获取房间s
app.get('/getChatRooms', async function(req, res) {
  try {
    const rooms = await Room.find({}, { __v: 0 });
    res.json({ status: 200, rooms });
  } catch (error) {
    res.json({ status: 504, msg: error });
  }
});

// 获取房间
app.get('/Getchatroom/:id', async function(req, res) {
  try {
    const room = await Room.findOne({ _id: req.params.id }, { __v: 0 });
    // const rooms = await Room.find({},{"__v":0})
    res.json({ status: 200, room });
  } catch (error) {
    res.json({ status: 504, msg: error });
  }
});

//验证登录
app.get('/checkLogin', async function(req, res) {
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
});

//退出登录
app.get('/logout', function(req, res) {
  try {
    delete req.session.user;
  } catch (e) {
    console.log(e);
  }
  res.json({ status: 200 });
});

//上传聊天室图片
app.post('/roomUpload', async function(req, res) {
  try {
    name = req.session.user.username;
  } catch (error) {
    res.json({ status: 505 }); //505未登录
  }
  if (req.files) {
    const filename = `/uploadimg/${new Date().getTime()}${path.extname(
      req.files.file.name
    )}`;
    let err = await req.files.file.mv(path.join(__dirname, filename));
    if (err) {
      res.json({ status: 507, msg: err });
    }
    res.json({ status: 200, pic: filename });
  } else {
    res.json({ msg: 'Please input a file.' });
  }
});

// 读取聊天室头像
// ./uploadimg/1514624552025.jpg
app.get('/roomPic/uploadimg/:filename', function(req, res) {
  const abspath = path.join(__dirname, 'uploadimg', req.params.filename);
  res.sendFile(abspath);
});

//上传用户照片
app.post('/upload', async function(req, res) {
  try {
    name = req.session.user.username;
  } catch (error) {
    res.json({ status: 505 }); //505未登录
  }
  const type = req.body.type || 'user'; // judge user or room
  if (req.files) {
    const filename = `./uploadimg/${new Date().getTime()}${path.extname(
      req.files.file.name
    )}`;
    let err = await req.files.file.mv(filename);
    if (err) {
      res.json({ status: 507, msg: err });
    }
    const one = await Img.findOne({ name });
    if (one) {
      fs.unlinkSync(one.imgpath);
      await Img.update({ name }, { imgpath: filename });
    } else {
      const img = new Img({ name, type, imgpath: filename });
      img.save();
    }
    res.json({ status: 200 });
  } else {
    res.json({ msg: 'Please input a file.' });
  }
});

//读取用户头像API
app.get('/avator/user/:name', async function(req, res) {
  const name = req.params.name;
  const img = await Img.findOne({ name });
  if (img) {
    const abspath = path.join(__dirname, img.imgpath);
    res.sendFile(abspath);
  } else {
    res.redirect(
      'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/super/crop=102,0,1722,1074/sign=6f4a465bc98065386fa5fe53aaec9176/4afbfbedab64034f84a90113acc379310a551dbb.jpg'
    );
  }
});

app.post('/changeInfo', async function(req, res) {
  const { password, newPwd, nickname } = req.body;
  if (!nickname) {
    res.json({ status: 502 });
  }
  if (!req.session.user) {
    res.json({ status: 503 });
  }
  const username = req.session.user.username;
  let resp;
  if (password && newPwd) {
    let md5Pwd = md5(password);
    const user = await User.findOne({ password: md5Pwd, username });
    if (!user) {
      res.json({ msg: 'err' });
    }
    const nmd5Pwd = md5(newPwd);
    resp = await User.update(
      { password: md5Pwd, username },
      { password: nmd5Pwd, nickname }
    );
  } else {
    const user = await User.findOne({ username });
    if (!user) {
      res.json({ msg: 'err' });
    }
    resp = await User.update({ username }, { nickname });
  }
  if (resp.ok === 1) {
    res.json({ status: 200 });
  } else {
    res.json({ status: 508 }); //508信息不匹配
  }
});

app.get('/chatHistory/:roomId/:skip', async function(req, res) {
  const skip = parseInt(req.params.skip);
  const roomId = req.params.roomId;
  // console.log(req.params)
  const chats = await Chat.find({ roomId }, { __v: 0, _id: 0, roomId: 0 })
    .sort({ time: -1 })
    .skip(skip)
    .limit(3);
  // console.log(chats)
  // let historyTime
  // for(var i=0; i<chats.length; i++){
  //   historyTime = chats[i].time.toUTCString()
  //   chats[i].time = historyTime
  // }
  // console.log(historyTime)
  // const historyTime = await chats.time.toUTCString()
  res.json(chats);
});

// socket.io
io.on('connection', onConnect);

function onConnect(sc) {
  sc.on('join-room', joinRoom);
  sc.on('exit-room', exitRoom);
  sc.on('new-msg', newMsg);
  sc.on('disconnect', function() {
    if (!sc.handshake.session.user) {
      return;
    }
    let id = sc.handshake.session.roomid;
    delete sc.handshake.session.roomid;
    sc.handshake.session.save();
    // console.log(sc.handshake.session.roomid,"===sdasdsfhaskfhdlhsld;g")
    // sc.broadcast.emit('sys',sc.handshake.session.user.nickname +' has been leaved')
    sc.leave(id);
    sc
      .to(id)
      .emit('sys', sc.handshake.session.user.nickname + ' has been leaved');
    removeUser(id);
  });

  async function newMsg(res) {
    if (!sc.handshake.session.user) {
      return;
    }
    // console.log(res,sc.handshake.session.user.nickname)
    const date = new Date();
    const time = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const result = {
      msg: res.msg,
      time,
      nickname: sc.handshake.session.user.nickname,
      username: sc.handshake.session.user.username
    };
    sc.to(res.id).emit('fetch-msg', result);
    sc.emit('fetch-msg', result);
    result.roomId = res.id;
    const chat = new Chat(result);
    let resp = await chat.save();
    // console.log(resp)
  }

  async function joinRoom(id) {
    if (!sc.handshake.session.user) {
      return;
    }
    sc.handshake.session.roomid = id;
    sc.handshake.session.save();
    console.log(sc.handshake.session.user.nickname + ' has been joined');
    sc.join(id);
    // const room = Room.findOne({'_id':id})
    const room = await Room.findOne({ _id: id });
    // room.onlineMembers  for  sc.handshake.session.user.username
    //return

    // const om = room.onlineMembers   // alias 浅拷贝
    const om = [...room.onlineMembers]; // room 里面的属性都是只读的。。

    for (var i = 0; i < om.length; i++) {
      if (om[i].username === sc.handshake.session.user.username) {
        return;
      }
    }

    // const om = [].concat(room.onlineMembers)
    om.push({
      nickname: sc.handshake.session.user.nickname,
      username: sc.handshake.session.user.username
    });
    await Room.update({ _id: id }, { onlineMembers: om });
    // console.log(room.onlineMembers)
    sc
      .to(id)
      .emit('sys', sc.handshake.session.user.nickname + ' has been joined');
    sc.emit('sys', sc.handshake.session.user.nickname + ' has been joined');
    // console.log(id)
    // console.log(sc.handshake.session.user.nickname+' has been joined')
  }

  async function removeUser(id) {
    const room = await Room.findOne({ _id: id });
    const om = [...room.onlineMembers];
    for (var i = 0; i < om.length; i++) {
      var a = om[i].username;
      if (a === sc.handshake.session.user.username) {
        om.splice(i, 1);
      }
    }
    await Room.update({ _id: id }, { onlineMembers: om });
  }

  function exitRoom(id) {
    if (!sc.handshake.session.user) {
      return;
    }
    sc.leave(id, function(err) {
      if (err) {
        console.log(err);
      } else {
        sc
          .to(id)
          .emit('sys', sc.handshake.session.user.nickname + ' has been left');
        sc.emit('sys', sc.handshake.session.user.nickname + ' has been left');
      }
    });
    removeUser(id);
    // console.log(sc.handshake.session.user.nickname+' has been exited')
  }
}

http.listen(8000, function() {
  console.log('server listening on 8000');
});

// async function main() {
// const room = await Room.findOne({'_id':'5a4364e2c552da89a1580d28'})
// const om = []
// om.concat(room.onlineMembers)
// om.push({
//   nickname: 'sc.handshake.session.user.nickname',
//   username: 'sc.handshake.session.user.username'
// })
// console.log(om)
// const qq = await Room.update({'_id':'5a4364e2c552da89a1580d28'},{'onlineMembers': om})

// console.log(qq)

// }

// main()

// /
