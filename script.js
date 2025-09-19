const amount = document.getElementById("amount");
const balance = document.getElementById("balance");
const form = document.getElementById("form");
const list = document.getElementById("list");
const text = document.getElementById("text");
const moneyMinus = document.getElementById("money-minus");
const moneyPlus = document.getElementById("money-plus");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions"),
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(event) {
  event.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please, add description and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);

  addTransactionToDOM(transaction);

  updateValues();

  updateLocalStorage();

  text.value = "";
  amount.value = "";
}

// Generate a random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionToDOM(transaction) {
  const item = document.createElement("li");

  // get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  // add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // add inner elements
  item.innerHTML = `
    ${transaction.text} <span>${sign}$ ${Math.abs(
      transaction.amount,
    )}</span><button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
  `;

  // add item to list
  list.appendChild(item);
}

// Update balance, incom and expense values
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update data on local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// INIT APP
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionToDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
