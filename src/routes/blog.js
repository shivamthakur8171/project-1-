const route = require("express").Router();
const authantication = require('./../middleware/auth');
const checkRole = require('./../middleware/checkrole');
const {regBlock , activeBlog , notActivateBlog ,checkAllBlogStatus, readBlog, checkBlogStatus } = require('./../controller/blog');
const profileImage = require('./../controller/imageupload');

route.post('/regblog',authantication,profileImage.single('image') ,regBlock);
route.get('/activeblog',authantication,checkRole ,activeBlog);
route.get('/notactivatetheblog',authantication,checkRole ,notActivateBlog);
route.get('/checkallblogstatus',authantication,checkAllBlogStatus);
route.get('/checkblogstatus',authantication,checkBlogStatus)
route.get('/readblog',readBlog);

module.exports = route;