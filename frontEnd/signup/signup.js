async function signup(event) {
    try{event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value; 
    const password = document.getElementById("password").value;

    const signupObj = {
      name: name,
      email: email,
      password: password,
    };
      const response = await axios.post(
        "http://localhost:4000/user/signup",
        signupObj
      );
      if (response.status === 201) {
        window.location.href = "../login/login.html";
      } else {
        console.log("Error during signup, unable to redirect to login");
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response) {
        console.log("Response Status:", err.response.status);
        console.log("Response Data:", err.response.data);
      }
    }
  }