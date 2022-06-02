const register = require('../model/register')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpschema = require('./../model/otpschema');
const transporter = require('./../middleware/email');



const loginWithOtp = async (req, res) => {
    try {
        // console.log(`this is the cookie ${req.cookies.jwt}`);
        const email = req.body.email;
        const pass = req.body.password;
        // console.log(pass , email)

        const useremail = await register.findOne({ email: email });
        // console.log(useremail._id)
        //  user already login ........
        if (!useremail) {
            res.status(400).send("email is not match or incorrect e mail")
        }
        // console.log("helooo",useremail);

        if (!useremail.isEmailVerified) {
            res.status(400).send("you are not verified user plz verify");
        }

        const isMatch = await bcrypt.compare(pass, useremail.password);
        // console.log("helooo2",isMatch);

        if (isMatch) {
            const token = jwt.sign({ _id: useremail._id }, process.env.SECRET_KEY, { expiresIn: '24 h' });
            // console.log("the token part ", token);

            // otp generate code ....
            const otp = Math.floor((Math.random() * 10000) + 1);
            // console.log(otp);

            // otp expire code....
            const otpExpireIn = Date.now() + 60 * 1000 * 5;

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Email verify link" <monukashyaptest@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "otp Verify for login ", // Subject line
                html: `<div> please verify the login otp. the otp is <h2>${otp}</h2> </div>.`, // plain text body
            });
            if (info.messageId) {
                res.send("OTP is sent to your Email Account plz check your email");
            } else {
                res.send("error with sending email");
            }
            const otpuserid = await otpschema.findOne({ userid: useremail._id });
            // console.log("====>", otpuserid);

            if (otpuserid && (otpuserid.userid == useremail._id)) {
                // console.log("hiiiii");
                // save tokens and otp in the schema and update the token....
                const otptoken = await otpschema.updateOne({ userid: otpuserid.userid }, {
                    $set: {
                        token: token,
                        otp: otp,
                        otpExpireIn
                    }
                })
            } else {
                // console.log("helllo");
                const otptoken = otpschema({
                    token: token,
                    otp: otp,
                    otpExpireIn,
                    userid: useremail._id
                })
                await otptoken.save((err, doc) => {
                    if (!err) {
                        console.log(doc);
                    } else {
                        console.log(err);
                    }
                });
            }

        } else {
            res.send("Invalid password");  //invalid password
        }
    } catch (err) {
        console.log(err);
    }
}

// logout user
const logout = async (req, res) => {
    try {
        const token = req.cookies.jwt
        // console.log(token);
        if (!(token)) {
            return res.send("please login");
        }
        
        //  jwt.destroy(token)
        res.clearCookie("jwt")
        res.status(200).send("logout success");

    } catch (error) {
        res.status(404).send(error)

    }
}
 
module.exports = {loginWithOtp,logout};