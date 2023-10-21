const uuid = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
            const existingForgotPasswordToken = await Forgotpassword.findOne({
                where: { userId: user.id, active: true }
            });

            if (existingForgotPasswordToken) {
                // If there's an active token for the user, consider sending a reminder instead
                return res.status(200).json({ message: 'Reset password email already sent', success: true });
            }

            const id = uuid.v4();
            const tokenExpiry = new Date(); // Set an expiration time
            tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Expiration time set to 1 hour from now

            await Forgotpassword.create({ id, active: true, userId: user.id, expires: tokenExpiry }).catch(err => {
                throw new Error(err);
            });

            // Create a Nodemailer transporter
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'neva.kreiger60@ethereal.email', // Your email
                    pass: '8FJ6ZgKJCyag2293WG', // Your password
                },
            });

            // Compose the email
            const mailOptions = {
                from: 'neva.kreiger60@ethereal.email',
                to: email,
                subject: 'Password Reset',
                text: 'Click the link to reset your password',
                html: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`,
            };

            // Send the email
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    throw new Error(error);
                } else {
                    return res.status(200).json({ message: 'Link to reset password sent to your email', success: true });
                }
            });
        } else {
            throw new Error('User doesnt exist');
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err, success: false });
    }
};

module.exports = {
    forgotpassword,
};
