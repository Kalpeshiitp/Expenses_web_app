const express = require('express');
const router = express.Router();
const authenticatemiddleware = require('../middleware/auth');
const premiumFeatureController = require('../controller/premiumFeature');

router.get("/premium/showleaderboard", authenticatemiddleware.authenticate, premiumFeatureController.getLeaderBoard);

module.exports = router;
