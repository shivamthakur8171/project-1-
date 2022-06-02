const nodemailer =  require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter =  nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USER, // generated ethereal user
        pass: process.env.PASSWORD // generated ethereal password
    },
});

module.exports = transporter;