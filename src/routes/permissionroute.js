const router = require('express').Router();
const authantication = require('../middleware/auth');
const checkPermissions = require('./../middleware/checkpermission');
const {getAllUser,deleteUser, postUser, updateUser} = require('./../controller/crud');
const checkRole = require('../middleware/checkrole');

router.get('/getalluser/:id',authantication,checkRole,checkPermissions,getAllUser);
router.delete('/delete/:id',authantication,checkRole,checkPermissions,deleteUser);
router.post('/postuser/:id',authantication,checkRole,checkPermissions,postUser);
router.patch('/updateuser/:id',authantication,checkRole,checkPermissions,updateUser)

module.exports = router;