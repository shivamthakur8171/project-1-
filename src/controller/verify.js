const jwt = require('jsonwebtoken');
const register = require('../model/register');
const otp = require('./../model/otpschema');
const bcrypt = require('bcrypt');
const lang = require("../helper/lang");
const resHelper = require("../helper/resHelper");


// verify registration
const verifyReg = async (req, res) => {
    try {
        const emailtoken = req.params.token;
        const id = req.params.id;
        // console.log(id,emailtoken);

        const verifytoken = jwt.verify(emailtoken, process.env.EMAIL_VERIFY);
        //  console.log(verifytoken);

        const update = await register.findByIdAndUpdate({ _id: id }, { isEmailVerified: true })
        // console.log(update);

        resHelper.sucessResponse(res,lang.REGISTERSUCESS)

    } catch (err) {
        res.status(400).send({
            msg: lang.LINKEXPIRE,
            err
        });
    }
}

// verify otp login
const verifyOtpLogin = async (req, res) => {
    try {
        // res.clearCookie("jwt")
        const token = req.params.token;
        // console.log(token);
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
        //  console.log(verifytoken);
        const data = await otp.findOne({ token: token })
        // console.log(data.otp);

        const currentDate = Date.now() + 60 * 1000 * 1;
        if (currentDate > data.otpExpireIn) {
            // console.log("otp expire")
            resHelper.errorResponse(res,lang.OTP_EXP)
        }
        if (data.otp == req.body.otp) {

            if (!req.cookies.jwt) {
                res.cookie("jwt", token);
                res.status(201).send({
                    msg: lang.LOGIN,
                    token
                });
            } else {
                resHelper.errorResponse(res,lang.ALREADY_LOGIN)
            }
        } else {
            resHelper.errorResponse(res,lang.OTP_VALID);
        }

    } catch (err) {
        res.status(400).send(err);
    }
}

// forget password update
const forgetUpdatePassword = async (req, res) => {
    try {
        const forgetpasswordtoken = req.params.forgettoken;
        const id = req.params.id;
        // console.log(forgetpasswordtoken);

        const verifytoken = jwt.verify(forgetpasswordtoken, process.env.FORGET_KEY);
        // console.log('hlio',verifytoken);

        const userdetail = await register.findOne({ _id: id });
        // console.log(userdetail);

        //  passsword and confirm password is not match......
        if (req.body.password === req.body.confirmpassword) {

            // password validation using regex;
            const passwordValidate = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;
            const passwordvalcheck = passwordValidate.test(req.body.password);

            // console.log(passwordvalcheck);
            if (!passwordvalcheck) {
                return resHelper.errorResponse(res,lang.STRONG_PASSWORD);
            }

            //bcrypt password 
            const bycyptpassword = await bcrypt.hash(req.body.password, 10);
            // console.log(bycyptpassword); 

            // password change ....
            const updatepassowrd = await register.updateOne({ _id: id }, { $set: { password: bycyptpassword } });
            resHelper.sucessResponse(res,lang.PASSWORD_CHANGE)
        } else {
            resHelper.errorResponse(res,lang.PASSWORD_CONFIRM);
        }
    } catch (err) {
        res.status(400).send({
            msg: lang.LINKEXPIRE,
            err
        });
    }
}

module.exports = { verifyReg, verifyOtpLogin, forgetUpdatePassword };