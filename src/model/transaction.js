const mongoose = require ('mongoose');

const transactionSchema = new mongoose.Schema({
    userId : String,
    amount : {
        type: String,
        required : true
    },
    to : {
        type : String,
    },
    mobile :{
        type : Number
    },
    from : {
        type : String
    },
    comment : String
},{timestamps : true});

const transaction = new mongoose.model("transaction",transactionSchema);

module.exports = transaction;