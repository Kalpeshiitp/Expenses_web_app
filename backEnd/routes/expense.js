const express = require('express');
const expenseController = require('../controller/expense');
const { Model } = require('sequelize');

const router = express.Router();


router.post("/expense/add-expense",expenseController.postExpense);
router.get("/expense/get-expense",expenseController.getExpense);
router.delete("/expense/delete-expense/:id",expenseController.deleteExpense);
router.put("/expense/edit-expense/:id",expenseController.putExpense);


module.exports = router;