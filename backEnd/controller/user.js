const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretKey');
};

const postUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const isValid = (value) => value !== null && value !== undefined && value !== '';
    if (!isValid(name) || !isValid(password) || !isValid(email)) {
      return res.status(400).json({ error: "Bad parameters. Something is missing." });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing the password." });
      }

      await User.create({ name, email, password: hash });
      res.status(201).json({ message: "Successfully created a new user." });
    });
  } catch (err) {
    res.status(500).json({ error: "Error posting the data to the database: " + err });
  }
};

// const postUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     const isValid = (value) => value !== null && value !== undefined && value !== '';
//     if (!isValid(name) || !isValid(password) || !isValid(email)) {
//       return res.status(400).json({ error: "Bad parameters. Something is missing." });
//     }

//     bcrypt.hash(password, 10, async (err, hash) => {
//       if (err) {
//         return res.status(500).json({ error: "Error hashing the password." });
//       }

//       await User.create({ name, email, password: hash });
//       res.status(201).json({ message: "Successfully created a new user." });
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Error posting the data to the database: " + err });
//   }
// };

const postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const isValid = (value) => value !== null && value !== undefined && value !== '';
    if (!isValid(email) || !isValid(password)) {
      return res.status(400).json({ error: "Bad parameters. Something is missing." });
    }

    const user = await User.findAll({ where: { email: email } });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error comparing passwords." });
        }

        if (result === true) {
          res.status(200).json({ success: true, message: "Login successful", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser) });
        } else {
          return res.status(401).json({ success: false, message: "Password is incorrect" });
        }
      });
    } else {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: "Error posting the data to the database: " + err });
  }
};


module.exports = {
  generateAccessToken,
  postLogin,
  postUser
};

