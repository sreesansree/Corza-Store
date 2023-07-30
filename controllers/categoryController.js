const Category = require("../model/categoryModel");

const loadCategory = async (req, res) => {
    try {
        const categoryData = await Category.find();
        res.render("categorylist", { categoryData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadAddCategory = async (req, res) => {
    try {
        const categoryData = await Category.find();
        console.log(categoryData);
        res.render('addCategory', { categoryData });
    } catch (error) {
        console.log(error.message);
    }
}
const insertCategory = async (req, res) => {
    try {
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            res.render('addCategory', { message: 'please fill the field' })

        } else {
            // const firstlettercap = (str) => {
            //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
            // }

            const name = req.body.name
            const nameLo = name.toLowerCase()

            const categorydata = await Category.findOne({ name: nameLo })
            if (categorydata) {
                res.render('addCategory', { message1: 'Category already exist' })
            } else {
                if (name.trim() == '') {
                    res.render('addCategory', { message1: 'Please Enter a valid Name' })
                } else {
                    const category = new Category({
                        name: name,
                        image: req.file.filename
                    })
                    const categorydata = await category.save()
                    res.render('addCategory', { message: 'Category added successfully', categorydata: categorydata })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};
const loadEditCategory = async (req, res) => {

    try {
        const id = req.query.id
        const categorydata = await Category.findById({ _id: id })
        console.log(categorydata.name, 599999);
        if (categorydata) {
            res.render('editCategory', { category: categorydata })
        } else {
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const updatecategory = async (req, res) => {
    try {
        const id = req.query.id;
       
        // const firstlettercap = (str) => {
        //     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        // }

        const name =req.body.name
        const nameLo =name.toLowerCase()
        const existingCategory =await Category.findOne({name:nameLo})
        if (existingCategory) {
            return res.render("editcategory", { message: "Category exists" });
        }
        const updateCategoy = await Category.findByIdAndUpdate(
            id,
            { name, image: req.file.filename },
            { new: true }
        );
        if (!updateCategoy) {
            return res.status(404).render("editcategory", { message: "Caegory not found" })
        }
        res.redirect("/admin/category");

    } catch(error){
        console.log(error.message)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const _id = req.body.id
        console.log(_id);
        await Category.findByIdAndDelete(_id)
        res.json("done")
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadCategory,
    loadAddCategory,
    insertCategory,
    loadEditCategory,
    updatecategory,
    deleteCategory
}