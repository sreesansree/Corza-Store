const User = require('../../model/userModel');
const Address = require('../../model/addressModel');

const loadProfile = async (req, res) => {
    try {
        const userId = req.session.userdata._id;
        const userData = await User.findById(userId)

        res.render('profile', { userData })
    } catch (error) {
        console.log(error.message)
    }
}

const editDetails = async (req, res) => {
    try {
        const userData = req.session.userdata;
        res.render('edit_details', { userData });
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                mobile: req.body.mobile,
            }
        }, { new: true });

        console.log(updatedUser, 32222);

        res.redirect('/profile')

    } catch (error) {
        console.log(error.message)
    }
}
const manageAddress = async (req, res) => {
    try {
        const userData = req.session.userdata
        const id = userData._id
        const userAddress = await Address.find({ userId: id })
        res.render('manage_address', { userAddress, userData })

    } catch (error) {
        console.log(error.message)
    }
}

const addNewAddress = async (req, res) => {
    try {
        const userData = req.session.userdata

        res.render('add_new_address', { userData })
    } catch (error) {
        console.log(error.message)
    }
}
const insertNewAddress = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const id = userData._id
        const address = new Address({
            userId: id,
            name: req.body.name,
            mobile: req.body.mobile,
            adressLine1: req.body.address1,
            adressLine2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            pin: req.body.pin,
            is_default: false
        })
        await address.save();
        res.redirect('/adresses')
    } catch (error) {
        console.log(error.message)
    }
}
const addNewAddresss = async (req, res) => {
    try {
        const userData = req.session.userdata

        res.render('add-checkoutaddress', { userData })
    } catch (error) {
        console.log(error.message)
    }
}

const checkoutsaveaddress = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const id = userData._id;
        const { name, mobile, address1, address2, city, state, pin } = req.body
        const address = new Address({
            userId: id,
            name: name,
            mobile: mobile,
            adressLine1: address1,
            adressLine2: address2,
            city: city,
            state: state,
            pin: pin,
        });
        const add = await address.save();
        if (add) {
            res.redirect("/checkout")
        }

    } catch (error) {
        console.log(error.message)
    }

}
const deleteAddress = async (req, res) => {
    try {
        const id = req.params.id

        await Address.findByIdAndDelete(id)
        res.redirect('/adresses')
    } catch (error) {
        console.log(error);
    }
}

const loadeditaddress = async (req, res) => {
    try {
        const userData = req.session.userdata;
        const addressId = req.params.id
        
        const address = await Address.findById(addressId)
        res.render('editaddress', { userData, address })
    } catch (error) {
        console.log(error.message);
    }
}

const editaddress = async (req, res) => {
    try {
        const addressid = req.params.id
        console.log(addressid);
        const id = req.session.userdata._id
        const userData = await User.findById(id)
        console.log(userData,1499)
        const addressData = await Address.findById(addressid)
        console.log(addressData,151);
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            res.render('manage_address', { message: 'please fill the field', userData })

        } else {

            addressData.push({
                name: req.body.name,
                mobile: req.body.mobile,
                adressLine1: req.body.address1,
                adressLine2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                pin: req.body.pin,
                is_default: false
            }, { new: true });
        }
        res.redirect('/adresses')

    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadProfile,
    editDetails,
    updateProfile,
    manageAddress,
    addNewAddress,
    insertNewAddress,
    checkoutsaveaddress,
    addNewAddresss,
    deleteAddress,
    loadeditaddress,
    editaddress
}