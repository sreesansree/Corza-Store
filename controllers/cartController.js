const User = require('../model/userModel');
const Product = require('../model/productModel');
const Category = require('../model/categoryModel');

const Swal = require('sweetalert2')
const hbs = require('hbs');
const { log } = require('handlebars/runtime');
// define a helper function
hbs.registerHelper("calculateItemPrice", function (item) {
  return item.product.price * item.quantity;
});

//...  Add to cart...//






const loadCart = async (req, res) => {
  try {
    const userId = req.query.id
    console.log(userId);

    const user1 = req.session.userdata
    const userData = await User.findById({ _id: user1._id })

    const user = await User.findOne({ _id: userId }).populate('cart.product').lean()
    const cart = user.cart; // Get the 'cart' array from the user document

    console.log(cart, 'cartttt......................')

    let subTotal = 0
    cart.forEach((val) => {
      val.total = val.product.price * val.quantity
      subTotal += val.total
    })


    if (user.cart.length === 0) {
      res.render('empty_cart', { userData })
    } else {
      res.render('cart', { userData, cart, subTotal })
    }
  } catch (error) {
    console.log(error.message)
  }
}



async function addToCart(req, res) {
  try {

    const user = req.session.userdata
    const userData = await User.findById({ _id: user._id })
    const proId = req.query.id;
    const userId = userData._id;

    const product = await Product.findById(proId);
    const existed = await User.findOne({ _id: userId, 'cart.product': proId });

    if (existed) {
      await User.findOneAndUpdate(
        { _id: userId, 'cart.product': proId },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true }
      );
      res.json({ message: 'Item alredy in cart' });

    } else {
      await Product.findByIdAndUpdate(proId, { isOnCart: true });
      await User.findByIdAndUpdate(userId,
        { $push: { cart: { product: product._id, } } },
        { new: true }
      );
      res.json({ message: 'Item added to cart' });
    }

  } catch (error) {
    console.log(error.message);
  }

}






const removeCart = async (req, res) => {
  try {
    const user = req.session.userdata
    const userData = await User.findById({ _id: user._id })
    const userId = userData._id;
    const proId = req.query.proId;
    const cartId = req.query.cartId;

    await Product.findOneAndUpdate(
      { _id: proId, isOnCart: true }, // Ensure the product is still in the cart
      { $set: { isOnCart: false } },
      { new: true }
    );

    await User.updateOne(
      { _id: userId },
      { $pull: { cart: { product: proId } } }
    );
      
    res.json('item removed');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while removing the item from the cart.' });
  }
};


// const removeCart = async (req, res) => {
//   try {
//     if (req.session.userdata) {
//       const userId = req.session.userdata._id;
//       const cartItemId = req.query.id;

//       const updatedUser = await User.findOneAndUpdate(
//         { _id: userId },
//         { $pull: { cart: { product: cartItemId } } },
//         { new: true }
//       );

//       req.session.userdata = updatedUser;
//       const user = await User.findOne({ _id: userId }).populate("cart.product");
//       const cart = user.cart;
//       let cartTotal = 0;
//       for (let i = 0; i < cart.length; i++) {
//         const item = cart[i];
//         const product = item.product;
//         const quantity = item.quantity;
//         const total = product.price * quantity; // Calculate the total for the current item
//         item.total = total; // Add the total to the item object
//         cartTotal += total; // Add the total to the cart total variable
//       }


//       res.render("cart", {
//         userData: req.session.userdata,
//         cartItems: cart,
//         cartTotal,
//       });
//     } else {
//       throw new Error('User not logged in');
//     }
//   } catch (error) {

//     res.status(500).send('An error occurred while removing item from cart');
//   }
// };


const updateCart = async (req, res) => {
  try {
    const user = req.session.userdata
    const userData = await User.findById({ _id: user._id })
    let data = await User.find(
      { _id: userData._id },
      { _id: 0, cart: 1 }
    ).lean();

    data[0].cart.forEach((val, i) => {
      val.quantity = req.body.datas[i].quantity;
    });

    await User.updateOne(
      { _id: userData._id },
      { $set: { cart: data[0].cart } }
    );

    res.json("from backend ,cartUpdation json");
  } catch (error) {
    console.log(error.message)
  }
};






module.exports = {
  addToCart,
  loadCart,
  removeCart,
  updateCart

};
