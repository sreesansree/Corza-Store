

const Coupon = require('../model/couponModel');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const hbd = require('hbs');
const moment = require("moment");

const loadCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find();
        const now = moment();
        const couponData = coupon.map((cpn) => {
            const formattedDate = moment(cpn.expiryDate).format('MMMM D, YYYY');

            return {
                ...cpn,
                expiryDate: formattedDate
            }
        });
        res.render('coupon', { couponData });

    } catch (error) {
        console.log(error.message);
    }
}

const addCoupon = async (req, res) => {
    try {
      let couponMsg = "";
      let couponExMsg = "";
  
      if (req.session.coupon) {
        couponMsg = "Coupon added successfully..!!";
        req.session.coupon = false;
      } else if (req.session.exCoupon) {
        couponExMsg = "Coupon already exists..!!";
        req.session.exCoupon = false;
      }
  
      res.render("addNewCoupon", { couponMsg, couponExMsg });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  

const addCouponPost = async (req, res) => {
    try {
        const { code, percent, expDate } = req.body;
        const cpnExist = await Coupon.findOne({ code: code });
        
    if (!cpnExist) {
        const coupon = new Coupon({
          code: code,
          discount: percent,
          expiryDate: expDate,
        });
  
        await coupon.save();
        req.session.coupon = true;
        res.redirect("/admin/addNewCoupon");
      } else {
        req.session.exCoupon = true;
        res.redirect("/admin/addNewCoupon");
      }

    } catch (error) {
        console.log(error.message)
    }
}

const deleteCoupon = async (req, res) => {
    try {
      const id = req.query.id;
      await Coupon.findByIdAndDelete(id);
      res.redirect("/admin/coupon");

    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    loadCoupon,
    addCoupon,
    addCouponPost,
    deleteCoupon
}