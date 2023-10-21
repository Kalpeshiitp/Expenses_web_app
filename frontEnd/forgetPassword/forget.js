async function forgotpassword(event) {
   event.preventDefault()
   const email  =  document.getElementById('email').value;
   const userDetails = {
    email: email
   }    
   const token = localStorage.getItem('token')
    console.log("userDetails>>>>",userDetails)
  const data= await  axios.post('http://localhost:4000/password/forgotpassword',userDetails,{headers:{'Authorization':token}}).then(response => {
        if(response.status === 200){
            document.body.innerHTML += '<div style="color:green;">Mail Successfuly sent <div>'
            alert("shortly you will get mail to reset your password")
            localStorage.setItem('token', res.data.token)
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}