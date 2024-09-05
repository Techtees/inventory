const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    // create email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.Email_HOST,
        port: 587,
        auth: {
            user: process.env.Email_USER,
            pass: process.env.EMAIL_PASS,

        }
    })

    // options for sending email
    const options = {
        from: sent_from,
        to: send_to,
        repltTo: reply_to,
        subject: subject,
        html: message,
    }

    // send email

    transporter.sendMail(options, function(err, info) {
        if(err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
};

module.export = sendEmail