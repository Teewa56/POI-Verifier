const nodemailer = require('nodemailer');
const AppError = require('./appError');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        });

        const mailOptions = {
            from: 'Proof of Insight <no-reply@proofofinsight.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw new AppError('There was an error sending the email. Try again later!', 500);
    }
};

module.exports = sendEmail;