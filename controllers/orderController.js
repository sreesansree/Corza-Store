const User = require('../model/userModel');
const Product = require('../model/productModel');
const Address = require('../model/addressModel');
const Order = require('../model/orderModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const moment = require("moment");
const easyinvoice = require('easyinvoice');

const { validateHeaderValue } = require('http');

const myOrders = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const userId = userData._id

        console.log(userData, "From orderDetails")

        const orders = await Order.find({ userId }).sort({ data: -1 })
        const formattedOrders = orders.map(order => {
            const formattedDate = moment(order.date).format('MMMM D,YYYY');
            return { ...order.toObject(), date: formattedDate }
        })

        console.log("orders" + orders)

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
hbs.registerHelper("or", function (a, b) {
    return a || b;
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
        res.render('order_Details', { myOrderDetails, orderedProDet, userData, address });

    } catch (error) {
        console.log(error.message)
    }
}
const returnOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        console.log(orderId, "OrderIDDDD")
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: "Returned" },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {

        res.status(500).json({ error: "Something went wrong" });
    }
};

// const cancelOrder = async (req, res) => {
//     try {
//         const id = req.query.id
//         const userData = req.session.userdata
//         const userId = userData._id

//         const { updateWallet, payMethod } = req.body
//         console.log("cancel order from orderdetails")
//         if (payMethod === 'wallet' || payMethod === 'razorpay') {
//             await User.findByIdAndUpdate(userId, { $set: { wallet: updateWallet } }, { new: true })
//         }

//         await Order.findByIdAndUpdate(id, { $set: { status: 'Cancelled' } }, { new: true });

//         res.json('sucess')
//     } catch (error) {
//         console.log(error);
//     }
// }
const cancellOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userData = req.session.userdata
        const userId = userData._id
        const { updateWallet, payMethod } = req.body
        if (payMethod === 'wallet' || payMethod === 'razorpay') {
            await User.findByIdAndUpdate(userId, { $set: { wallet: updateWallet } }, { new: true })
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,{$set:{ status: "Cancelled" }},
            { new: true }
        );

        res.json(updatedOrder);
    } catch (error) {

        res.status(500).json({ error: "Something went wrong" });
    }
};




const getInvoice = async (req, res) => {
    try {
        const orderId = req.query.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const { userId, address: addressId } = order;

        const [user, address] = await Promise.all([
            User.findById(userId),
            Address.findById(addressId),
        ]);

        const products = order.product.map((product) => ({
            quantity: product.quantity.toString(),
            description: product.name,
            tax: product.tax,
            price: product.price,
        }));

        const date = moment(order.date).format('MMMM D, YYYY');

        if (!user || !address) {
            return res.status(404).send({ message: 'User or address not found' });
        }

        const filename = `invoice_${orderId}.pdf`;

        const data = {
            currency: 'INR',
            taxNotation: 'vat',
            marginTop: 25,
            marginRight: 25,
            marginLeft: 25,
            marginBottom: 25,
            background: 'https://public.easyinvoice.cloud/img/watermark-draft.jpg',
            // Your own data
            sender: {
                company: 'Coza Store',
                address: 'Puthumana Wayanad',
                zip: '670645',
                city: 'Mananthavady',
                country: 'India',
            },
            // Your recipient
            client: {
                company: user.name,
                address: address.adressLine1,
                zip: address.pin,
                city: address.city,
                country: 'India',
            },

            information: {
                // Invoice number
                number: "2021.0001",
                // Invoice data
                date: date,
                // Invoice due date
                // duedate: "31-12-2021"
            },
            // invoiceNumber: '2023001',
            // invoiceDate: date,
            products: products

        };

        // easyinvoice.createInvoice(data, function (result) {

        easyinvoice.createInvoice(data, function (result) {
            const fileName = 'invoice.pdf'
            const pdfBuffer = Buffer.from(result.pdf, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            res.send(pdfBuffer);
        })
        console.log('PDF base64 string: ');
        // });
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};


module.exports = {
    myOrders,
    orderSuccess,
    orderDetails,
    returnOrder,
    cancellOrder,
    getInvoice
}


