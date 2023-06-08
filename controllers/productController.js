const mongoose = require("mongoose");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const category = require("../model/categoryModel");
const path = require('path');
const { log, error } = require("console");

const loadProduct = async (req, res) => {
    try {
        console.log('product');
        const productdata = await Product.find().populate("category")
        const categorydata = await category.find();


        // console.log(productdata);
        res.render('product', { Product: productdata, categorydata });
    } catch (error) {
        console.log(error.message);
    }
}
const loadAddProduct = async (req, res) => {
    try {
        const categorydata = await category.find();
        res.render('addproduct', { categorydata });
    } catch (error) {
        console.log(error.message);
    }
}
const addProduct = async (req, res) => {
    try {

        const productdescription = req.body.description;
        // const arrayimg = productdescription.image;
        console.log(req.body.description);
        const images = [];
        const file = req.files;
        file.forEach(element => {
            const image = element.filename;
            images.push(image);
        });
        const productdata = await Product.findOne({ description: productdescription });
        // const offerprice = (req.body.price) - (req.body.price) * (req.body.offer) / 100;

        const errors = {};
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            errors.name = 'Please provide a product name.';
            errors.description = 'Please provide a product description.';
            errors.images = 'Please provie image'
            errors.categorydata = 'please choose one category'
            errors.brand = 'Please provide a brand name'
            errors.price = 'please provide price'
            errors.quantity = 'Please provide Quantity'
            res.render('addproduct', { message: "", errors })
        } else {

            if (productdata) {
                res.render('addproduct', { message1: "Product already exists" });
            } else {
                const product = new Product({
                    name: req.body.name,
                    description: req.body.description,
                    image: images,
                    brand: req.body.brand,
                    price: req.body.price,
                    category: req.body.category,
                    quantity: req.body.quantity,
                    // offer: req.body.offer,
                    // offerprice: offerprice, // Use the calculated offerprice variable here
                    is_blocked: false,
                });

                const productdata = await product.save();
                res.render('addproduct', { message: 'Product added successfully', product: productdata });
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}




const loadUpdateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const productdata = await Product.findById(id).populate('category')
        const categorydata = await category.find()
        const images = productdata.image
        const imagefile = images.map((item) => {
            return item
        });

        res.render('updateProduct', { Product: productdata, images: imagefile, categorydata })
    } catch (error) {
        console.log(error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        const errors = {};
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            errors.name = 'Please Update a product name.';
            errors.description = 'Please Update a product description.';
            errors.images = 'Please Update image'
            errors.brand = 'Please update a brand name'
            errors.price = 'please update provide price'
            errors.quantity = 'Please  Update provide Quantity'
            res.render('updateProduct', { message: "", errors })
        }

        const id = req.params.id;

        const productdata = await Product.findById(id);
        const exImage = productdata.image;
        const files = req.files;
        let updImages = [];
        if (files && files.length > 0) {
            const newImages = req.files.map((file) => file.filename);
            updImages = [...exImage, ...newImages]
            productdata.image = updImages;
        } else {
            updImages = exImage;
        }
        const { name, price, description, category, quantity, brand } = req.body
        console.log(productdata, "Product is getting............")
        await Product.findByIdAndUpdate(id, {
            $set: {
                name: name,
                description: description,
                image: updImages,
                category: category,
                price: price,
                brand: brand,
                quantity: quantity,
                is_blocked:false
            }
        }, { new: true });
        res.redirect('/admin/product')

    } catch (error) {
        console.log(error.message);
    }
}

const blockProduct = async (req, res) => {
    try {
        await Product.findOneAndUpdate(
            { _id: req.query.id },
            { $set: { is_blocked: true } }
        )
        res.redirect('product');
    } catch (error) {
        console.log(error.message)
    }
}

const unBlockProduct = async (req, res) => {

    try {
        await Product.findOneAndUpdate(
            { _id: req.query.id },
            { $set: { is_blocked: false } }
        );
        // console.log(productdata,'line 158..........');
        res.redirect('product');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadProduct,
    loadAddProduct,
    addProduct,
    loadUpdateProduct,
    updateProduct,
    blockProduct,
    unBlockProduct

}