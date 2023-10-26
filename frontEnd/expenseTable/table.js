window.addEventListener("DOMContentLoaded", async () => {
  const page =1;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/expense/get-expense?page=${page}&itemsPerPage=${itemsPerPage}`, {
        headers: { 'Authorization': token }
      });
      console.log(response)

      // Extract the expense data and totalExpense from the response
      const expenseData = response.data.expenses;
      console.log(expenseData)
      const totalExpense = response.data.expenseSum;
      console.log(totalExpense)
      showExpenseTable(expenseData,totalExpense)
      showTablepagintion(response.data)

    } catch (err) {
      console.error("Error fetching data for the expense table", err);
    }
  });

function showExpenseTable(expenseData,totalExpense){
      // Create a table element
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');

      // Create table headers
      const headerRow = document.createElement('tr');
      const headers = ['Date', 'Description', 'Category', 'Expense'];

      headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Populate the table with expense data
      expenseData.forEach((expense) => {
        const expenseRow = document.createElement('tr');
        const dateCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        const categoryCell = document.createElement('td');
        const expenseCell = document.createElement('td');

        // Format the date (you can use a library like moment.js for better date formatting)
        dateCell.textContent = new Date(expense.createdAt).toLocaleDateString();
        descriptionCell.textContent = expense.description;
        descriptionCell.style.whiteSpace = 'normal'; // Allow text to wrap
        categoryCell.textContent = expense.type;
        expenseCell.textContent = expense.money;

        expenseRow.appendChild(dateCell);
        expenseRow.appendChild(descriptionCell);
        expenseRow.appendChild(categoryCell);
        expenseRow.appendChild(expenseCell);

        tbody.appendChild(expenseRow);
      });

      // Create a row for totalExpense (merging the first three columns)
      const totalRow = document.createElement('tr');
      const totalCell = document.createElement('td');
      totalCell.colSpan = 3; // Merge first three columns
      totalCell.textContent = 'Total Expense:';
      const totalExpenseCell = document.createElement('td');
      totalExpenseCell.textContent = totalExpense;

      totalRow.appendChild(totalCell);
      totalRow.appendChild(totalExpenseCell);
      tbody.appendChild(totalRow);

      table.appendChild(tbody);

      // Replace existing content with the table
      const existingContent = document.getElementById('expenseTableContainer');
      existingContent.innerHTML = '';
      existingContent.appendChild(table);
}


let itemsPerPage = 5; 
let currentPage = 1;

const itemsPerPageSelect = document.getElementById("itemsPerPage");
itemsPerPageSelect.addEventListener("change", () => {
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  currentPage = 1; 
  getExpenseTable(currentPage);
});

function showTablepagintion({
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
    btn2.addEventListener('click', ()=> getExpenseTable(previousPage))
    pagination.appendChild(btn2)
  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = `${currentPage}`
  btn1.addEventListener('click', ()=> getExpenseTable(currentPage))
  pagination.appendChild(btn1)

  if(hasNextPage){
    const btn3 = document.createElement('button')
    btn3.innerHTML = 'Next'
    btn3.addEventListener('click',()=> getExpenseTable(nextPage))
    pagination.appendChild(btn3)
  }
  if(lastPage){
    const btn4 =document.createElement('button');
    btn4.innerHTML = 'Last'
    btn4.addEventListener('click',()=> getExpenseTable(lastPage))
    pagination.appendChild(btn4)
  }
}

async function getExpenseTable(page){
  const token = localStorage.getItem('token')
  try{
    const response =  await axios
       .get(`http://localhost:4000/expense/get-expense?page=${page}&itemsPerPage=${itemsPerPage}`,{
       headers: { Authorization: token },
   })
   showExpenseTable(response.data.expenses, response.data.expenseSum)
   showTablepagintion(response.data);
  }catch(err){
    console.log(err)
  }
}