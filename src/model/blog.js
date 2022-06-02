const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    userId : {
        type :"ObjectId",
    },
    title :{
        type : String,
        required : true,
        minlength : 3,
        maxlength : 50
    },
    subject : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 100
    },
    description :  {
        type : String,
        required :  true,
        minlength : 100,
        maxlength : 1000
    },
    imagePath : {
        type : String
    },
    status : {
        type : Boolean,
        default : false
    },
    comment : {
        type : String,
    }
},{timestamps : true})

const blog = new mongoose.model("blog",blogSchema);

module.exports = blog;