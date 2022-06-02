const masterRoute = require('express').Router();
const userRoute = require('./userroute');
const route = require('./route');
const permissionRoute = require('./permissionroute');
const walletRoute = require('./walletroute'); 
const blog = require('./blog');


masterRoute.use('/user', userRoute);
masterRoute.use('/user',route);
masterRoute.use('/permission',permissionRoute);
masterRoute.use('/wallet',walletRoute);
masterRoute.use('/blog',blog);

module.exports = masterRoute