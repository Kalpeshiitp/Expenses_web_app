const express = require('express')
const router = express.Router();
const forgotpasswordController = require('../controller/resetpassword')
const authenticatemiddleware = require('../middleware/auth');


router.post('/password/forgotpassword',authenticatemiddleware.authenticate,forgotpasswordController.forgotpassword );

module.exports = router;

