const mongoose = require('mongoose')

const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log('Db connected');

    } catch (error) {
        console.log("Data base error");
    }
} 

module.exports ={dbConnect}
