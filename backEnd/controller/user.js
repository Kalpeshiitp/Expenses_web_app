const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


function generateAccessToken(id){
  return jwt.sign({userId:id}, 'secretKey')
}

exports.postUser = async (req, res, next) => {
  try {
   const {name,email,password} = req.body;
   const isValid = (value) => value !== null && value !== undefined && value !== '';
    if (!isValid(name) || !isValid(password) || !isValid(email)) {
      return res.status(400).json({ error: "Bad parameters. Something is missing." });
    } 
    bcrypt.hash(password,10, async (err,hash)=>{
   await User.create({name,email,password: hash});
        res.status(201).json({ message: "Successfully created a new user." });
      })
  } catch (err) {
    res.status(500).send("Error posting the data to the database: " + err);
};
}
exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const isValid = (value) => value !== null && value !== undefined && value !== '';
    if (!isValid(email) || !isValid(password)) {
      return res.status(400).json({ error: "Bad parameters. Something is missing." });
    }
    const user = await User.findAll({ where: { email: email } });
    if (user.length>0) {
      bcrypt.compare(password,user[0].password,(err,result)=>{
        if(err){
          throw new Error("something is not right")
        }
        if(result===true){
          res.status(200).json({ success:true, message: "Login successful", token:generateAccessToken(user[0].id)} );
        }
        else{
          return res.status(404).json({success:false, message: "password is incorrect" });
        }
      })
    }
    else{
return res.status(404).json({success:false,message:'User does not exitst'})
    }
  }catch(err){
    res.status(500).send("Error posting the data to the database: " + err);
  }
}
  
