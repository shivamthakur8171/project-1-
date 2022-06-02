const register = require('../model/register');


const logoutAllUser = async (req , res) =>{
    try{
        // console.log(req.userdetail);

        // logout all users
        req.userdetail.token = [];
        res.clearCookie("jwt");
        // console.log("logout");
        await req.userdetail.save();
        res.status(201).send("you are logout successfully...")
    }catch(err){
        res.status(500).send(err);
    }
}

module.exports = logoutAllUser;