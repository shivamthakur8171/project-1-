const mongoose = require("mongoose");
const validator =require('validator');

// create a schema for user registration
const registerSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required: true,
        minlength : 3
    },
    lastName:{
        type : String,
        required: true,
        minlength : 3
    },
    email:{
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    mobile:{
        type: String,
        required : true,
        validate: {
            validator: function (v) {
              return /^[0-9]{10}/.test(v);
            },
            message: `{VALUE} is not a valid 10 digit number!`
          }
    },
    password :{
        type : String,
        required : true,
        
    },
    isEmailVerified : {
        type:Boolean,
        required:true,
        default:false
    },
    token :[ {
        type : String,
    }],
    roleid : {
        type : "ObjectId" ,
        ref: "Role"
    }
});


// create a collection using Models
const register = new mongoose.model("registration",registerSchema);

module.exports= register;