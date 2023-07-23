let mongoose = require('mongoose');
const Admin = require("../../model/adminModel");
const User = require("../../model/userModel");
const Order = require('../../model/orderModel');
const multer = require('multer');
const moment = require("moment");
const Address = require('../../model/addressModel');
// const upload = multer({ dest: 'upload/' });
// const argon2 = require("argon2");
const hbs = require('hbs')
hbs.registerHelper("eq", function (a, b) {
    return a === b;
});


//Load Admin Login
let adminLogin = (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
    }
};
//admin dahboard
const verifyadmin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;


        const adminData = await Admin.findOne({ email: email })
        console.log(adminData);
        // console.log(password);

        if (adminData) {
            if (password == adminData.password) {
                req.session.adminLogin = true;
                req.session.admin = adminData;
                res.redirect('/admin/dashboard')
            } else {
                res.render('login', ({ messageErr: 'Please check your password' }))
            }
        } else {
            res.render('login', ({ message: `email dosen't exist` }))
        }
    } catch (error) {
        console.log(error.message);
    }
}
// to get home page
const adminHome = async (req, res) => {
    try {
        res.render('adminhome');
    } catch (error) {
        console.log(error.message);
    }
}


//users list
const userList = async (req, res) => {
    try {
        const PAGE_SIZE = 10; // Number of items per page
        const page = parseInt(req.query.page, 10) || 1; // Ensure to specify radix 10
        const totalUsers = await User.countDocuments();

        const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
        const skip = (page - 1) * PAGE_SIZE;
        const userData = await User.find().sort({ name: 1 }).skip(skip).limit(PAGE_SIZE);


        res.render("userslist", {
            userData,
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: PAGE_SIZE,
        })
    } catch (error) {
        console.log(error.message);
    }
}


const blockUser = async (req, res) => {
    try {

        const userData = await User.findOneAndUpdate(
            { _id: req.query.id },
            { $set: { is_blocked: true } }
        );
        console.log(userData);
        res.redirect("users");
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const unblockUser = async (req, res) => {
    try {
        const userData = await User.findOneAndUpdate(
            { _id: req.query.id },
            { $set: { is_blocked: false } }
        );
        console.log(userData);
        res.redirect("users");
    } catch (error) {
        console.log(error.message);
    }
};


const loadDashboard = async (req, res) => {
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message);
    }
}
//admin  logout
const adminLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

const getOrder = async (req, res) => {
    try {
        const PAGE_SIZE = 10; // Number of items per page
        const page = parseInt(req.query.page, 10) || 1; // Ensure to specify radix 10

        // Fetch the total number of orders from the database to calculate total pages
        const totalOrders = await Order.countDocuments();

        const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

        const skip = (page - 1) * PAGE_SIZE;
        const orders = await Order.find().sort({ date: -1 }).skip(skip).limit(PAGE_SIZE);


        const now = moment();

        const ordersData = orders.map((order) => {
            const formattedDate = moment(order.date).format("MMMM D, YYYY");
            return {
                ...order.toObject(),
                date: formattedDate,
            };
        })
        // console.log(ordersData, 1234);
        res.render("orders", {
            ordersData: orders,
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: PAGE_SIZE,

        })
    } catch (error) {
        console.log(error.message);
    }
}
const orderdetails = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const orderId = req.query.id;

        const myOrderDetails = await Order.findById(orderId);
        const orderedProDet = myOrderDetails.product;
        const addressId = myOrderDetails.address;

        const address = await Address.findById(addressId);

        res.render("order_Details", {
            myOrderDetails,
            orderedProDet,
            userData,
            address,
        });
    } catch (error) {
        console.log(error.message);
    }
}

const changeOrderStatus = async (req, res) => {
    console.log(req.body);

    try {
        const id = req.query.id;
        const status = req.body.status;

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: { status: status } },
            { new: true }
        );
        res.redirect("/admin/orders");
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    adminLogin,
    verifyadmin,
    loadDashboard,
    adminLogout,
    adminHome,
    userList,
    blockUser,
    // blockFun,
    // unblockFun,
    unblockUser,
    getOrder,
    orderdetails,
    changeOrderStatus

}
