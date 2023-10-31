async function login(event) {
    try {  event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const loginObj = {
        email: email,
        password: password,
      };

        const response = await axios.post(
          "http://51.20.109.99:4000/user/login",
          loginObj
        );
          if(response.status===200){
          alert(response.data.message)
          window.location.href = "../expense/expense.html";
          localStorage.setItem('token',response.data.token)
          }
        
      } catch (err) {
        if (err.response) {
          console.log("Response Status:", err.response.status);
        }
      }
    }


    function forgetPassword() { 
        
        window.location.href = "../forgetPassword/forget.html";
    }