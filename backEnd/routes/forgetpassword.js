// const Sib =  require('sib-api-v3-sdk');
// require('dotenv').config()
// const client = Sib.ApiClient.instance
// const express = require('express');
// const router = express.Router()


// router.post('/password/forgotpassword', async (req,res,next)=>{
//  console.log(req.body);
// const apiKey = client.authentication['api-key']
// apiKey.apiKey = process.env.API_KEY

// const tranEmailApi = new Sib.TransactionalEmailsApi()

// const sender= {
//     email:'kkdsofn@gmail.com'
// }

// const receivers = {
//     email: req.body.email
// }
// tranEmailApi.sendTransacEmail({
//     sender,
//     to: receivers,
//     subject: "Interview call letter",
//     textcontent: `interview schedule on 12/11/2023, location Mumabi, please come on time`
// }).then(()=>{
//     console.log("email sent")
//     res.status(200).json({message:"email successfuly sent"})
// }).catch((err)=>{
//     console.log('email failed to sent',err)
//     res.status(500).json({message:"email failed to sent", error: err})
// })
// })

// module.exports = router;
