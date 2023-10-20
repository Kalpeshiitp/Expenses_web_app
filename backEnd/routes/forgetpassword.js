const Sib =  require('sib-api-v3-sdk');
require('dotenv').config()
const client = Sib.ApiClient.instance

const apiKey = client.authentication['api-key']
apiKey.apiKey = process.env.API_KEY

const tranEmailApi = new Sib.TransactionalEmailsApi()

const sender= {
    email:'kalpeshkumar2678@gmail.com'
}

const receivers = {
    email:'kalpeshkumar267@gmail.com'
}

tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Interview call letter",
    textcontent: `interview schedule on 12/11/2023, location Mumabi, please come on time`
}).then(()=>{
    console.log("email sent")
}).catch((err)=>{
    console.log('email failed to sent',err)
})