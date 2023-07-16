const express = require("express");
const userRoute = express();
const config = require('../config/config')
const auth = require('../middleware/userauth')
const session = require('express-session')
const userController = require("../controllers/user/userController")
const cartController = require('../controllers/cartController');
const profileController = require('../controllers/user/profileController');
const orderController = require('../controllers/orderController')
const checkoutController = require('../controllers/checkoutController');
const categoryController = require('../controllers/user/category');
const catFilterController = require('../controllers/user/category');
const wishlistController  = require('../controllers/user/wishlistController');
// const productController = require('../controllers/productController')
userRoute.set('view engine', 'hbs')
userRoute.set('views', './views/users')

const bodyParser = require("body-parser");
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }))
// const multer = require("multer");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/userImages'));
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + '-' + file.originalname;
//         cb(null, name);
//     }
// });
// const upload = multer({ storage: storage })

userRoute.use(session({ secret: "mysitesessionsecret", resave: true, saveUninitialized: false }))


userRoute.get('/', userController.loadHome);
userRoute.get("/login", userController.loginLoad);
userRoute.post('/login', userController.verifylogin);

userRoute.get('/register', userController.loadRegister);
userRoute.post('/register', userController.insertUser);

userRoute.get('/otpverification', userController.getotp);
userRoute.post('/otpverification', userController.verifyOtp);

userRoute.get('/forgotpassword', userController.loadforgotpassword);
userRoute.post('/forgotpassword', userController.verifyemail);
userRoute.get('/forgotpassword/otp', userController.loadforgototp);
userRoute.post('/forgotpassword/otp', userController.verifyforgototp);
userRoute.get('/restpassword', userController.loadresetpassword);
userRoute.post('/restpassword', userController.resetpassword);


// session home
userRoute.get('/home', auth.isLogin, userController.loadHome);
userRoute.get('/logout', auth.isLogin, userController.logout);

// product
userRoute.get('/products', userController.getProduct);
userRoute.get('/productDetail', userController.ProductView);
userRoute.get('/women', catFilterController.loadWomCat);

// cart
userRoute.get('/cart', auth.logedin, auth.checkBlocked, cartController.loadCart)
userRoute.get('/add_to_cart', auth.logedin, auth.checkBlocked, cartController.addToCart)
userRoute.get('/remove', auth.isLogin, auth.checkBlocked, cartController.removeCart)
userRoute.post('/cart_updation', auth.logedin, auth.checkBlocked, cartController.updateCart)




//profile
userRoute.get('/profile', auth.isLogin, profileController.loadProfile);
userRoute.get('/edit_details', auth.isLogin, profileController.editDetails);
userRoute.post('/update_details/:id', auth.isLogin, profileController.updateProfile)

//address
userRoute.get('/adresses', auth.isLogin, profileController.manageAddress)
userRoute.get('/add_new_adress', auth.isLogin, profileController.addNewAddress);
userRoute.post('/add_new_adress', auth.isLogin, profileController.insertNewAddress);
userRoute.get('/delete_address/:id', auth.isLogin, auth.isLogin, profileController.deleteAddress)
userRoute.get('/editaddress/:id', auth.isLogin, auth.checkBlocked, profileController.loadeditaddress)
userRoute.post('/editaddress/:id', auth.isLogin, auth.checkBlocked, profileController.editaddress)

// checkaddress
userRoute.get("/add-checkoutaddress", auth.isLogin, auth.checkBlocked, profileController.addNewAddresss);
userRoute.post("/add-checkoutaddress", auth.isLogin, auth.checkBlocked, profileController.checkoutsaveaddress);


//checkout
userRoute.get('/checkout', auth.isLogin, auth.checkBlocked, checkoutController.loadCheckout);
userRoute.get('/check_stock', auth.isLogin, auth.checkBlocked, checkoutController.checkStock);
userRoute.post('/place_order', auth.isLogin, auth.checkBlocked, checkoutController.placeOrder);



//order
userRoute.get('/order_sucess', auth.isLogin, orderController.orderSuccess);
userRoute.get('/my_orders', auth.isLogin, orderController.myOrders);
userRoute.get('/order_details', auth.isLogin, orderController.orderDetails);
userRoute.get('/return_order', auth.isLogin, auth.checkBlocked, orderController.returnOrder);
userRoute.post('/cancel_order/:id', auth.isLogin, auth.checkBlocked, orderController.cancelOrder);
// userRoute.put("/orders/:orderId/cancel",auth.isLogin, orderController.cancellOrder);


userRoute.get('/category_fil', categoryController.catFilter);
userRoute.get('/category', categoryController.categoryFilter);

userRoute.post('/validate_coupon', auth.isLogin, auth.checkBlocked, checkoutController.validateCoupon);

//wishlist

userRoute.get('/wishlist',auth.isLogin,wishlistController.loadWishlist);






module.exports = userRoute;

