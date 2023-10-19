const express = require('express');
const expenseController = require('../controller/expense');
const { Model } = require('sequelize');
const userAuthentication = require('../middleware/auth')

const router = express.Router();


router.post("/expense/add-expense",userAuthentication.authenticate,expenseController.postExpense);
router.get("/expense/get-expense",userAuthentication.authenticate,expenseController.getExpense);
router.delete("/expense/delete-expense/:id",userAuthentication.authenticate,expenseController.deleteExpense);
router.put("/expense/edit-expense/:id",userAuthentication.authenticate,expenseController.putExpense);


module.exports = router;