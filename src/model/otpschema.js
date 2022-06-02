const mongoose = require('mongoose');

// create schema for save otp
const otpSchema = new mongoose.Schema({
    token : String,
    otp : Number,
    otpExpireIn : Date,
    userid : String
})

// create a collection using Models
const otp = new mongoose.model("otp",otpSchema);

module.exports= otp;