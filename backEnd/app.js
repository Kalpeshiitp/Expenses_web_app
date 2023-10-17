const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const User = require('./models/user');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json());

app.post('/user/signup', async (req, res, next) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if(existingUser){
           return  res.status(400).send("user already exist")
          
        }
        const user = await User.create({
            name: name,
            email: email,
            password: password
        });
        res.status(201).send(user);
        console.log("Data successfully sent to database");
    } catch (err) {
        res.status(500).send("error posting the data to database " + err); // Fix the line here
    }
});

app.listen(4000)