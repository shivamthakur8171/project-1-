const lang = require('../helper/lang');
const register = require('../model/register');
const transaction = require('../model/transaction');
const wallet = require('./../model/wallet');


const walletReg = async (req, res) => {
    try {
        const userdetail = req.userdetail;
        // console.log(userdetail._id);
        const walletData = await wallet.findOne({ userId: userdetail._id });
        // console.log(walletData);
        if (walletData == null) {
            const createWallet = new wallet({
                userId: userdetail._id
            })
            createWallet.save();
            res.status(200).send(lang.WALLET_CREATED);
        } else {
            res.status(200).send(lang.WALLET_ALREADY);
        }
    } catch (err) {
        console.log(err);
    }
}

const walletActivate = async (req, res) => {
    try {
        const userdetail = req.userdetail;
        // console.log(userdetail._id);
        const walletData = await wallet.findOne({ userId: userdetail._id });
        // console.log(walletData.status);
        if (walletData.status == true) {
            res.status(200).send("Wallet Already Activated please use the wallet")
        } else {
            const walletData = await wallet.findOneAndUpdate({ userId: userdetail._id }, { status: true });
            res.status(200).send("Wallet Activate Successfully");
        }
    } catch (err) {
        console.log(err);
    }
}

const addMoneyInWallet = async (req, res) => {
    try {
        const userdetail = req.userdetail;
        const money = req.body.wallet;
        // console.log(userdetail._id,money);
        if (money < 1) {
            res.status(401).send("You can not Add money less than 1");
        };
        const walletData = await wallet.findOne({ userId: userdetail._id });
        // console.log(walletData.wallet);
        const currentMoney = walletData.wallet + money
        // console.log(currentMoney);
        const walletUpdate = await wallet.findOneAndUpdate({ userId: userdetail._id }, {
            $set: {
                wallet: currentMoney,
                updatedAt: Date.now()
            }
        });
        // console.log(walletUpdate, "hello");
        const transactionData = await transaction.create({
            userId: userdetail._id,
            amount: "+" + money,
            to: userdetail.firstName + " " + userdetail.lastName,
            mobile: userdetail.mobile,
            paidAt: Date.now()
        })
        // console.log(transactionData, "hiiii");
        transactionData.save();
        res.status(201).json("money add successfully in the wallet");

    } catch (err) {
        console.log(err);
    }
}

const sendMoney = async (req, res) => {
    try {
        const userdetail = req.userdetail;
        const mobile = req.body.mobile;
        const money = req.body.money;
        // console.log(userdetail,mobile,money)
        if (userdetail.mobile == mobile){
            res.status(401).send("You can not send money to your self");
        }
        if (money <= 1) {
            res.status(401).send("You can not send money less than 1");
        };
        const walletData = await wallet.findOne({ userId: userdetail._id });
        // console.log(walletData.wallet);
        if (walletData.wallet < money) {
            res.status(401).send("You Don't have sufficient Balance in your Accont Plz check Your Balance");
        };
        const receiver = await register.findOne({ mobile: mobile });
        // console.log(receiver._id);
        const receiverData = await wallet.findOne({ userId: receiver._id });
        // console.log(receiverData);
        if (receiverData == null) {
            res.status(401).send("User Don't have a wallet account so you cannot send money to the user");
        };
        if (receiverData.status == false) {
            res.status(401).send("User Wallet is not activated so you can not send money to the user");
        };

        const sendMoney = walletData.wallet - money;
        const walletUpdate = await wallet.findOneAndUpdate({ userId: userdetail._id }, {
            $set: {
                wallet: sendMoney,
                updatedAt: Date.now()
            }
        });
        const transactionData = await transaction.create({
            userId: userdetail._id,
            amount: "-" + money,
            to: receiver.firstName + " " + receiver.lastName,
            mobile: receiver.mobile,
            paidAt: Date.now(),
            from: userdetail.firstName + " " + userdetail.lastName
        });

        const receiveMoney = receiverData.wallet + money;
        await wallet.findOneAndUpdate({ userId: receiver._id }, {
            $set: {
                wallet: receiveMoney,
                updatedAt: Date.now()
            }
        });
        const transactionData1 = await transaction.create({
            userId: receiver._id,
            amount: "+" + money,
            from: userdetail.firstName + " " + userdetail.lastName,
            mobile: userdetail.mobile,
            // to: receiver.firstName + " " + receiver.lastName,
            paidAt: Date.now()
        });
        res.status(201).send("Money send successfully");

    } catch (err) {
        console.log(err);
    }
}

const userTransactionHistory = async (req, res) => {
    try {
        const userdetail = req.userdetail;
        const walletData = await transaction.find({ userId: userdetail._id });
        // console.log(walletData);
        if (walletData == null) {
            res.status(401).send("there is no transaction history.");
        }
        res.send({ status: 200, data: walletData })
    } catch (err) {
        console.log(err);
    }
}

const checkBalance = async (req, res) =>{
    try{
        const userdetail = req.userdetail;
        // console.log(userdetail);
        const balance = await wallet.find({ userId: userdetail._id });
        // console.log(balance[0].wallet);
        res.status(201).send(`Avalable Balance : ${balance[0].wallet}`);
    }catch(err){
        console.log(err);
    }
}

module.exports = { walletReg, walletActivate, addMoneyInWallet, sendMoney, userTransactionHistory ,checkBalance}