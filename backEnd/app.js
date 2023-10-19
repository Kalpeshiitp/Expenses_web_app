const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const User = require('./models/user');

const userRouter = require('./routes/user')
const expenseRouter = require("./routes/expense")
const purchaseRouter = require("./routes/purchase")

const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Expense = require('./models/expense');
const jsonParser = bodyParser.json();
const Order = require('./models/orders');
const app = express()
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(jsonParser,userRouter);
app.use(jsonParser,expenseRouter )
app.use(jsonParser, purchaseRouter);

User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);


sequelize.sync().then(()=>{
    app.listen(4000)
})
.catch(err=>{
    console.log(err)
})