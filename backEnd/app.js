const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const jsonParser = bodyParser.json();
const app = express();
app.use(cors());
const dotenv = require("dotenv");

const User = require("./models/user");
const Forgotpassword = require("./models/forgotpassword");
const Expense = require("./models/expense");
const Order = require("./models/orders");

const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premiumFeature");
const resetPasswordRoutes = require("./routes/resetPassword");

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

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
