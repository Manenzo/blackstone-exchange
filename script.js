let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  window.location.href = "login.html";
}

function getUser() {
  return users[currentUser];
}

function save() {
  localStorage.setItem("users", JSON.stringify(users));
}

function updateUI() {
  document.getElementById("balance").innerText = getUser().balance;
}

let prices = {
  AAPL: 150,
  TSLA: 220
};

function buy(stock) {
  let user = getUser();

  if (user.balance >= prices[stock]) {
    user.balance -= prices[stock];

    user.portfolio[stock] = (user.portfolio[stock] || 0) + 1;

    save();
    updateUI();
  } else {
    alert("Нет денег");
  }
}

function sell(stock) {
  let user = getUser();

  if ((user.portfolio[stock] || 0) > 0) {
    user.portfolio[stock] -= 1;
    user.balance += prices[stock];

    save();
    updateUI();
  } else {
    alert("Нет акций");
  }
}

updateUI();