
const User = require("../../model/userModel");
const Category = require('../../model/categoryModel');
const Product = require('../../model/productModel');
const nodeMailer = require("nodemailer");
const Banner = require('../../model/bannerModel');
const session = require('express-session');
const argon2 = require('argon2');
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
            cc: "sreesankarputhuman@gmail.com",
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


const insertUser = async (req, res) => {

    try {

        //    let password =  await securePassword(userRegData.password)

        const { name, email } = req.body;
        userRegData = req.body;
        console.log(userRegData);
        //    userRegData.password = userRegData.password[0]

        const existUser = await User.findOne({ email: email })
        // req.session.userRegData = userRegData
        console.log(existUser, 911);
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
        const walletValue = userRegData.wallet || 0;
        const password = await argon2.hash(userRegData.password);
        const enteredotp = req.body.otp;

        if (otp == enteredotp) {
            const user = new User({
                name: userRegData.name,
                email: userRegData.email,
                mobile: userRegData.mobile,
                password: password,
                is_blocked: false,
                is_verfied: false,
                wallet: walletValue
            });
            const userData = await user.save();
            console.log(userData);

            res.render('login', { successMessage: "Registration successful" });
        } else {
            res.render('otpverification', { message: "Invalid OTP" });
        }
    } catch (error) {
        console.log(error.message);
    }
};


//To resend otp

const resendOtp = async (req, res) => {
    try {
        res.redirect('/get_otp')
        otp = await userHelper.verifyEmail(userEmail)
    } catch (error) {
        console.log(error);
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
        const loadProData = await Product.find();
        const loadCatData = await Category.find();
        const banners = await Banner.find();
        const user = req.session.userdata;
        const userId = user?._id;

        if (userId) {
            const userData = await User.findById(userId);
            res.render('home', { userData, loadCatData, loadProData, banners });
        } else {
            res.render('home', { loadCatData, loadProData, banners });
        }
    } catch (error) {
        console.log(error);
    }
};

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
        const loadCatData = await Category.find();
        const proData = await Product.find({ is_blocked: false });

        if (req.session.userdata) {
            const userId = req.session.userdata._id;
            const userData = await User.findById({ _id: userId });
            res.render('products', { proData, userData, loadCatData });
        } else {
            console.log("products");
            res.render('products', { proData, userData: null, loadCatData });
        }
    } catch (error) {
        console.log(error.message);
    }
};


const ProductView = async (req, res) => {
    try {
        const proId = req.query.id
        console.log(proId, 'pro queryyyyy')
        const proData = await Product.findById(proId)
        console.log(proData, 'prodataaa')
        if (req.session.userdata) {
            const user = req.session.userdata
            const userData = await User.findById({ _id: user._id })

            res.render('productDetail', { proData, userData })
        } else {
            res.render('productDetail', { proData })
        }
    } catch (error) {
        console.log(error);
    }
}
const loadforgotpassword = async (req, res) => {
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
            console.log('existtttttttt')
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
            res.render('otpforgotpassword', { message: 'Entered otp wrong' })
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



// const productSearch = async(req, res)=>{
//     const { search, catId } = req.body

//     console.log(search, catId);

//     if(catId){
//         console.log('cat id indddddd');
//         try {
//             const products = await Product.find({ category: catId, name: { $regex: search, $options: 'i' } });
//             res.json(products);
//           } catch (error) {
//             console.log(error);
//             return res.status(500).send();
//           }  
//      }else{
//         console.log('cat id illaaaa');
//         try {
//             const products = await Product.find({ name: { $regex: search, $options: 'i' } });
//             console.log(products);

//             res.json(products);
//           } catch (error) {
//             console.log(error);
//             return res.status(500).send();
//           }

//      }
//     }


//     const sortProduct_az = async(req, res) => {
//         try {
//             const { sort, catId } = req.body

//             if( catId ){
//                 const products = await Product.find({ category : catId }, {is_blocked: false}).sort({ name: sort });
//                 console.log(products);
//                 res.json(products)   

//             } else{
//                 const products = await Product.find( {is_blocked: false}).sort({ name: sort });
//                 console.log(products);
//                 res.json(products)
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     }


//     const sortProductByPrice = async(req, res) => {
//         try {
//             const { sort, catId } = req.body

//             console.log(req.body);
//             if(catId){
//                 const products = await Product.find({ category : catId }, {is_blocked: false}).sort({ price: sort });
//                 console.log(products);
//                 res.json(products)
//             }else{               
//             const products = await Product.find({is_blocked: false}).sort({ price: sort });
//             console.log(products);
//             res.json(products)
//              }

//         } catch (error) {
//             console.log(error);
//         }
//     }
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const proData = await Product.find({ is_blocked: false });

        // Assuming proData is your array of products
        const filteredProducts = proData.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json(filteredProducts);
    } catch (error) {
        console.log(error.message)
    }
}

const sortProducts = async (req, res) => {
    try {
        const { field, order } = req.query;
        console.log(req.query, "queryyyyy sort");
        const proData = await Product.find({ is_blocked: false });

        // Assuming proData is your array of products
        let sortedProducts = [];

        if (field === 'name') {
            sortedProducts = proData.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();

                if (order === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        } else if (field === 'price') {
            sortedProducts = proData.sort((a, b) => {
                if (order === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        }

        res.json(sortedProducts);
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
    resetpassword,
    resendOtp,
    searchProducts,
    sortProducts
    // productSearch,
    // sortProductByPrice,
    // sortProduct_az
}