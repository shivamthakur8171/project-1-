const register = require('../model/register')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    try {
        // console.log(`this is the cookie ${req.cookies.jwt}`);
        const email = req.body.email;
        const pass = req.body.password;
        // console.log(pass , email)
        const useremail = await register.findOne({ email: email });
        // console.log(useremail.id)
        //  user already login ........
        if (!useremail) {
            res.status(400).send("email is not match or incorrect e mail")
        }
        // console.log("helooo",useremail);
        
        if(!useremail.isEmailVerified){
            res.status(400).send("you are not verified user plz verify");
        }
        
        if (!req.cookies.jwt) {
            // bcrypt password matching
            const isMatch = await bcrypt.compare(pass, useremail.password);
            // console.log("helooo2",isMatch);
            if (isMatch) {
                const token = jwt.sign({ _id: useremail._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
                // console.log("the token part ", token);
                useremail.token = [...useremail.token, token]
                await useremail.save();

                res.cookie("jwt", token);
                // console.log("useremail")

                res.status(201).send({
                    msg: "you are successfully login!",
                    token
                });
            } else {
                res.send("Invalid password");  //invalid password
            }
        }else{
            res.status(400).send("you are already login")
        }
    } catch (err) {
        res.status(400).send({
            msg: "invalid user name and password",
            err
        });
    }
}

module.exports = login;