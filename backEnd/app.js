const express = require("express");
const fs = require('fs')
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const jsonParser = bodyParser.json();
const app = express();
app.use(cors());
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan')

const User = require("./models/user");
const Forgotpassword = require("./models/forgotpassword");
const Expense = require("./models/expense");
const Order = require("./models/orders");

const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premiumFeature");
const resetPasswordRoutes = require("./routes/resetPassword");
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a'})

app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream:accessLogStream}));
// const privateKey = fs.readFileSync('server.key')
// const certificate = fs.readFileSync('server.cert')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(jsonParser, userRouter);
app.use(jsonParser, expenseRouter);
app.use(jsonParser, purchaseRouter);
app.use(jsonParser, premiumRouter);
app.use(jsonParser, resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT || 4000)
})
.catch((err)=>{
    console.log(err)
})

 
