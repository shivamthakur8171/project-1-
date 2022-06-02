const route = require('express').Router();
const {fraudTransactionDetail, checkFraudTransaction} = require('../controller/fraudtransaction');
const authantication = require('../middleware/auth');
const {walletReg, walletActivate, addMoneyInWallet, sendMoney, userTransactionHistory, checkBalance} = require('./../controller/wallet');
const checkRole = require('./../middleware/checkrole')

route.post('/reg',authantication,walletReg);
route.post('/activate',authantication,walletActivate);
route.post('/addmoneyinwallet',authantication,addMoneyInWallet);
route.post('/sendmoney',authantication,sendMoney);
route.get('/transactionhistory',authantication,userTransactionHistory);
route.get('/checkbalance',authantication,checkBalance)
route.post('/fraud',authantication,fraudTransactionDetail);
route.post('/fraudcheck',authantication,checkRole,checkFraudTransaction);


module.exports = route;