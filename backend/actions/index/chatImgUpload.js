const path = require('path')
const chatImgUpload = async function(req,res){
  try {
    name = req.session.user.username    
  } catch (error) {
    res.json({"status":505})      //505未登录
    return
  }
  if(req.files){
    const filename = `uploadimg/${new Date().getTime()}${path.extname(req.files.file.name)}`
    // let err = await req.files.file.mv(path.join(__dirname,filename))
    // console.log(filename)
    let err = await req.files.file.mv(path.join(process.cwd(),filename))
    if(err){
      res.json({status:507,msg:err})
    }
    res.json({status:200,pic:filename})
  } else {
    res.json({msg:'Please input a file.'})
  }
}
// console.log(process.cwd())
module.exports = chatImgUpload