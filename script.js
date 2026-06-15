let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = parseInt(localStorage.getItem("budget")) || 0;

let chart;

// Set Budget
function setBudget() {
  budget = parseInt(document.getElementById("budgetInput").value);
  localStorage.setItem("budget", budget);
  updateUI();
}

// Add Expense
function addExpense() {
  let title = document.getElementById("title").value;
  let amount = parseInt(document.getElementById("amount").value);
  let category = document.getElementById("category").value;

  if (!title || !amount) return;

  expenses.push({ title, amount, category });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  updateUI();
}

// Delete
function deleteExpense(i) {
  expenses.splice(i, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

// Update UI
function updateUI() {
  let total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let remaining = budget - total;

  document.getElementById("total").innerText = total;
  document.getElementById("budgetDisplay").innerText = budget;
  document.getElementById("remaining").innerText = remaining;

  displayExpenses();
  updateChart();
  checkAlert(total);
}

// Expense list
function displayExpenses() {
  let list = document.getElementById("expenseList");
  list.innerHTML = "";

  expenses.forEach((e, i) => {
    let li = document.createElement("li");
    li.innerHTML = `${e.title} ₹${e.amount} 
      <button onclick="deleteExpense(${i})">X</button>`;
    list.appendChild(li);
  });
}

// Chart
function updateChart() {
  let data = {};

  expenses.forEach(e => {
    data[e.category] = (data[e.category] || 0) + e.amount;
  });

  let labels = Object.keys(data);
  let values = Object.values(data);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: values
      }]
    }
  });
}

// Alerts
function checkAlert(total) {
  let alertBox = document.getElementById("alertBox");

  if (total > budget) {
    alertBox.innerText = "⚠️ Budget exceeded!";
  } else {
    alertBox.innerText = "";
  }
}

// Load
updateUI();