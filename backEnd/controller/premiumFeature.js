const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

const getLeaderBoard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // Get the items per page from the query parameters

    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;
    // const total = await User.count();

    const leaderboardofuser = await User.findAndCountAll({
      order: [['totalExpense', 'DESC']],
      offset,
      limit,
    });


    // const leaderboardofuser =await User.findAll({
    //     order:[['totalExpense', 'DESC']]
    // })
console.log('leaderboardofuser>>>>>', leaderboardofuser)
console.log('total>>>',total)
    res.status(200).json({
      leaderboardofuser,
      currentPage: page,
      hasNextPage: offset + itemsPerPage < total,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(leaderboardofuser.count / itemsPerPage),
    });
  } catch (err) {
    console.log("getLeaderBoard error:", err);
    res.status(500).json(err);
  }
};

module.exports = {
  getLeaderBoard,
};
