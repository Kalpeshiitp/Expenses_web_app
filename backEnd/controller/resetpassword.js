const uuid = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Forgotpassword = require("../models/forgotpassword");

// Forgot Password Request
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    // const t = await sequelize.transaction()

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    const existingForgotPasswordToken = await Forgotpassword.findOne({
      where: { userId: user.id, active: true },
    });

    if (existingForgotPasswordToken) {
      return res
        .status(200)
        .json({ message: "Reset password email already sent", success: true });
    }

    const id = uuid.v4();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);

    await Forgotpassword.create({
      id,
      active: true,
      expireby: tokenExpiry,
      userId: user.id,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "alysa.parisian23@ethereal.email",
        pass: "F1GvxjwKQ6b7gTUBpB",
      },
    });

    const mailOptions = {
      from: "alysa.parisian23@ethereal.email",
      to: email,
      subject: "Password Reset",
      text: "Click the link to reset your password",
      html: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
    return res
      .status(200)
      .json({
        message: "Link to reset password sent to your email",
        success: true,
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error in forgot password", success: false });
  }
};

// Reset Password
const resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotPasswordRequest = await Forgotpassword.findOne({
      where: { id },
    });

    if (!forgotPasswordRequest) {
      return res
        .status(404)
        .json({ error: "Reset password request not found", success: false });
    }

    if (forgotPasswordRequest.active === false) {
      return res
        .status(400)
        .json({ error: "Token has already been used", success: false });
    }

    // Mark the reset token as used
    forgotPasswordRequest.update({ active: false });

    return res.status(200).send(`<html>
      <body style="background: skyblue">
        <script>
          function formsubmitted(e) {
            e.preventDefault();
            console.log('called');
          }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
        </form>
      </body>
    </html>`);
  } catch (err) {
    console.error("Error resting the password:", err);
    return res
      .status(500)
      .json({ error: "Error resetting the password", success: false });
  }
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params; // Make sure 'resetpasswordid' is in the URL

    console.log("Received new password:", newpassword);
    console.log("Received reset password ID:", resetpasswordid);

    // Check if the reset password token is valid and active
    const resetPasswordRequest = await Forgotpassword.findOne({
      where: { id: resetpasswordid },
    });

    console.log("Reset Password Request:", resetPasswordRequest);

    if (!resetPasswordRequest) {
      console.log("Invalid or expired reset password token");
      return res
        .status(400)
        .json({
          error: "Invalid or expired reset password token",
          success: false,
        });
    }

    // Find the user associated with the reset password request
    const user = await User.findOne({
      where: { id: resetPasswordRequest.userId },
    });

    console.log("User Found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found, success: false" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newpassword, salt);

    // Update the user's password
    await user.update({ password: hash });

    console.log("Password successfully updated");

    return res
      .status(201)
      .json({ message: "Password successfully updated", success: true });
  } catch (error) {
    console.error("Error in password update:", error);
    return res
      .status(403)
      .json({ error: "Password update failed", success: false });
  }
};

module.exports = {
  forgotpassword,
  resetpassword,
  updatepassword,
};
