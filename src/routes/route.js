const route = require('express').Router();
const login = require ('../controller/login');
const authantication = require('../middleware/auth');
const logoutAllUser = require('../controller/logoutalluser');
const profileImage = require('../controller/imageupload');
const {multipleImage ,imageGet, updateMultipleImg, deleteImage} = require('../controller/multipleimg');
const profileImg = require('../controller/profileimg');
const userLoginRole = require('./../middleware/loginuserimg');
const router = require('./permissionroute');
const {multipleImgUpload ,multipleImgGet, imgDelete, multipleImgUpdate} = require('../controller/multipleimgupload');


route.post('/login',login);
route.get('/logoutalluser',authantication,logoutAllUser);
route.post('/profileimage',authantication, profileImage.single('profile'),profileImg);

route.post('/multipleimage',authantication,profileImage.array('image') ,userLoginRole,multipleImage);
route.get('/multipleimage/get',authantication ,userLoginRole ,imageGet);
route.patch('/updatemultipleimg/:id/:image',profileImage.single('image'),userLoginRole ,updateMultipleImg);
route.delete('/deleteimage/:id/:image',deleteImage);

router.post('/multipleimgupload/:id',profileImage.array('image'),multipleImgUpload);
route.get('/multipleimgget/:id',multipleImgGet);
route.patch('/multipleimgupdate/:id/:name',profileImage.single('image'),multipleImgUpdate);
route.delete('/multipleimgdelete/:id/:name',imgDelete)

route.get('/populateschema', async (req,res)=>{
    // populate code
    const getdata = await roleAndPermission.find().populate('roleid').populate('permissionid')

    //  data save in roleandpermission db
    // const data = roleAndPermission({
    //     roleid:'624d75498abc716867ba43db',
    //     permissionid:['624d8a00a94362ae03fb9532','624d8a00a94362ae03fb9533','624d8a00a94362ae03fb9534','624d8a00a94362ae03fb9535']
    // })
    // await data.save();
    // console.log(data);

    res.json(getdata)
    // console.log(getdata);
});

module.exports = route;