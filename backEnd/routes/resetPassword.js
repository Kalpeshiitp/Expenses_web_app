const express = require('express')
const router = express.Router();
const forgotpasswordController = require('../controller/resetpassword')

router.post('/password/forgotpassword',forgotpasswordController.forgotpassword );
router.get('/password/resetpassword/:id',forgotpasswordController.resetpassword);
router.get('/password/updatepassword/:resetpasswordid',forgotpasswordController.updatepassword);

module.exports = router;

