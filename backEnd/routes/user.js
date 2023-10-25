const express = require('express');
const userController = require('../controller/user')
const userAuthentication = require('../middleware/auth')
const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/user/signup',userController.postUser)

router.post('/user/login',userController.postLogin)

router.get('/user/download', userAuthentication.authenticate,expenseController.downloadExpenses)

module.exports = router