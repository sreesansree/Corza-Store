const User = require('../model/userModel');
const Product = require('../model/productModel');
const Address = require('../model/addressModel');
const Order = require('../model/orderModel');
const Coupon = require('../model/couponModel')
const Razorpay = require('razorpay');








const loadCheckout = async (req, res) => {

  const user = req.session.userdata
  const userData = await User.findById({ _id: user._id })
  const userId = userData._id

  const addressData = await Address.find({ userId: userId })
  const userDataa = await User.findOne({ _id: userId }).populate("cart.product").lean()
  const cart = userDataa.cart

  let subTotal = 0
  cart.forEach((val) => {
    val.total = val.product.price * val.quantity
    subTotal += val.total
  })

  const now = new Date();
  const availableCoupons = await Coupon.find({
    expiryDate: { $gte: now },
    usedBy: { $nin: [userId] }
  });
  console.log(availableCoupons, 'helooooooooooo coupon aaann');

  res.render('checkout', { userData, cart, addressData, subTotal, availableCoupons })
}



const checkStock = async (req, res) => {
  const user = req.session.userdata
  const userData = await User.findById({ _id: user._id })
  const userId = userData._id;

  const addressData = await Address.find({ userId: userId });

  const userDataa = await User.findOne({ _id: userId }).populate("cart.product").lean();
  const cart = userDataa.cart;

  console.log(cart, 'cart 3777777777');

  // let subTotal = 0;
  // cart.forEach((val) => {
  //   val.total = val.product.price * val.quantity;
  //   subTotal += val.total;
  // });

  let stock = [];
  cart.forEach((el) => {
    if ((el.product.quantity - el.quantity) <= 0) {
      stock.push(el.product);
    }
  });

  console.log(stock, 'stockkkkkkkkkkkkkk');

  if (stock.length >= 0) {
    console.log('Sending JSON response with stock array');
    res.status(200).json(stock);
  } else {
    res.json('ok')
  }
  // else {
  //   console.log('Rendering checkout page');
  //   res.render('user/checkout/checkout', { userData, cart, addressData, subTotal });

  // }
};



const placeOrder = async (req, res) => {

  try {
    const user = req.session.userdata
    const userData = await User.findById({ _id: user._id })
    const userId = userData._id
    const addressId = req.body.selectedAddress
    const payMethod = req.body.selectedPayment
    console.log("payment method" + payMethod)

    const userDataa = await User.findOne({ _id: userId }).populate("cart.product")
    const cartPro = userDataa.cart

    let subTotal = 0

    cartPro.forEach((val) => {
      val.total = val.product.price * val.quantity
      subTotal += val.total
    })


    let productDet = cartPro.map(item => {
      return {
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image[0],
      }
    })


    const result = Math.random().toString(36).substring(2, 7);
    const id = Math.floor(100000 + Math.random() * 900000);
    const ordeId = result + id;

    /// order saving function
    console.log(req.session.couponData, "PlaceOrder CouponDataaaa")
    let saveOrder = async () => {
      console.log(req.body, "bodyyyyyy")
      if (req.body.couponData) {
        const order = new Order({
          userId: userId,
          product: productDet,
          address: addressId,
          orderId: ordeId,
          total: subTotal,
          paymentMethod     : payMethod,
          discountAmt       : req.body.couponData.discountAmt,
          amountAfterDscnt  : req.body.couponData.newTotal,
          coupon            : req.body.couponName
        })
        console.log(req.body.couponName, "couponnn name",)
        console.log(order, 'order with coupon data')
        const ordered = await order.save()

      } else {
        const order = new Order({
          userId: userId,
          product: productDet,
          address: addressId,
          orderId: ordeId,
          total: subTotal,
          paymentMethod: payMethod,
        })
        console.log(order, "order without coupon")
        await order.save()

      }

      let userDetails = await User.findById(userId)
      let userCart = userDetails.cart

      userCart.forEach(async item => {
        const productId = item.product
        const qty = item.quantity
        console.log(qty, "Quantity From place Order........")
        const product = await Product.findById(productId)
        const stock = product.quantity
        const updatedStock = stock - qty
        console.log(updatedStock, "updatedQuantity From place Order........")

        await Product.updateOne(
          { _id: productId },
          { $set: { quantity: updatedStock, isOnCart: false } }
        );
      })
      userDetails.cart = []
      await userDetails.save()
      console.log(userDetails.cart, "userDetails in cart");
    }


    if (addressId) {
      if (payMethod === 'cash-on-delivery') {
        console.log('From cash on delivery', 151111);

        saveOrder()

        res.json({
          CODsucess: true,
          toal: subTotal
        })
      }

      if (payMethod === 'razorpay') {
        console.log('created orderId request Razaorpay', req.body);

        const amount = req.body.amount;
        var instance = new Razorpay({
          key_id: process.env.RazorpayId,
          key_secret: process.env.RazorpayKeySecret
        })

        const order = await instance.orders.create({
          amount: amount * 100,
          currency: 'INR',
          receipt: 'sreesankar',
        });

        saveOrder()

        res.json({
          razorPaySucess: true,
          order,
          amount,
        });
      }
      /// payment method wallet function


      if (payMethod === 'wallet') {
        console.log('he he he am from wallet.................')
        const newWallet = req.body.updateWallet
        const userData = req.session.userdata

        console.log(newWallet, 'new wallettttttttttttttttttt');

        await User.findByIdAndUpdate(userId, { $set: { wallet: newWallet } }, { new: true })
        //    userData = updatedUser
        //    req.session.user = userData
        saveOrder()
        res.json(newWallet)
      }
    }
  } catch (error) {
    console.log(error);
  }
}



const validateCoupon = async (req, res) => {
  try {
    console.log(req.body, 'bodyyyyyyyyyyyyyyyyyyyyyy');
    const { couponVal, subTotal } = req.body;
    const coupon = await Coupon.findOne({ code: couponVal });

    if (!coupon) {
      res.json('invalid');
    } else if (coupon.expiryDate < new Date()) {
      res.json('expired');
    } else {
      const couponId = coupon._id;
      const discount = coupon.discount;
      const userId = req.session.userdata._id;

      const isCpnAlredyUsed = await Coupon.findOne({ _id: couponId, usedBy: { $in: [userId] } });

      if (isCpnAlredyUsed) {
        res.json('already used');
      } else {
        await Coupon.updateOne({ _id: couponId }, { $push: { usedBy: userId } });

        const discnt = Number(discount);
        const discountAmt = (subTotal * discnt) / 100;
        const newTotal = subTotal - discountAmt;

        const user = User.findById(userId);

        res.json({
          discountAmt,
          newTotal,
          discount,
          succes: 'succes'
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  checkStock,
  loadCheckout,
  placeOrder,
  validateCoupon
}