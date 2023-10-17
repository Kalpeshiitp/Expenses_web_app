const User = require("../models/user");

exports.postUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password
    if (!name || !password || !email) {
      return res.status(400).json({ error: "Bad parameters. Something is missing." });
    } else{ await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json({ message: "Successfully created a new user." });}
   
  } catch (err) {
    res.status(500).send("Error posting the data to the database: " + err);
  }
};
exports.postLogin = async (req, res, next) => {
  try {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ error: "Bad parameters. Something is missing." });
    }

    const user = await User.findOne({ where: { email: email, password: password } });

    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Enter the correct details" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error logging in: " + err });
  }
};



// exports.postLogin = 