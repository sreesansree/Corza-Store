const moment = require('moment');
const Sale = require('../../model/orderModel');
const Order = require('../../model/orderModel');
const PDFDocument = require('pdfkit');
const hbs = require('hbs');
const ejs = require('ejs');



hbs.registerHelper("json", function (context) {
    return JSON.stringify(context)
})


const loadDashboard = async (req, res) => {
    try {

        res.render('dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
   loadDashboard

}