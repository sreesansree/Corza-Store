const User = require('../model/userModel');
const Product = require('../model/productModel');
const Address = require('../model/addressModel');
const Order = require('../model/orderModel');

const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const moment = require("moment");
const { validateHeaderValue } = require('http');
 
const myOrders = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const userId = userData._id

        const orders = await Order.find().sort({ data: -1 })
        const formattedOrders = orders.map(order => {
            const formattedDate = moment(order.date).format('MMMM D,YYYY');
            return { ...order.toObject(), date: formattedDate }
        })
        console.log("orders"+orders)

        res.render('my_orders', { userData, myOrders: formattedOrders || [], })
    } catch (error) {
        console.log(error.message)
    }
}

hbs.registerHelper("addOne", function (value) {
  return value + 1;
});


hbs.registerHelper("eq", function (a, b) {
    return a === b;
});

hbs.registerHelper("noteq", function (a, b) {
    return a !== b;
});

hbs.registerHelper("formatDate", function (date, format) {
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
    const formattedDate = new Date(date).toLocaleString("en-US", options);
    return formattedDate;
});

hbs.registerHelper("for", function (from, to, incr, block) {
    let accum = "";
    for (let i = from; i <= to; i += incr) {
        accum += block.fn(i);
    }
    return accum;
});


const orderSuccess = (req, res) => {
    try {
        const userData = req.session.userdata
        res.render('order_sucess', { userData })
    } catch (error) {
        console.log(error.message);
    }
}

const orderDetails = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const orderId = req.query.id;

        const myOrderDetails = await Order.findById(orderId);
        const orderedProDet = myOrderDetails.product;
        const addressId = myOrderDetails.address;
        
        const address = await Address.findById(addressId)

        res.render('order_Details', { myOrderDetails, orderedProDet, userData, address })


    } catch (error) {
        console.log(error.message)
    }
}
const returnOrder = async(req, res) => {
    try {
        const id = req.query.id

        await Orders.findByIdAndUpdate(id, { $set: { status: 'Returned' } }, { new: true });

        res.json('sucess')
    } catch (error) {
        console.log(error);
    }
 }
 const cancelOrder = async(req, res) => {
    try {
        const id       = req.query.id
        const userData = req.session.user
        
       

        await Order.findByIdAndUpdate(id, { $set: { status: 'Cancelled' } }, { new: true });

        res.json('sucess')
    } catch (error) {
        console.log(error);
    }
 }

module.exports = {
    myOrders,
    orderSuccess,
    orderDetails,
    returnOrder,
    cancelOrder
}


