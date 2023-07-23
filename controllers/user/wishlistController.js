const User = require('../../model/userModel');
const Product = require('../../model/productModel');
// const wishlist = require('../../model/wishlistModel');





const loadWishlist = async (req, res) => {
  try {
    const userId = req.query.id
    const user1 = req.session.userdata
    // const userData = req.session.userdata;
    // const userId = userData._id;
    // const user = await User.findById(userId).populate('wishlist');
    const userData = await User.findById({ _id: user1._id })

    const user = await User.findById({ _id: user1._id }).populate('wishlist');
    const wishItem = user.wishlist;
    res.render('wishlist', { userData, wishItem });

  } catch (error) {
    console.log(error.message);
  }
}





const addToWishlist = async (req, res) => {
  try {
    const userData = req.session.userdata;
    const userId = userData._id;
    const proId = req.query.id;

    const user = await User.findById(userId);
    const itemExists = user.wishlist.includes(proId);

    if (!itemExists) {
      await User.updateOne({ _id: userId }, { $push: { wishlist: proId } });
      await Product.updateOne({ _id: proId }, { isWishlisted: true });
      res.json({ message: 'Added' });
    } else {
      res.json({ message: 'Exist' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};




const removeFromWishList = async (req, res) => {
  try {
    const userData = req.session.userdata
    const userId = userData._id
    const proId = req.query.id

    const user = await User.findById(userId)
    const itemIndex = user.wishlist.indexOf(proId)

    if (itemIndex >= 0) {
      await User.updateOne({ _id: userId }, { $pull: { wishlist: proId } })
      await Product.updateOne({ _id: proId }, { isWishlisted: false })
      res.json({
        message: 'Item removed from wishlist!',
        status: true
      })
    } else {
      res.json({ message: 'Item not found in wishlist!' })
    }

  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  loadWishlist,
  addToWishlist,
  removeFromWishList
}