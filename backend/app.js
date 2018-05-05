const express = require('express');
const app = new express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const config = require('./config/default');
const sharedsession = require('express-socket.io-session');
var MongoStore = require('connect-mongo')(require('express-session'));
// const moment = require('moment');
require('./db');
app.use(fileUpload());

app.use(
  cors({
    origin: 'http://localhost:3000',
    preflightContinue: true,
    credentials: true
  })
);

//第一种写法转换为第二种写法
app.use(function(req, res, next) {
  req.model = require('./models');
  return next();
});

//静态文件处理
app.use('/uploadimg', express.static(path.join(__dirname, 'uploadimg')));
// sendFile

//提供会话ID（存在cookie里）的会话支持
var half_hour = 3600000 / 2;
const session = require('express-session')({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: 'asdasdasfdsad',
  resave: true,
  saveUninitialized: true
});

// app.use(session({
//   secret: 'gupjia.ng@me',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false,
//     maxAge: half_hour
//   }
// }));

app.use(session);
// io.use(sharedsession(session, {
//     autoSave:true
// }));

//bodyParser中间件会解析所有的请求体数据，并放置到req.body对象中。
//如果请求的数据是JSON格式，每个数据字段都会保存到req.body中作为对象的字段
app.use(bodyParser.json({ type: 'application/json' }));

var routes = require('./routes/index');
app.use('/', routes);

var adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// socket.io
const onConnect = require('./sockets/index');
var io = require('socket.io')(http);
io.use(
  sharedsession(session, {
    autoSave: true
  })
);
io.on('connection', onConnect);

//全局处理函数,该方法会放置到所有其他中间件和路由函数后面，成为express在应用中调用的最后一个函数（中间件）。
// app.use((err,req,res,next) => {
//   res.status(404)
//   res.end(JSON.stringify(err) + "\n")
// })

//通过process对象在全局应用范围内指定错误处理函数，然后最糟糕的是要结束node进程。
//尽可能在会出错的地方捕捉错误
// process.on('uncaughtException',err => {
//   console.log('Caught exception: ' + err);
//   process.exit(-1)
// })

http.listen(config.port, function() {
  console.log(`server listening on ${config.port}`);
});
