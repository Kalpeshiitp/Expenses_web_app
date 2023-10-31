async function forgotpassword(event) {
  event.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const userDetails = { email };
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://51.20.109.99:4000/password/forgotpassword",
      userDetails,
      { headers: { Authorization: token } }
    );

    if (response.status === 200) {
      document.body.innerHTML +=
     '<div style="color:green;">Mail Successfully sent</div>';
      localStorage.setItem("token", response.data.token);
    } else {
      throw new Error("Something went wrong!!!");
    }
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
  }
}
