
const express = require("express");
const adminRoute = express();

const adminController = require("../controllers/admin/adminController");
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const dashboardController = require('../controllers/admin/dashboardController');
const couponController = require('../controllers/couponController');

const session = require('express-session');
const adminauth = require('../middleware/adminauth');
const app = express();
const store = require('../middleware/multer');


adminRoute.set('view engine', 'hbs')
adminRoute.set('views', './views/admin')


app.post('/updateproduct',store.store .array('image'), function (req, res) {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  res.status(200).json({ message: 'Image uploaded successfully' });
});

adminRoute.use(session({ secret: process.env.sessionsecret, resave: true, saveUninitialized: false }));


adminRoute.get('/', adminController.adminLogin)
adminRoute.post('/', adminauth.isLogoutAdmin, adminController.verifyadmin);

adminRoute.get('/adminhome',adminauth.isLoginAdmin,adminController.adminHome)

// adminRoute.get('/dashboard', adminauth.isLoginAdmin, adminController.loadDashboard)
adminRoute.get('/users', adminauth.isLoginAdmin, adminController.userList)
adminRoute.get("/logout", adminauth.isLoginAdmin, adminController.adminLogout);

//block or unblock user
adminRoute.get('/blockUser', adminauth.isLoginAdmin, adminController.blockUser)
adminRoute.get('/unblockUser', adminauth.isLoginAdmin, adminController.unblockUser)

//category
adminRoute.get('/category', adminauth.isLoginAdmin, categoryController.loadCategory);
adminRoute.get('/addcategory', adminauth.isLoginAdmin, categoryController.loadAddCategory)
adminRoute.post('/addcategory', store.store.single('image'), categoryController.insertCategory)
adminRoute.get('/editCategory', adminauth.isLoginAdmin, categoryController.loadEditCategory)
adminRoute.post('/editCategory',store.store.single('image') ,adminauth.isLoginAdmin, categoryController.updatecategory)
adminRoute.post('/delete', adminauth.isLoginAdmin, categoryController.deleteCategory);

//product
adminRoute.get('/product', adminauth.isLoginAdmin, productController.loadProduct);
adminRoute.get('/addproduct', adminauth.isLoginAdmin, productController.loadAddProduct);
adminRoute.post('/addproduct', adminauth.isLoginAdmin, store.store.array('image', 10),store.sharpImage,productController.addProduct);
adminRoute.get('/updateProduct/:id', adminauth.isLoginAdmin, productController.loadUpdateProduct);
adminRoute.post('/updateProduct/:id', adminauth.isLoginAdmin, store.store.array('image', 10),store.sharpImage, productController.updateProduct)


//coupon

adminRoute.get('/coupon',adminauth.isLoginAdmin,couponController.loadCoupon);
adminRoute.get('/addNewCoupon',adminauth.isLoginAdmin,couponController.addCoupon);
adminRoute.post('/addNewCoupon',adminauth.isLoginAdmin,couponController.addCouponPost);
adminRoute.get('/delete_cpn',couponController.deleteCoupon);
//block product
adminRoute.get('/blockproduct',adminauth.isLoginAdmin,productController.blockProduct);
adminRoute.get('/unblockproduct',adminauth.isLoginAdmin,productController.unBlockProduct);

//order
adminRoute.get('/orders',adminauth.isLoginAdmin,adminController.getOrder);
adminRoute.get('/order_Details',adminauth.isLoginAdmin,adminController.orderdetails)
adminRoute.post('/change_status',adminauth.isLoginAdmin,adminController.changeOrderStatus)

//salesDashboard
adminRoute.get('/dashboard', adminauth.isLoginAdmin, dashboardController.loadDashboard); 
adminRoute.post('/daily-report',adminauth.isLoginAdmin,dashboardController.dailySales);
adminRoute.get('/dailysales/download',adminauth.isLoginAdmin,dashboardController.dailyDownload);
adminRoute.post('/monthly-report',adminauth.isLoginAdmin,dashboardController.monthlysales)
adminRoute.get('/monthlysales/download',dashboardController.monthlyDownload);
adminRoute.post('/yearly-report',adminauth.isLoginAdmin,dashboardController.yearlysales);
adminRoute.get('/yearlysales/download',dashboardController.yearlydownload)

module.exports = adminRoute;