const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('authorization');
    
    if (!token) {
      // No token provided in the request
      return res.status(401).json({ success: false, message: 'Token must be provided' });
    }

    const user = jwt.verify(token, 'secretKey');
    console.log('userId >>>', user.userId);
    const response = await User.findByPk(user.userId);
    req.user = response;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = {
  authenticate,
};
