const User = require('../../model/userModel');
const Product  =require('../../model/productModel');



const loadWishlist = async (req,res)=>{
    try {
    const userData  = req.session.userdata;
    console.log(userData ,"userdata from WishlistTest")
    const userId    = userData._id;   
    console.log(userData,"from wishlist") 
    const user      = await User.findById(userId).populate('wishlist');
    const wishItem  = user.wishlist;
    console.log(user,'userrrrr');
    console.log(wishItem,"wishItemmm");
    res.render('wishlist',{userData,wishItem});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadWishlist
}