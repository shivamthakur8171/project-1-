const mongoose = require('mongoose');

 
const walletSchema = new mongoose.Schema({
    userId : {
        type : String
    }, 
    status : {
        type : Boolean,
        default : false
    },
    wallet : {
        type : Number,
        default : 0
    }
},{timestamps : true});

const wallet = new mongoose.model("Wallet",walletSchema);

module.exports = wallet;