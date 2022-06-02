const jwt = require("jsonwebtoken");
const register = require('../model/register');


const authantication = async (req, res, next) => {
    try {

        let token = req.headers.authorization.split(' ')[1]
        // console.log(token);
        if (!token) return res.status(403).json("token is require for this route");
        
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
        //  console.log(verifytoken);

        const userdetail = await register.findOne({ _id: verifytoken._id });

        if (!userdetail) {
            return res.status(403).json("user not found");
        }
        // console.log(userdetail); 
        req.token = token;
        req.userdetail = userdetail;
        next();
    } catch (err) {
        res.status(401).send({
            msg: 'please verify your identity',
            err
        });
    }
}

module.exports = authantication;