const userLoginRole = async (req,res , next) =>{
    try{
        if (req.userdetail._id == "624d75498abc716867ba43dd") {         
            next();
        }else{
            res.json(" you are not access to this route. ");
        }
    }catch(err){
        console.log(err);
    }
}
module.exports = userLoginRole;