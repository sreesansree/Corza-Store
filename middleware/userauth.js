const User = require('../model/userModel');
const isLogin = async (req, res, next) => {
  try {
    if (req.session.userdata) {
      next()
    } else {
      res.redirect('/')
    }

  } catch (error) {
    console.log(error.message);
  }
}
const isLogout = async (req, res, next) => {
  try {
    if (req.session.userdata) {
      next()
    } else {
      res.redirect('/home')
    }
  } catch (error) {
    console.log(error.message);
  }
}

const logedin = async(req, res, next)=>{
  try {

      if(!req.session.userdata){
          res.redirect('/login')
      }else{
          next()
      }
      
  } catch (error) {
      console.log(error.message);
  }

}

const checkBlocked = async (req, res, next) => {
  const userid = req.session.userdata_id
  const userdata = await User.findOne({ _id: userid })
  if (userdata && userdata.is_blocked == true) {
    res.session.destroy()
    return res.redirect('/login')
  }
  return next()
}
module.exports = {
  isLogin,
  isLogout,
  checkBlocked,
  logedin
}