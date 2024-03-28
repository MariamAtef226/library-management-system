const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) create a transporter
    var transporter = nodemailer.createTransport({
        // service: 'Gmail',

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

        // sendGrid and Mailgun are better services than gmail
        // development service --> mail trap
    });

    // 2) define email options
    const mailOptions = {
        from: 'Mariam Atef <mariam@mail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    
    // 3) actually send email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;