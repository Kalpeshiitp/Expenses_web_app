const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const User = require('./models/user');
const userRouter = require('./routes/user')
const expenseRouter = require("./routes/expense")
const cors = require('cors');
const path = require('path')
const jsonParser = bodyParser.json();

const app = express()
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(jsonParser,userRouter);
app.use(jsonParser,expenseRouter )

app.listen(4000)