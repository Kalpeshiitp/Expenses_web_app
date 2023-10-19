const express = require('express');
const purchaseController = require('../controller/purchase');
const authenticatemiddleware = require('../middleware/auth');
const { Model } = require('sequelize');

const router = express.Router();

router.get('/purchase/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasePremium)
router.post('/purchase/updatetransactionstatus',authenticatemiddleware.authenticate,purchaseController.updateTransactionStatus)
router.get('/user/premium-status', authenticatemiddleware.authenticate,purchaseController.premiumStatus );


module.exports = router;