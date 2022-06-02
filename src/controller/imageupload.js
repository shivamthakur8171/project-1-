const multer = require('multer');
const path = require("path")

// storage engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req, file , callback) =>{
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const uploadImage = multer({
    storage:storage,
    fileFilter: (req, file, cb) => {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg"
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
    limits:{
        fieldSize: 1 * 1024 * 1024,
    }
})


module.exports = uploadImage;