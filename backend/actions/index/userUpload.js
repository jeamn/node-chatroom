// import Img from "../../models/img"//第一种
const path = require('path');
const fs = require('fs');
const userUpload = async function(req, res) {
  const Img = req.model.Img; //第二种比较好
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
    // console.log(filename)
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
};

module.exports = userUpload;
