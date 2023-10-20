const Expense = require('../models/expense');
const User = require('../models/user');

const getLeaderBoard = async (req, res) => {
  try {
    const users = await User.findAll();
    const expenses = await Expense.findAll();
    console.log(users, expenses);

    const userAggregatedExpenses = {};

    expenses.forEach((expense) => {
      if (userAggregatedExpenses[expense.userId]) {
        userAggregatedExpenses[expense.userId] += expense.money;
      } else {
        userAggregatedExpenses[expense.userId] = expense.money;
      }
    });

    const userLeaderBoardDetails = [];
    users.forEach((user) => {
      userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0 });
    });
    console.log(userLeaderBoardDetails);
    userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);

    // Send the leaderboard as a JSON response
    res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
    console.log("getLeaderBoard error>>", err);
    res.status(500).json(err);
  }
};

module.exports = {
  getLeaderBoard
};
