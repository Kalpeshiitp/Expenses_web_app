const express = require('express');
const path = require('path');
const userController = require('../controller/user')

const router = express.Router();

router.post('/user/signup',userController.postUser)

router.post('/user/login',userController.postLogin)



module.exports = router