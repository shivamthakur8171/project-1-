const route = require('express').Router();
const authantication = require('../middleware/auth');
const {registration, updateUser, forgetPassword, userProfile} = require('./../controller/user');
const {loginWithOtp ,logout} =require('./../controller/login&logout');
const {verifyReg,verifyOtpLogin,forgetUpdatePassword} = require('./../controller/verify');

route.post('/registration',registration);
route.post('/loginwithotp',loginWithOtp);
route.get('/logout',authantication,logout);
route.patch('/updateuser',authantication,updateUser);
route.post('/forgetpassword',forgetPassword);
route.get('/userprofile',userProfile);

route.get('/registration/verify/:token/:id',verifyReg);
route.get('/verifyotplogin/:token',verifyOtpLogin);
route.post('/forgetupdatepass/:forgettoken/:id',forgetUpdatePassword);

module.exports = route;