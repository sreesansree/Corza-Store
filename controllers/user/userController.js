const mongoose   = require('mongoose');
const User       = require("../../model/userModel");
const Category   = require('../../model/categoryModel');
const Product    = require('../../model/productModel');
const nodeMailer = require("nodemailer");
const session    = require('express-session');
const argon2     = require('argon2');
// const bcrypt = require('bcrypt')
// const userRoute = require("../../routes/userRoute");
require('dotenv').config()

let userRegData



const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.message);
    }
}

const loginLoad = async (req, res) => {
    try {
        res.render("login")
    } catch (error) {
        console.log(error.message);
    }
}

let otp = `${Math.floor(1000 + Math.random() * 9000)}`



const sendmail = (name, email) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });
        const mailoptions = {
            from: "sreesankarputhuman@gmail.com",
            to: email,
            cc:"sreesankarputhuman@gmail.com",
            subject: "Verification Mail",
            text: `Hello ${name} Your OTP ${otp}`
        }
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('email has been set' + info.response);
            }
            return otp
        })

    } catch (error) {
        console.log(error.message)
    }
}
/* const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };
 */

const insertUser = async (req, res) => {

    try {

        //    let password =  await securePassword(userRegData.password)

        const { name, email } = req.body;
        userRegData = req.body;
        console.log(userRegData);
        //    userRegData.password = userRegData.password[0]

        const existUser = await User.findOne({ email: email })
        // req.session.userRegData = userRegData
        console.log(existUser,911);
        if (existUser == null) {
            sendmail(name, email)

            res.redirect('/otpverification')

        } else {
            if (existUser.email == email) {
                res.render('registration', { message1: "User already Exits" })
            }
        } 
    }
    catch (error) {
        console.log(error.message);
    }
}


// To get otp page
const getotp = (req, res) => {
    try {
        res.render('otpverification');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyOtp = async (req, res) => {
    try {
        const password = await argon2.hash(userRegData.password)
        // console.log(req.session, 105);
        // let userRegData = req.session.userRegData

        // console.log(userRegData, 107);
        const enteredotp = req.body.otp;

        console.log(enteredotp);
        if (otp == enteredotp) {
            const user = new User({
                name: userRegData.name,
                email: userRegData.email,
                mobile: userRegData.mobile,
                password: password,
                is_blocked: false,
                is_verfied: false,
                wallet: {}
            });
            const userData = await user.save();
            console.log(userData);
            // res.redirect('/login')
            res.render('registration', { message: "Rgistration successful" })
        } else {
            res.render('otpverification', { message: "invalid otp" })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const verifylogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const userData = await User.findOne({ email: email });


        //   const categories = await Category.find();
        console.log(req.body);
        if (userData) {
            console.log("mdlknnfslf");
            var passwordMatch = await argon2.verify(userData.password, password);
            // let passwordMatch = await securePassword(userRegData.password,password)
            console.log(password);
            console.log(passwordMatch);

            if (passwordMatch) {
                const is_blocked = userData.is_blocked;
                if (!is_blocked) {
                    req.session.userdata = userData;
                    // const session = req.session.userdata
                    res.redirect("/home"); //
                } else {
                    res.render("login", {
                        //   categories,
                        message1: "Unauthorised access",
                    });
                }
            } else {
                res.render("login", {
                    // categories,
                    message2: "Password is incorrect",
                });
            }
        } else {
            res.render("login", {
                //   categories,
                message3: "Email or Password is incorrect",
            });
        }
        // }
    } catch (error) {
        console.log(error.message);
    }
};



const loadHome = async (req, res) => {
    try {
        const loadProData = await Product.find()
        const loadCatData = await Category.find()
        const user = req.session.userdata
        const userId = user?._id
        const userData = await User.findById({_id:userId})
        if (userData) {
            res.render('home', { userData, loadCatData, loadProData })
        } else {
            res.render('home', { loadCatData, loadProData })
        }

    } catch (error) {
        console.log(error);
    }
}
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}

//all product page in user
const getProduct = async (req, res) => {
    try {
        const loadCatData = await Category.find()
        // console.log(loadCatData,261);
        const proData = await Product.find({ is_blocked: false });
        console.log(proData, 263);
        const user = req.session.userdata
        const userData = await User.findById({_id:user._id})
        res.render('products', { proData, userData, loadCatData })
    } catch (error) {
        console.log(error.message);
    }
}

const ProductView = async (req, res) => {
    try {
        const proId = req.query.id
        const proData = await Product.findById(proId)
        const user = req.session.userdata
        const userData = await User.findById({_id:user._id})
        if (req.session.userdata) {
            res.render('productDetail', { proData, userData })
        } else {
            res.render('productDetail', { proData })
        }
    } catch (error) {
        console.log(error);
    }
}
const loadforgotpassword=async(req,res)=>{
    try {
        res.render('forgotpassword')
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadforgototp = async (req, res) => {
    try {
        res.render('otpforgotpassword')
    } catch (error) {
        console.log(error.message)
    }
}

let email1
const verifyemail = async (req, res) => {
    email1 = req.body.email
    console.log(email1);
    const exist = await User.find({ email: email1 })
    try {
        if (exist) {
            sendmail(email1)
            res.render('otpforgotpassword')
        } else {
            res.redirect('/forgotpassword')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyforgototp = async (req, res) => {
    const forgototp = req.body.otp
    try {
        if (otp == forgototp) {
            res.render('resetpassword1')
        } else {
            res.redirect('/otpforgotpassword', { message: 'Entered otp wrong' })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadresetpassword = async (req, res) => {
    try {
        res.render('resetpassword1')

    } catch (error) {
        console.log(error.message)
    }
}
const resetpassword = async (req, res) => {
    const password = await argon2.hash(req.body.password);
    try {
        const userdata = await User.findOneAndUpdate({
            email: email1
        }, { $set: { password: password } }, { new: true })
        res.redirect('/login')
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    loadHome,
    getotp,
    sendmail,
    verifyOtp,
    verifylogin,
    logout,
    // securePassword
    getProduct,
    ProductView,
    loadforgotpassword,
    loadforgototp,
    verifyemail,
    verifyforgototp,
    loadresetpassword,
    resetpassword
}