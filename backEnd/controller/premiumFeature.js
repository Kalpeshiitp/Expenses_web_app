const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

const getLeaderBoard = async (req, res) => {
  try {
    const leaderboardofuser =await User.findAll({
        order:[['totalExpense', 'DESC']]
    })
    res.status(200).json(leaderboardofuser)
  } catch (err) {
    console.log("getLeaderBoard error:", err);
    res.status(500).json(err);
  }
};

module.exports = {
  getLeaderBoard,
};
