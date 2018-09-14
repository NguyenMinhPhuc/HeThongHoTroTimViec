var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FW_USERNAMEGMAIL,
        pass: process.env.FW_PASSWORDGMAIL
    }
});

module.exports = { transporter };