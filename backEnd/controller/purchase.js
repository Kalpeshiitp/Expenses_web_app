const Razorpay = require('razorpay');
const Order = require('../models/orders');
require('dotenv').config();
const User = require('../models/user');
const userController = require('../controller/user')


exports.purchasePremium = async(req,res)=>{
    try{
var rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
const amount = 2500;
rzp.orders.create({amount,currency:"INR"},(err,order)=>{
    if(err){
        console.log(err)
        throw new Error(JSON.stringify(err));
    }
    req.user.createOrder({orderid:order.id, status:'PENDING'}).then(()=>{
        return res.status(201).json({ order, key_id: rzp.key_id });
    }).catch(err=>{
        console.log(err)
        throw new Error(err)
    })
})
    }catch(err){
    console.log(err);
    res.status(403).json({message:'something went wrong', error:err})
    }
}

exports.updateTransactionStatus = async (req, res) => {
    try {
      const userId = req.user.id;
      const { payment_id, order_id } = req.body;
      console.log("paymentid, orderid", req.body);
      const order = await Order.findOne({ where: { orderid: order_id } });
  
      const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
      const promise2 = req.user.update({ ispremiumuser: true });
  
      Promise.all([promise1, promise2]).then(() => {
        return res.status(202).json({ success: true, message: 'Transaction Successful', token: userController.generateAccessToken(userId, undefined, true) });
      }).catch((error) => {
        throw new Error(error);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message, message: 'Something went wrong' });
    }
  };


exports.premiumStatus = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (user && user.ispremiumuser) {
        // User is a premium member
        res.status(200).json({ isPremiumMember: true });
      } else {
        // User is not a premium member
        res.status(200).json({ isPremiumMember: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }


