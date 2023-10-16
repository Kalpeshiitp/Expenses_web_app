const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const SignUp = require('./models/signup');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json());

app.post('/user/signup', async (req,res,next)=>{
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;

    try{
        const signup =  await SignUp.create({
            name: name,
            email: email
        })
        res.status(201).send(signup)
        console.log("data successfully sent")
    }catch(err){
        res.status(500).send("error posting the data", err)
    }
})

app.listen(4000)