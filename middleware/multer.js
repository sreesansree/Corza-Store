const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs');
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const imageFilter = function (req, file, cb) {
    // accept image only  
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
};


const store = multer({ storage: storage, fileFilter: imageFilter });


// // image crop  
// const  sharpImage = (req, res, next) => {
//     req.files.forEach(file => {
//         const inputBuffer = fs.readFileSync(file.path);
//         sharp(inputBuffer)
//             .resize({
//                 width: 400,
//                 height: 495,
//                 fit: "cover"
//             })
//             .toFile(file.path, (err) => {
//                 if (err) throw err;
//             });
//     });
//     next();
// };

module.exports = { 
    store, 
    // sharpImage
 }