const path = require('path')
const readUserImg = async function (req, res) {
  const name = req.params.name
  const Img = req.model.Img
  const img = await Img.findOne({name})
  if (img) {
    const abspath = path.join(process.cwd(),img.imgpath)
    res.sendFile(abspath)
  } else {
    res.redirect("https://i.loli.net/2017/08/21/599a521472424.jpg")
  }
}

module.exports = readUserImg