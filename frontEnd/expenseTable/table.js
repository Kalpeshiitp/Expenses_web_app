window.addEventListener("DOMContentLoaded", async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/expense/get-expense', {
        headers: { 'Authorization': token }
      });
      console.log(response)

      // Extract the expense data and totalExpense from the response
      const expenseData = response.data.allExpense.expenses;
      console.log(expenseData)
      const totalExpense = response.data.allExpense.expenseSum;
      console.log(totalExpense)

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
    } catch (err) {
      console.error("Error fetching data for the expense table", err);
    }
  });