const register = require('../model/register')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../middleware/email');
const lang = require('./../helper/lang');
const resHelper = require('./../helper/resHelper');

// register user
const registration = async (req, res) => {
    try {
        // password and confirm password match;
        if (req.body.password === req.body.confirmpassword) {

            // password validation using regex;
            const passwordValidate = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;
            const passwordvalcheck = passwordValidate.test(req.body.password);
            // console.log(passwordvalcheck);

            if (!passwordvalcheck) {
                return res.status(400).send("please enter strong password");
            }

            //bcrypt password 
            const bycyptpassword = await bcrypt.hash(req.body.password, 10);
            // console.log({bycyptpassword});

            // add bcrypt password in the db
            const registerDataPayload = { ...req.body, password: bycyptpassword }
            // console.log({registerDataPayload , body: req.body})

            const registerdata = new register(registerDataPayload);
            // console.log("the success part",registerdata._id);
            await registerdata.save();

            //generate token 
            const emailverifytoken = jwt.sign({ _id: registerdata._id }, process.env.EMAIL_VERIFY, { expiresIn: "15 min" });
            // console.log(emailverifytoken);

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Email verify link" <monukashyaptest@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "Email Verify link ", // Subject line
                text: "plz verify the email click on the below link ", // plain text body
                html: `
            <div>
                <h2> Hello </h2>
                <h4> this e mail is valid only 15 min</h4>
                <p> please change the password click on the below link</p>
                <a href='http://localhost:8000/user/registration/verify/${emailverifytoken}/${registerdata._id}'>click here</a>
                <p>http://localhost:8000/user/registration/verify/${emailverifytoken}/${registerdata._id}</p>
            </div>`

            });
            if (info.messageId) {
                resHelper.successResponse(res,lang.EMAILCHECK);
            } else {
                res.send("error with sending email");
            }
        } else {
            res.status(500).send("password and confirm password is not match")
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

//update user 
const updateUser = async (req, res) => {
    try {
        const userDb = req.userdetail;
        // console.log("user",userDb)

        if (req.body.password || req.body.comfirmpassword) {
            res.status(401).json({
                status: "Fail",
                Msg: "you cannot update password from here"
            })
        }

        const { firstName, lastName, mobile } = req.body;
        // console.log(firstName);
        const updateuser = await register.findOneAndUpdate({ _id: userDb._id }, {
            $set: {
                firstName,
                lastName,
                mobile,
            }
        })
        //  console.log(updateuser)
        res.status(201).send("User update successfully");
    } catch (err) {
        res.status(400).send(err);
    }
}

// forget password 
const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        // console.log(email);

        // find user in db
        const useremail = await register.findOne({ email: email });
        // console.log(useremail)

        if (!useremail) {
            return res.status(400).send("user with this email does not exist")
        }

        //generate token 
        const forgetpasswordtoken = jwt.sign({ _id: useremail._id }, process.env.FORGET_KEY, { expiresIn: "15 min" });
        // console.log(forgetpasswordtoken);

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"forget password mail" <monukashyaptest@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "password reset link ", // Subject line
            text: "plz change the password click on the below link ", // plain text body
            html: `
            <div>
                <h2> Hello ${useremail.firstName}</h2>
                <h4> this e mail is valid only 15 min</h4>
                <p> please change the password click on the below link</p>
                <a href='http://localhost:8000/user/forgetupdatepass/${forgetpasswordtoken}/${useremail._id}'>click here</a>
                <p>http://localhost:8000/user/forgetupdatepass/${forgetpasswordtoken}/${useremail._id}</p>
            </div>`

        });
        if (info.messageId) {
            res.send("Link is sent to your Email Account plz check your email");
        } else {
            res.send("error with sending email");
        }
    } catch (err) {
        res.status(404).send(err)
    }
}

// user profile
const userProfile = async (req, res) => {
    try {
        const currentUser = req.cookies.jwt

        if (!currentUser) {
            return res.status(400).json("you are not login please login")
        }
        // console.log(currentUser);

        const verifytoken = jwt.verify(currentUser, process.env.SECRET_KEY);
        if (!verifytoken) {
            return res.status(404).json("Invalid token")
        }
        // console.log(verifytoken);

        const userFind = await register.findOne({ _id: verifytoken._id });

        if (!userFind) {
            return res.status(404).json("user  can not find in database")
        }
        // console.log(userFind);

        const currentUserDb = {
            "Name": userFind.firstName,
            "LastName": userFind.lastName,
            "Mobile": userFind.mobile

        }
        res.status(200).json(currentUserDb);
    } catch (err) {
        res.status(400).send(err);
    }
}

// profile by id ...
const profileById = async (req, res) => {
    try {
        const userId = req.params.id
        // console.log(userId);
        const loginUser = req.userdetail
        // console.log(loginUser);
        const currentUserDb = {
            "Name": loginUser.firstName,
            "LastName": loginUser.lastName,
            "Mobile": loginUser.mobile

        }
        // console.log(currentUserDb);
        res.status(200).json(currentUserDb);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { registration, updateUser, forgetPassword, userProfile, profileById };