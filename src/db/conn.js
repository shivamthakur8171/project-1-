const mongoose = require('mongoose');
const logger = require("./winston");


exports.Connect = () => {
    mongoose.connect(process.env.DB).then(() => {
        logger.info("databse connection sucessfull");

    }).catch((err) => {
        logger.info("no connection", err);
    })
}
