const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {


    let testAccount = await nodemailer.createTestAccount();
    // connect with the smpt

    let transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 578,
        auth: {
            user:'kylie.harber15@ethereal.email' ,
            pass: 'Rh6CUs8mf1TmykMvx1',
        }
    });

    let info = await transporter.sendMail({
        from: '"vipin nagar":<vipinnagar8700@gmail.com>',
        to: "vipinnagar8700@gmail.com",
        subject: 'Reset your password',
        text: 'Click the link to reset your password: https://yourwebsite.com/reset-password',
    });

console.log("Message send : %s ",info.messageId);
res.json(info);

};

module.exports = sendMail;