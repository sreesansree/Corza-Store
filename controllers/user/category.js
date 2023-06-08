const Product = require('../../model/productModel');
const Category = require('../../model/categoryModel');


const catFilter = async (req, res) => {
    try {
        const id = req.query.id;
        const productdata = await Product.find({ category: id, is_blocked: false });
        res.json(productdata);
    } catch (error) {
        console.log(error.message);
    }
}

const categoryFilter = async (req, res) => {
    try {
        const id = req.query.id
        console.log(id, 1888)
        const catData = await Category.find()
        const productData = await Product.find({ category: id, is_blocked: false })
        res.render('category', { productData, catData })
    } catch (error) {
        console.log (error.message);
    }
}

const loadWomCat = async (req, res) => {
    try {
        const id = req.query.id
        console.log(id, 299);
        const womenData = await Product.find({ category: id, is_blocked: false })
        console.log('women dataaa', womenData)
        if (req.session.userdata) {
            res.render('women', { womenData, userData })
        } else {
            res.render('women', { womenData })
        }
    } catch (error) {
        console.log(error);
    }
}

const loadMenCat = async (req, res) => {
    try {
        id = req.query.id
        const menData = await Product.find({ category: id, is_blocked: false })
        if (req.session.user) {
            res.render('men', { menData, userData })
        } else {
            res.render('men', { menData })
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    catFilter,
    categoryFilter,
    loadWomCat,
    loadMenCat
}