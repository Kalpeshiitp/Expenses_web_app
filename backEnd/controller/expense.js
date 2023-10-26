const { Model } = require("sequelize");
const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");
const AWS = require("aws-sdk");
require("dotenv").config();

function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IM_USER_KEY = process.env.IM_USER_KEY;
  const IM_USER_SECRET = process.env.IM_USER_SECRET;
  let s3bucket = new AWS.S3({
    accessKeyId: IM_USER_KEY,
    secretAccessKey: IM_USER_SECRET,
  });
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read", 
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong", err);
        reject(err);
      } else {
        console.log("success", s3response);
        resolve(s3response);
      }
    });
  });
}

const downloadExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);
    console.log(fileURL);
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log("something went wrong", err);
    res.status(500).json({ success: false, message: err });
  }
};
const postExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { money, description, type } = req.body;
    if (money === undefined || money.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Parameter missing" });
    }

    const data = await Expense.create(
      {
        money: money,
        description: description,
        type: type,
        userId: req.user.id,
      },
      { transaction: t }
    );

    // Calculate the new totalExpense
    const newExpense = Number(money);
    console.log("newExpense>>>>>", newExpense);
    const updatedTotalExpense = Number(req.user.totalExpense) + newExpense;

    // Update the user's totalExpense in the database
    await User.update(
      { totalExpense: updatedTotalExpense },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};



const getExpense = async (req, res) => {
  const ITEMS_PER_PAGE = 5;
  try {
    const page = +req.query.page || 1;
    console.log("page>>>>",page)

    const total = await Expense.count({ where: { userId: req.user.id } });
    console.log("total expense itme >>>>",total)
    const totalItem = total;

    const expenses = await Expense.findAll({
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    });
 console.log("expenses>>>>",expenses)
    const user = await User.findOne({ where: { id: req.user.id } });
    const expenseSum = user.totalExpense;
    console.log("expensSum>>",expenseSum);
    
    res.status(200).json({
      expenses:expenses,
      expenseSum:expenseSum,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItem,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItem / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const getExpense = async (req, res) => {
//   try {
//     const expenses = await Expense.findAll({ where: { userId: req.user.id } });
//     const user = await User.findOne({ where: { id: req.user.id } });
//     const expenseSum = user.totalExpense;
//     res.status(200).json({ allExpense: { expenses, expenseSum } });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// };

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    if (expense.userId !== req.user.id) {
      console.log("expense.userId:", expense.userId);
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this expense" });
    }

    const expenseAmount = expense.money;
    const user = await User.findByPk(req.user.id);
    user.totalExpense -= expenseAmount;
    await User.update(
      { totalExpense: user.totalExpense },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );
    await expense.destroy({ where: { userId: req.user.id }, transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const putExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ error: err.message });
    }
    res.status(200).json(expense);
    if (expense.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this expense" });
    }
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  downloadExpenses,
  postExpense,
  getExpense,
  deleteExpense,
  putExpense,
};
