const mongoose = require('mongoose');
mongoose.connect(
  'mongodb://localhost/nodechat',
  { useMongoClient: true },
  function(err) {
    if (err) {
      console.log(err);
      process.exit();
    }
  }
);
mongoose.Promise = global.Promise; //何解
