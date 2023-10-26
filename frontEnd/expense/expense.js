//expense details
function expensesDetails(event) {
  event.preventDefault();
  const money = document.getElementById("money").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("expenseType").value;

  const obj = {
    money,
    description,
    type,
  };
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:4000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      showExpense(response.data.newExpenseDetail);
      // showExpense(response.data);
    })
    .catch((err) => {
      console.log(err);
      document.body.innerHTML += "<h4>Something is wrong</h4>";
    });
}


//showPremiumUserMessage
function showPremiumUserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user";
}
function showDownloadButton() {
const button = document.getElementById("downloadexpense");
button.style.display = "block";
}

function parseJwt(token) {
  if (!token) {
    return null;
  }
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const ispremiumuser = decodeToken.ispremiumuser;

  if (ispremiumuser) {
    showPremiumUserMessage();
    showLeaderBoard();
    expenseTable();
    showDownloadButton();
  }
  const page =1;

  const response =  await axios
     .get(`http://localhost:4000/expense/get-expense?page=${page}`,{
     headers: { Authorization: token },
 })
 console.log("get response>>>>", response )
 showExpense(response.data.expenses)
 showpagination(response.data);
 }
);

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:4000/purchase/premiummembership",
    {
      headers: { Authorization: token },
    }
  );

  const options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      try {
        const res = await axios.post(
          "http://localhost:4000/purchase/updatetransactionstatus",
          {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        );
        console.log(res);
        alert("You are a Premium User Now");
        showPremiumUserMessage();
        localStorage.setItem("token", res.data.token);
        showLeaderBoard();
      } catch (error) {
        console.error(error);
        alert("Transaction status update failed");
      }
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong");
  });
};

function showLeaderBoard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userleaderBoardArray = await axios.get(
      "http://localhost:4000/premium/showleaderboard",
      {
        headers: { Authorization: token },
      }
    );
    console.log("userleaderBoardArray>>>>", userleaderBoardArray);

    var leaderBoardElm = document.getElementById("leaderBoard");

    // Clear the previous content
    leaderBoardElm.innerHTML = "";

    // Add the new content
    leaderBoardElm.innerHTML += "<h1>Leader Board </h1>";
    userleaderBoardArray.data.forEach((userDetails) => {
      leaderBoardElm.innerHTML += `<li>Name-${userDetails.name} Total Expense-${userDetails.totalExpense}</li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
}

//expense table and for premium user
async function expenseTable() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Expense Table";
  inputElement.onclick = async () => {
    window.location.href = "../expenseTable/table.html";
  };
  document.getElementById("message").appendChild(inputElement);
}

function showExpense(expenses) {
  document.getElementById("money").value = "";
  document.getElementById("description").value = "";

  document.getElementById("expenseType").value = "";

  const parentNode = document.getElementById("expenseList");
  parentNode.innerHTML = ''
  expenses.forEach((expense)=>{
    const childNode = document.createElement("li");
  childNode.id = `expense-${expense.id}`;
  childNode.innerHTML = `
    ${expense.money} - ${expense.description} - ${expense.type} 
    <button class="edit-button" data-expense-id="${expense.id}" onclick="editExpense('${expense.money}', '${expense.description}', '${expense.type}', '${expense.id}')">Edit</button>
    <button class="delete-button" data-expense-id="${expense.id}" onclick="deleteExpense('${expense.id}')">Delete</button>
`
  parentNode.appendChild(childNode);
  })
}
function download() {
  const token = localStorage.getItem("token");
  console.log("token for downloading the expense file", token);

  axios
    .get("http://localhost:4000/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 200) {
        const a = document.createElement("a");
        a.href = response.data.fileURL.Location;
        a.download = "myexpense.txt";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.error("Error getting the download list", err);
    });
}

function showpagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
}){
  const pagination = document.getElementById('pagination')
  pagination.innerHTML = ''

  if(hasPreviousPage){
    const btn2 = document.createElement('button');
    btn2.innerHTML = 'previous'
    btn2.addEventListener('click', ()=> getExpense(previousPage))
    pagination.appendChild(btn2)
  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = `${currentPage}`
  btn1.addEventListener('click', ()=> getExpense(currentPage))
  pagination.appendChild(btn1)

  if(hasNextPage){
    const btn3 = document.createElement('button')
    btn3.innerHTML = 'Next'
    btn3.addEventListener('click',()=> getExpense(nextPage))
    pagination.appendChild(btn3)
  }

  if(lastPage){
    const btn4 =document.createElement('button');
    btn4.innerHTML = 'Last'
    btn4.addEventListener('click',()=> getExpense(lastPage))
    pagination.appendChild(btn4)
  }
}

async function getExpense(page){
  const token = localStorage.getItem('token')
  try{
    const response =  await axios
       .get(`http://localhost:4000/expense/get-expense?page=${page}`,{
       headers: { Authorization: token },
   })
   console.log("get response>>>>", response )
   showExpense(response.data.expenses)
   showpagination(response.data);
  }catch(err){
    console.log(err)
  }
}


function editExpense(money, description, type, expenseId) {
  const token = localStorage.getItem("token");
  axios
    .put(`http://localhost:4000/expense/edit-expense/${expenseId}`, null, {
      headers: { Authorization: token },
    })
    .then((response) => {
      const expense = response.data;
      document.getElementById("money").value = expense.money;
      document.getElementById("description").value = expense.description;
      document.getElementById("expenseType").value = expense.type;
      removeExpenseFromScreen(expenseId);
    })
    .catch((err) => {
      console.log(err);
      document.body.innerHTML += "<h4>Failed to fetch expense details</h4>";
    });
}

function deleteExpense(expenseId) {
  const token = localStorage.getItem("token");
  axios
    .delete(`http://localhost:4000/expense/delete-expense/${expenseId}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeExpenseFromScreen(expenseId);
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeExpenseFromScreen(expenseId) {
  const expenseToRemove = document.getElementById(`expense-${expenseId}`);
  if (expenseToRemove) {
    expenseToRemove.remove();
  }
}


