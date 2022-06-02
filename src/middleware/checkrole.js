const register = require('./../model/register');

const checkRole = async (req, res, next) => {
    try {
        const userdetail = req.userdetail;
        // console.log(userdetail);
        const data = await register.findOne({ _id: userdetail._id }).populate('roleid')
        // console.log(data);
        const user = data.roleid.groupName;
        // console.log(user);
        if(user != 'Super Admin'){
            res.status(404).send(" you cannot access this route you are not a admin");
        }
        next()
    } catch (err) {
        res.status(404).send(err);
    }
}



module.exports = checkRole