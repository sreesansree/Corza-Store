

const isLoginAdmin = async (req, res, next) => {
    try {
        if (req.session.admin) {
            next()
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const isLogoutAdmin = async (req, res, next) => {
    try {
        if (req.session.admin) {
            res.redirect('/adminhome');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    isLoginAdmin,
    isLogoutAdmin
}