const register = require('./../model/register');
const userRole = require('./../model/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('./../middleware/email');

const getAllUser = async (req, res) => {
    try {
        /// req.newpermision 
        const userPermission = req.newpermission;
        // console.log(userPermission);
        if (!userPermission.includes("read")) {
            return res.status(400).json("You can not access this route .");
        }
        const data = await register.find();
        res.status(200).send({ "status": 200, data });
    } catch (error) {
        res.status(400).send({ "status": 400, error })
    }
}
const postUser = async (req, res) => {
    try {
        /// req.permision 
        // console.log(req.newpermission);
        const userPermission = req.newpermission;
        if (!userPermission.includes("create")) {
            return res.status(400).json("You can not access this route .");
        }
        // all input
        const { email, firstName, lastName, mobile, password, confirmpassword, roleid } = req.body;
        // check if user already exist.......
        const oldUser = await register.findOne({ email });
        // console.log(oldUser);

        const registerRole = await userRole.findOne({ _id: req.body.roleid });
        // console.log(registerRole);
        if (oldUser) {
            return res.status(400).json({ "msg": "User Already Exist. Please Login" });
        }
        if (!registerRole) {
            return res.status(400).json({ "msg": "your role not exist" });
        }
        // check all input filled required........
        if (!(email && firstName && lastName && mobile && password && confirmpassword && roleid)) {
            return res.status(400).json("All Input Filled Is required")
        }
        // check password .......
        if (!(password === confirmpassword)) {
            return res.status(400).json('Password Is Not Matched')
        }
        // mobile number validation using regex..................
        const mobileValidation = /^[0-9]{10,12}$/;
        const mobilevalcheck = mobileValidation.test(mobile)
        if (!mobilevalcheck) {
            return res.status(400).json("Mobile Number Invalid")
        }
        //email validation using regex.........
        const emailValidation = /^[a-z0-9._-]+@[a-z0-9.-]+.[a-z]+.[a-z0-9]{2,}$/;
        const emailValcheck = emailValidation.test(email);
        if (!emailValcheck) {
            return res.status(400).json('Email Is Invalid')
        }
        // password validation usinng regex.............
        const passwordValidate = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\/\!#%*^?&])[a-zA-Z0-9\d@$\/\!#^%*?&]{8,}/;
        const passwordvalcheck = passwordValidate.test(password);
        if (!passwordvalcheck) {
            return res.status(400).json('Please Enter Strong Password');
        }

        // bcrypt password............
        const bcryptpassword = await bcrypt.hash(password, 10);
        // save data in database
        let userData = register({
            email,
            firstName,
            lastName,
            mobile,
            password: bcryptpassword,
            roleid
        });
        // console.log(userData._id);
        // genrate token
        const emailverifytoken = jwt.sign({ id: userData._id }, process.env.EMAIL_VERIFY, { expiresIn: '10 minutes' });
        // console.log(emailverifytoken);
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Email verify link" <monukashyaptest@gmail.com>', // sender address
            to: userData.email, // list of receivers
            subject: "Email Verify link ", // Subject line
            text: "plz verify the email click on the below link ", // plain text body
            html: `
                <div>
                    <h2> Hello </h2>
                    <h4> this e mail is valid only 15 min</h4>
                    <p> please change the password click on the below link</p>
                    <a href='http://localhost:8000/user/registration/verify/${emailverifytoken}/${userData._id}'>click here</a>
                    <p>http://localhost:8000/user/registration/verify/${emailverifytoken}/${userData._id}</p>
                </div>`

        });
        // console.log("hiiii");
        if (info.messageId) {
            res.send("Link is sent to your Email Account plz check your email");
        } else {
            res.send("error with sending email");
        }
        await userData.save();
        // reponse
        res.status(200).json("Register successfully check your email and verify your account")
    } catch (error) {
        res.status(400).send({ "status": 400, error })
    }
}

const updateUser = async (req, res) => {
    try {
        const userPermission = req.newpermission;
        const id = req.params.id;
        // console.log(id);
        // console.log(userPermission);
        if (!userPermission.includes("update")) {
            return res.status(400).json("You can not access this route .");
        }

        // console.log("fdhhfdf")
        if (req.body.password || req.body.comfirmpassword) {
            res.status(401).json({
                status: "Fail",
                Msg: "you cannot update password from here"
            })
        }

        const {email,firstName , lastName ,mobile,roleid} = req.body;

        const updateUser = await register.updateOne({ _id: id }, {
            $set: {
                email,
                firstName,
                lastName,
                mobile,
                roleid
            }
        });
        res.status(200).send({ "status": 200, "msg": "user successfully update" })
    } catch (error) {
        res.status(400).send({ "status": 400, error })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userPermission = req.newpermission;
        if (!userPermission.includes("delete")) {
            return res.status(400).json("You can not access this route .");
        }
        const id = req.params.id;
        const userDelete = await register.deleteOne({ _id: id });

        res.status(200).send({ "status": 200, "msg": "user delete successfully" })
    } catch (error) {
        res.status(400).send({ "status": 400, error })
    }
}

module.exports = { getAllUser, deleteUser, postUser, updateUser }